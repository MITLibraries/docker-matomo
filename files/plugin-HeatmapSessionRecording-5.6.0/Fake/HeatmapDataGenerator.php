<?php

/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret or copyright law.
 * Redistribution of this information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

namespace Piwik\Plugins\HeatmapSessionRecording\Fake;

use Piwik\Plugins\HeatmapSessionRecording\Tracker\RequestProcessor;

/**
 * Fabricates realistic heatmap events (clicks, moves, scrolls) for a single heatmap snapshot.
 *
 * Selectors are derived from the stored page_treemirror via {@see HsrCssPath}, so the generated
 * events line up with the elements the heatmap actually renders. Clicks are weighted toward
 * interactive elements (links, buttons, form fields); mouse movement is spread across all visible
 * elements (movement passes over non-interactive content too). Intended for demo/test data only.
 */
class HeatmapDataGenerator
{
    private const OFFSET_MIN = 40;    // click/move position within an element, out of PIXEL_ACCURACY
    private const OFFSET_MAX = 1960;
    private const SCROLL_ACCURACY = 1000;

    /** relative click weight per element kind */
    private const WEIGHT_CTA = 7;         // button / submit / [role=button]
    private const WEIGHT_LINK = 5;        // a
    private const WEIGHT_FIELD = 4;       // text-like inputs / select / textarea
    private const WEIGHT_LINK_IMAGE = 3;  // img inside an <a>
    private const WEIGHT_TEXT = 1;        // headings / paragraphs (stray clicks)

    /** tags that are not rendered / have no visible area, so movement never lands on them */
    private const NON_VISIBLE_TAGS = [
        'script', 'style', 'head', 'title', 'meta', 'link', 'base', 'noscript',
        'template', 'br', 'wbr', 'param', 'source', 'track', 'col', 'colgroup',
    ];

    /** @var array<int,array{selector:string,weight:int}> weighted interactive targets for clicks */
    private $clickTargets = [];
    /** @var int */
    private $totalWeight = 0;
    /** @var string[] selectors of all visible elements, for (near-uniform) mouse movement */
    private $moveTargets = [];

    public function __construct(string $treemirrorJson)
    {
        $decoded = json_decode($treemirrorJson, true);
        if (!is_array($decoded) || empty($decoded['children'])) {
            return;
        }
        $this->buildTargets(new HsrCssPath($decoded));
    }

    public function hasTargets(): bool
    {
        return $this->totalWeight > 0;
    }

    private function buildTargets(HsrCssPath $cssPath): void
    {
        foreach ($cssPath->elementIds() as $id) {
            $tag = $cssPath->getTagName($id);
            $isVisible = !in_array($tag, self::NON_VISIBLE_TAGS, true);
            $weight = $this->weightFor($cssPath, $id, $tag);
            if ($weight <= 0 && !$isVisible) {
                continue; // neither clickable nor a valid movement target
            }

            $selector = $cssPath->getSelector($id);
            if ($selector === '') {
                continue;
            }
            if ($weight > 0) {
                $this->clickTargets[] = ['selector' => $selector, 'weight' => $weight];
                $this->totalWeight += $weight;
            }
            if ($isVisible) {
                $this->moveTargets[] = $selector;
            }
        }
    }

    private function weightFor(HsrCssPath $cssPath, int $id, ?string $tag): int
    {
        switch ($tag) {
            case 'a':
                return self::WEIGHT_LINK;
            case 'button':
                return self::WEIGHT_CTA;
            case 'select':
            case 'textarea':
                return self::WEIGHT_FIELD;
            case 'input':
                $type = strtolower((string) $cssPath->getAttribute($id, 'type'));
                if (in_array($type, ['submit', 'button', 'reset'], true)) {
                    return self::WEIGHT_CTA;
                }
                if (in_array($type, ['hidden', 'checkbox', 'radio'], true)) {
                    return 0;
                }
                return self::WEIGHT_FIELD;
            case 'img':
                return $cssPath->isWithinTag($id, 'a') ? self::WEIGHT_LINK_IMAGE : 0;
            case 'h1':
            case 'h2':
            case 'h3':
            case 'p':
                return self::WEIGHT_TEXT;
            default:
                if (strtolower((string) $cssPath->getAttribute($id, 'role')) === 'button') {
                    return self::WEIGHT_CTA;
                }
                return 0;
        }
    }

    /**
     * Build one recording's worth of events for a visit.
     *
     * The viewport is taken from the visit's tracked screen resolution when given: the `res`
     * tracking param determines the heatmap device group (LogHsr::getDeviceType()), so a mobile
     * visit must not carry a desktop-sized viewport/fold.
     *
     * @param mixed $faker \Faker\Generator; Faker ships in VisitorGenerator's vendor dir, so the
     *                     class is not resolvable from this plugin and the param stays untyped
     * @param int|null $screenWidth the visit's tracked resolution, used as the viewport
     * @param int|null $screenHeight
     * @return array{events:array,total_time:int,viewport_width:int,viewport_height:int,scroll_max:int,fold:int}|null
     */
    public function generateVisit($faker, ?int $screenWidth = null, ?int $screenHeight = null): ?array
    {
        if (!$this->hasTargets()) {
            return null;
        }

        if (!empty($screenWidth) && !empty($screenHeight)) {
            [$vw, $vh] = [$screenWidth, $screenHeight];
        } else {
            [$vw, $vh] = $faker->randomElement([[1920, 1080], [1536, 864], [1440, 900], [1366, 768]]);
        }
        $docHeight = $faker->numberBetween(2400, 6000);
        $fold = (int) round(($vh / $docHeight) * self::SCROLL_ACCURACY);

        $numClicks = $faker->numberBetween(1, 6);
        $numMoves = $faker->numberBetween(2, 8);
        $numScrolls = $faker->numberBetween(1, 4);

        $events = [];
        $time = $faker->numberBetween(200, 900);

        // interleave moves and clicks
        $actions = array_merge(array_fill(0, $numClicks, 'click'), array_fill(0, $numMoves, 'move'));
        shuffle($actions);
        foreach ($actions as $action) {
            $time += $faker->numberBetween(150, 1400);
            $isClick = ($action === 'click');
            $events[] = [
                'ti' => $time,
                'ty' => $isClick ? RequestProcessor::EVENT_TYPE_CLICK : RequestProcessor::EVENT_TYPE_MOVEMENT,
                's'  => $isClick ? $this->pickClickSelector($faker) : $this->pickMoveSelector($faker),
                // even numbers only, matching the tracker (it bumps odd offsets to even to
                // reduce row cardinality when grouping / archiving, see tracker.js)
                'x'  => $faker->numberBetween(self::OFFSET_MIN / 2, self::OFFSET_MAX / 2) * 2,
                'y'  => $faker->numberBetween(self::OFFSET_MIN / 2, self::OFFSET_MAX / 2) * 2,
            ];
        }

        // scrolls (down the page)
        $scrollMax = $faker->numberBetween(150, 350);
        for ($i = 0; $i < $numScrolls; $i++) {
            $time += $faker->numberBetween(300, 2000);
            $scrollMax = min(self::SCROLL_ACCURACY, $scrollMax + $faker->numberBetween(0, 200));
            $events[] = ['ti' => $time, 'ty' => RequestProcessor::EVENT_TYPE_SCROLL, 'x' => 0, 'y' => $scrollMax];
        }

        usort($events, function ($a, $b) {
            return $a['ti'] <=> $b['ti'];
        });

        return [
            'events'          => $events,
            'total_time'      => $time + $faker->numberBetween(500, 3000),
            'viewport_width'  => $vw,
            'viewport_height' => $vh,
            'scroll_max'      => $scrollMax,
            'fold'            => $fold,
        ];
    }

    /** Weighted toward interactive elements, with some spread. */
    private function pickClickSelector($faker): string
    {
        // 30% uniform for spread, otherwise weighted toward interactive elements
        if ($faker->boolean(30)) {
            return $this->clickTargets[$faker->numberBetween(0, count($this->clickTargets) - 1)]['selector'];
        }
        $r = $faker->numberBetween(1, $this->totalWeight);
        foreach ($this->clickTargets as $target) {
            $r -= $target['weight'];
            if ($r <= 0) {
                return $target['selector'];
            }
        }
        return $this->clickTargets[count($this->clickTargets) - 1]['selector'];
    }

    /** Near-uniform across all visible elements - movement is not tied to interactive elements. */
    private function pickMoveSelector($faker): string
    {
        if (empty($this->moveTargets)) {
            return $this->pickClickSelector($faker);
        }
        return $this->moveTargets[$faker->numberBetween(0, count($this->moveTargets) - 1)];
    }
}
