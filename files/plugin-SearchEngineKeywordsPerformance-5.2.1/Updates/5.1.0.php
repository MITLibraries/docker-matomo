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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance;

use Piwik\Common;
use Piwik\Db;
use Piwik\Option;
use Piwik\Updater;
use Piwik\Updates as PiwikUpdates;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Client\Configuration\Bing as BingConfiguration;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Client\Configuration\Google as GoogleConfiguration;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Client\Configuration\Yandex as YandexConfiguration;

class Updates_5_1_0 extends PiwikUpdates
{
    public function doUpdate(Updater $updater)
    {
        $configuration = new Configuration();
        $configuration->install();

        $encryption = new Encryption($configuration);

        $this->encryptOptionIfNeeded(GoogleConfiguration::OAUTH_CONFIG_OPTION_NAME, $encryption);
        $this->encryptOptionIfNeeded(GoogleConfiguration::CLIENT_CONFIG_OPTION_NAME, $encryption);
        $this->encryptOptionIfNeeded(BingConfiguration::CLIENT_CONFIG_OPTION_NAME, $encryption);
        $this->encryptOptionIfNeeded(YandexConfiguration::OAUTH_CONFIG_OPTION_NAME, $encryption);
        $this->encryptOptionIfNeeded(YandexConfiguration::CLIENT_CONFIG_OPTION_NAME, $encryption);
        $this->encryptBingSiteSettingsIfNeeded($encryption);
    }

    private function encryptOptionIfNeeded(string $optionName, Encryption $encryption): void
    {
        $value = Option::get($optionName);

        if (!is_string($value) || $value === '' || $encryption->isEncrypted($value)) {
            return;
        }

        Option::set($optionName, $encryption->encryptString($value));
    }

    private function encryptBingSiteSettingsIfNeeded(Encryption $encryption): void
    {
        $table = Common::prefixTable('site_setting');
        $rows = Db::fetchAll(
            'SELECT `idsite`, `setting_value` FROM ' . $table . ' WHERE `plugin_name` = ? AND `setting_name` = ?',
            ['SearchEngineKeywordsPerformance', 'bingsiteurl']
        );

        foreach ($rows as $row) {
            $value = $row['setting_value'] ?? '';

            if (!is_string($value) || $value === '' || $value === '0' || $encryption->isEncrypted($value)) {
                continue;
            }

            Db::query(
                'UPDATE ' . $table . ' SET `setting_value` = ? WHERE `idsite` = ? AND `plugin_name` = ? AND `setting_name` = ?',
                [$encryption->encryptString($value), $row['idsite'], 'SearchEngineKeywordsPerformance', 'bingsiteurl']
            );
        }
    }
}
