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

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\Settings;

use Piwik\Log;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Encryption;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Exceptions\SecretConfigurationException;
use Piwik\Settings\Measurable\MeasurableSetting;

class EncryptedBingSiteSetting extends MeasurableSetting
{
    /**
     * @var Encryption
     */
    private $encryption;

    public function __construct($name, $defaultValue, $type, $pluginName, $idSite, ?Encryption $encryption = null)
    {
        parent::__construct($name, $defaultValue, $type, $pluginName, $idSite);
        $this->encryption = $encryption ?: new Encryption();
    }

    public function getValue()
    {
        $value = parent::getValue();

        if (!is_string($value) || $value === '' || $value === '0') {
            return $value;
        }

        try {
            return $this->encryption->decryptString($value);
        } catch (SecretConfigurationException $e) {
            Log::error('[SearchEngineKeywordsPerformance] ' . $e->getMessage());
            return $this->getDefaultValue();
        }
    }

    public function setValue($value)
    {
        // Avoid overwriting a still-encrypted value that cannot currently be decrypted (e.g. the
        // encryption key is missing or invalid). In that case getValue() falls back to the default,
        // so saving the settings form would submit '0' and permanently destroy recoverable
        // credentials. Skip the write so the original value can be read again once the key is restored.
        if (($value === '' || $value === '0' || !is_string($value)) && $this->hasUndecryptableValue()) {
            return;
        }

        parent::setValue($value);

        if (!is_string($value) || $value === '' || $value === '0' || $this->encryption->isEncrypted($value)) {
            return;
        }

        $this->storage->setValue($this->name, $this->encryption->encryptString($value));
    }

    private function hasUndecryptableValue(): bool
    {
        $stored = parent::getValue();

        if (!is_string($stored) || !$this->encryption->isEncrypted($stored)) {
            return false;
        }

        try {
            $this->encryption->decryptString($stored);
            return false;
        } catch (SecretConfigurationException $e) {
            return true;
        }
    }
}
