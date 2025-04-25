<?php

namespace Piwik\Plugins\HeatmapSessionRecording;

use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrBlob;
use Piwik\Plugins\HeatmapSessionRecording\Dao\LogHsrEvent;

class MutationManipulator
{
    /**
     * @var Configuration
     */
    private $configuration = null;

    /**
     * @var string
     */
    public $nonce; //change to public for testcases to overwrite

    public function __construct(Configuration $configuration)
    {
        $this->configuration = $configuration;
        $this->generateNonce();
    }

    public function manipulate($initialMutation, $idSiteHsr, $idLogHsr)
    {
        $parseAndSanitizeCssLinks = $this->updateCssLinks($initialMutation, $idSiteHsr, $idLogHsr);

        return $this->sanitizeNodeAttributes($parseAndSanitizeCssLinks);
    }

    public function updateCssLinks($initialMutation, $idSiteHsr, $idLogHsr)
    {
        if ($this->configuration->isLoadCSSFromDBEnabled()) {
            $blob = new LogHsrBlob();
            $dao = new LogHsrEvent($blob);
            $cssEvents = $dao->getCssEvents($idSiteHsr, $idLogHsr);
            if (!empty($cssEvents) && !empty($initialMutation)) {
                $initialMutation = $this->updateInitialMutationWithInlineCss($initialMutation, $cssEvents);
            }
        }

        return $initialMutation;
    }

    public function getNonce()
    {
        if (!$this->nonce) {
            $this->generateNonce();
        }


        return $this->nonce;
    }

    public function generateNonce()
    {
        $this->nonce = $this->generateRandomString();
    }

    private function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function sanitizeNodeAttributes($initialMutation)
    {
        $initialMutationArray = json_decode($initialMutation, true);
        if (!empty($initialMutationArray['children'])) {
            $this->parseMutationArrayRecursivelyToSanitizeNodes($initialMutationArray['children']);
            $initialMutation = json_encode($initialMutationArray);
        }

        return $initialMutation;
    }

    public function updateInitialMutationWithInlineCss($initialMutation, $cssEvents)
    {
        $formattedCssEvents = $this->formatCssEvents($cssEvents);
        $initialMutationArray = json_decode($initialMutation, true);
        if (!empty($initialMutationArray['children']) && !empty($formattedCssEvents)) {
            $this->parseMutationArrayRecursivelyForCssLinks($initialMutationArray['children'], $formattedCssEvents);

            $initialMutation = json_encode($initialMutationArray);
        }

        return $initialMutation;
    }

    public function formatCssEvents($cssEvents)
    {
        $formatted = array();
        foreach ($cssEvents as $cssEvent) {
            if (!isset($formatted[md5(trim($cssEvent['url']))])) { //Only use the first one since the o/p is sorted by ID in ascending order
                $formatted[md5(trim($cssEvent['url']))] = $cssEvent;
            }
        }

        return $formatted;
    }

    private function parseMutationArrayRecursivelyForCssLinks(&$nodes, $cssEvents, &$id = 900000000)
    {
        foreach ($nodes as &$node) {
            $parseChildNodes = true;
            if (isset($node['tagName']) && $node['tagName'] == 'LINK' && !empty($node['attributes']['url']) && !empty($cssEvents) && !empty($cssEvents[md5(trim($node['attributes']['url']))]['text'])) {
                $parseChildNodes = false;
                $content = $cssEvents[md5(trim($node['attributes']['url']))]['text'];
                if (!empty($content)) {
                    $node['tagName'] = 'STYLE';
                    $media = $node['attributes']['media'] ?? '';
                    if (isset($node['attributes'])) {
                        $node['attributes'] = [];
                    }
                    $node['attributes']['nonce'] = $this->getNonce();
                    if ($media) {
                        $node['attributes']['media'] = $media;
                    }
                    $node['childNodes'] = [
                        [
                            'nodeType' => 3,
                            'id' => $id++,
                            'textContent' => $content
                        ]
                    ];
                }
            }

            if ($parseChildNodes && !empty($node['childNodes'])) {
                $this->parseMutationArrayRecursivelyForCssLinks($node['childNodes'], $cssEvents, $id);
            }
        }
    }

    private function parseMutationArrayRecursivelyToSanitizeNodes(&$nodes)
    {
        foreach ($nodes as &$node) {
            if (!empty($node['attributes'])) {
                // empty all the attributes with base64 and contains javascript/script/"("
                // Eg: <embed src=data:text/javascript;base64,YWxlcnQoMSk=></embed> OR <iframe srcdoc=&lt;script&gt;alert&lpar;1&rpar;&lt;&sol;script&gt;></iframe>
                foreach ($node['attributes'] as $nodeAttributeKey => &$nodeAttributeValue) {
                    // had to double encode `\x09` as `\\\\x09` in MutationManipulatorTest.php to make json_decode work, else it was giving "syntax error"  via json_last_error_msg()
                    // Due to double encoding had to add entry for both "\\x09" and "\x09"
                    $nodeAttributeValue = str_replace(["\\x09", "\\x0a", "\\x0d", "\\0", "\x09", "\x0a", "\x0d", "\0"], "", $nodeAttributeValue);
                    $htmlDecodedAttributeValue = html_entity_decode($nodeAttributeValue, ENT_COMPAT, 'UTF-8');
                    if (
                        $htmlDecodedAttributeValue &&
                        (
                            stripos($htmlDecodedAttributeValue, 'ecmascript') !== false ||
                            stripos($htmlDecodedAttributeValue, 'javascript') !== false ||
                            stripos($htmlDecodedAttributeValue, 'script:') !== false ||
                            stripos($htmlDecodedAttributeValue, 'jscript') !== false ||
                            stripos($htmlDecodedAttributeValue, 'vbscript') !== false
                        )
                    ) {
                        $nodeAttributeValue = '';
                    } elseif (stripos($nodeAttributeValue, 'base64') !== false) {
                        $base64KeywordMadeLowerCase = str_ireplace('base64', 'base64', $nodeAttributeValue);
                        //For values like data:text/javascript;base64,YWxlcnQoMSk= we split the value into 2 parts
                        // part1: data:text/javascript;base64
                        // part2: ,YWxlcnQoMSk= we split the value into 2 parts
                        // we determine the position of first comma from second part and try to decode the base64 string and check fo possible XSS
                        // cannot assume the position of firstComma to be `0` since there can be string with spaces in beginning
                        $attributeExploded = explode('base64', $base64KeywordMadeLowerCase);
                        array_shift($attributeExploded);
                        if (!empty($attributeExploded)) {
                            foreach ($attributeExploded as $attributeExplodedValue) {
                                $htmlDecodedAttributeString = html_entity_decode($attributeExplodedValue, ENT_COMPAT, 'UTF-8');
                                $base64DecodedString = base64_decode($attributeExplodedValue);
                                $base64UrlDecodedString = base64_decode(urldecode($attributeExplodedValue));
                                if (
                                    $this->isXssString($base64DecodedString) ||
                                    $this->isXssString($base64UrlDecodedString) ||
                                    $this->isXssString($htmlDecodedAttributeString) ||
                                    $this->isXssString(urldecode($htmlDecodedAttributeString))
                                ) {
                                    $nodeAttributeValue = '';
                                    break;
                                }
                            }
                        }
                    } elseif ($nodeAttributeValue) {
                        $htmlDecodedString = html_entity_decode($nodeAttributeValue, ENT_COMPAT, 'UTF-8');
                        if (
                            $this->isXssString($htmlDecodedString) ||
                            $this->isXssString(urldecode($htmlDecodedString))
                        ) {
                            $nodeAttributeValue = '';
                        }
                    }
                }
            }

            if (!empty($node['childNodes'])) {
                $this->parseMutationArrayRecursivelyToSanitizeNodes($node['childNodes']);
            }
        }
    }

    private function isXssString($value)
    {
        if (
            !empty($value) &&
            (
                stripos($value, 'script:') !== false ||
                stripos($value, 'javascript') !== false ||
                stripos($value, 'ecmascript') !== false ||
                stripos($value, '<script') !== false ||
                stripos($value, 'script>') !== false ||
                strpos($value, '&#') !== false // Wll handle decimal cases without trailing semicolon
                // eg: <IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041>
            )
        ) {
            return true;
        }

        return false;
    }
}
