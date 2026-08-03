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

namespace Piwik\Plugins\HeatmapSessionRecording\Model;

use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\Date;
use Piwik\Plugins\HeatmapSessionRecording\Input\Name;
use Piwik\Translation\Translator;

class RepeatName
{
    public static function generate($baseName, Date $date, $language = null)
    {
        $translator = StaticContainer::get(Translator::class);

        if ($language === null) {
            $language = $translator->getDefaultLanguage();
        }

        $shortMonths = self::getLocalizedShortMonths($translator, $language);
        $monthOfYear = (int) $date->toString('n');

        return self::buildName($baseName, $shortMonths[$monthOfYear], $date->toString('Y'), self::getStrippableShortMonths($translator, $shortMonths));
    }

    public static function buildName($baseName, $shortMonth, $year, array $allShortMonths)
    {
        $baseName = self::stripExistingSuffix((string) $baseName, $allShortMonths);
        $suffix = $shortMonth . '-' . $year;

        return self::appendWithinLimit($baseName, $suffix);
    }

    private static function getLocalizedShortMonths(Translator $translator, $language)
    {
        $months = array();

        for ($month = 1; $month <= 12; $month++) {
            $name = $translator->translate('Intl_Month_Short_' . $month, array(), $language);
            $months[$month] = Common::mb_strtolower($name) === $name
                ? Common::mb_substr(Common::mb_strtoupper($name), 0, 1) . Common::mb_substr($name, 1)
                : $name;
        }

        return $months;
    }

    /**
     * A suffix generated earlier must stay recognisable after the owner changes their language, or suffixes stack.
     * Earlier suffixes were written either in the owner's language, the configured default one, or English.
     */
    private static function getStrippableShortMonths(Translator $translator, array $shortMonths)
    {
        $months = array_values($shortMonths);

        foreach (array($translator->getDefaultLanguage(), 'en') as $language) {
            $months = array_merge($months, array_values(self::getLocalizedShortMonths($translator, $language)));
        }

        return array_unique($months);
    }

    private static function stripExistingSuffix($baseName, array $allShortMonths)
    {
        $quoted = array();
        foreach ($allShortMonths as $shortMonth) {
            $quoted[] = preg_quote($shortMonth, '/');
        }

        $pattern = '/\s(?:' . implode('|', $quoted) . ')-\d{4}$/u';

        return preg_replace($pattern, '', $baseName);
    }

    private static function appendWithinLimit($baseName, $suffix)
    {
        $full = $baseName . ' ' . $suffix;

        if (Common::mb_strlen($full) <= Name::MAX_LENGTH) {
            return $full;
        }

        $maxBaseLength = Name::MAX_LENGTH - Common::mb_strlen($suffix) - 1;
        if ($maxBaseLength < 0) {
            $maxBaseLength = 0;
        }

        $truncatedBase = rtrim(Common::mb_substr($baseName, 0, $maxBaseLength));

        if ($truncatedBase === '') {
            return $suffix;
        }

        return $truncatedBase . ' ' . $suffix;
    }
}
