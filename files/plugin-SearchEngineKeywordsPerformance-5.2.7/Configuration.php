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

use Piwik\Config;

class Configuration
{
    public const SECTION_NAME = 'SearchEngineKeywordsPerformance';
    public const KEY_ENCRYPTION_KEY = 'encryption_key';

    public function install(): void
    {
        $this->getOrCreateEncryptionKey();
    }

    public function getEncryptionKey(): string
    {
        $config = $this->getConfig();

        return (string) ($config->{self::SECTION_NAME}[self::KEY_ENCRYPTION_KEY] ?? '');
    }

    public function getOrCreateEncryptionKey(): string
    {
        $key = $this->getEncryptionKey();

        if ($key !== '') {
            return $key;
        }

        $key = base64_encode(random_bytes(32));
        $this->setEncryptionKey($key);

        return $key;
    }

    public function setEncryptionKey(
        #[\SensitiveParameter]
        string $key
    ): void {
        $config = $this->getConfig();
        $pluginConfig = $config->{self::SECTION_NAME} ?: [];
        $pluginConfig[self::KEY_ENCRYPTION_KEY] = $key;
        $config->{self::SECTION_NAME} = $pluginConfig;
        $config->forceSave();
    }

    private function getConfig(): Config
    {
        return Config::getInstance();
    }
}
