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

namespace Piwik\Plugins\HeatmapSessionRecording;

use Matomo\Network\IP;
use Piwik\Http;

/**
 * Server-side image proxy helper used to re-serve cross-origin images from the Matomo origin.
 */
class ImageProxy
{
    public const MAX_BYTES = 20 * 1024 * 1024;
    public const TIMEOUT = 10;
    public const MAX_URL_LENGTH = 2048;
    public const ALLOWED_SCHEMES = ['http', 'https'];
    public const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];

    public function validateUrl(string $raw): string
    {
        if (strlen($raw) > self::MAX_URL_LENGTH) {
            throw new \Exception('URL is too long.');
        }

        $parts = parse_url($raw);
        if ($parts === false || empty($parts['host']) || empty($parts['scheme'])) {
            throw new \Exception('URL is missing a host or scheme.');
        }

        $scheme = strtolower($parts['scheme']);
        if (!in_array($scheme, self::ALLOWED_SCHEMES, true)) {
            throw new \Exception('URL scheme is not allowed.');
        }

        if (isset($parts['user']) || isset($parts['pass'])) {
            throw new \Exception('URL must not contain credentials.');
        }

        if (isset($parts['port'])) {
            $defaultPort = $scheme === 'https' ? 443 : 80;
            if ((int) $parts['port'] !== $defaultPort) {
                throw new \Exception('URL must not use a non-default port.');
            }
        }

        $host = $parts['host'];

        if (strlen($host) >= 2 && $host[0] === '[' && substr($host, -1) === ']') {
            throw new \Exception('IP-literal hosts are not allowed.');
        }

        if (filter_var($host, FILTER_VALIDATE_IP) !== false) {
            throw new \Exception('IP-literal hosts are not allowed.');
        }

        if (function_exists('idn_to_ascii')) {
            $asciiHost = idn_to_ascii($host, IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46);
            if ($asciiHost === false) {
                throw new \Exception('URL host is malformed.');
            }
            $host = $asciiHost;
        }

        $cleanUrl = $scheme . '://' . $host;
        if (isset($parts['port'])) {
            $cleanUrl .= ':' . (int) $parts['port'];
        }
        $cleanUrl .= $parts['path'] ?? '';
        if (isset($parts['query'])) {
            $cleanUrl .= '?' . $parts['query'];
        }

        return $cleanUrl;
    }

    public function assertHostNotInternal(string $host): void
    {
        $ips = [];

        $aRecords = gethostbynamel($host);
        if (is_array($aRecords)) {
            $ips = array_merge($ips, $aRecords);
        }

        $aaaaRecords = @dns_get_record($host, DNS_AAAA);
        if (is_array($aaaaRecords)) {
            foreach ($aaaaRecords as $record) {
                if (!empty($record['ipv6'])) {
                    $ips[] = $record['ipv6'];
                }
            }
        }

        if (empty($ips)) {
            throw new \Exception('Could not resolve host.');
        }

        foreach ($ips as $ip) {
            if ($this->isInternalIp($ip)) {
                throw new \Exception('Host resolves to an internal IP.');
            }
        }
    }

    private function isInternalIp(string $ip): bool
    {
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return true;
        }

        return IP::fromStringIP($ip)->isInRanges(['169.254.0.0/16', '100.64.0.0/10']);
    }

    public function fetchToFile(string $url): array
    {
        $tmpPath = tempnam(sys_get_temp_dir(), 'hsrimg');
        if ($tmpPath === false) {
            throw new \Exception('Could not create a temporary file.');
        }

        try {
            Http::sendHttpRequest($url, self::TIMEOUT, null, $tmpPath, 0, false, [0, self::MAX_BYTES], false);

            if (filesize($tmpPath) === 0) {
                throw new \Exception('Empty response body.');
            }

            $mime = $this->validateDownloadedFile($tmpPath);
        } catch (\Exception $e) {
            @unlink($tmpPath);
            throw $e;
        }

        return ['path' => $tmpPath, 'mime' => $mime];
    }

    private function validateDownloadedFile(string $path): string
    {
        if (filesize($path) > self::MAX_BYTES) {
            throw new \Exception('Downloaded file exceeds the maximum allowed size.');
        }

        $info = @getimagesize($path);
        if ($info !== false && !empty($info['mime']) && in_array($info['mime'], self::ALLOWED_MIME, true)) {
            return $info['mime'];
        }

        if (in_array('image/svg+xml', self::ALLOWED_MIME, true) && $this->isSvg($path)) {
            return 'image/svg+xml';
        }

        throw new \Exception('Downloaded file is not an allowed image type.');
    }

    private function isSvg(string $path): bool
    {
        $reader = new \XMLReader();

        if (@$reader->open($path, null, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING) !== true) {
            return false;
        }

        $isSvg = false;

        try {
            while (@$reader->read()) {
                if ($reader->nodeType === \XMLReader::ELEMENT) {
                    $isSvg = strtolower($reader->localName) === 'svg';
                    break;
                }
            }
        } catch (\Throwable $e) {
            $isSvg = false;
        } finally {
            $reader->close();
        }

        return $isSvg;
    }
}
