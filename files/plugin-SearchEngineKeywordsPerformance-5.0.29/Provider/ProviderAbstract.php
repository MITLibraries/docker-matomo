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
 * @link    https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

namespace Piwik\Plugins\SearchEngineKeywordsPerformance\Provider;

use Piwik\Metrics\Formatter;
use Piwik\Option;
use Piwik\Plugins\SearchEngineKeywordsPerformance\Provider\Helper\MeasurableHelper;
use Piwik\Singleton;

abstract class ProviderAbstract extends Singleton
{
    /**
     * internal provider id
     */
    public const ID = '';
    public const OPTION_PREFIX_LAST_ERROR_TIME = 'searchEngineKeywordsLastApiErrorTime_';

    /**
     * Returns internal provider id
     *
     * @return string
     */
    public function getId()
    {
        return static::ID;
    }
    /**
     * Declares a Provider as experimental
     *
     * @return bool
     */
    public function isExperimental()
    {
        return \false;
    }
    /**
     * Returns the display name of the provider
     *
     * @return string
     */
    abstract public function getName();
    /**
     * Returns an array with up to two logos to be displayed for the provider
     *
     * @return array
     */
    abstract public function getLogoUrls();
    /**
     * Returns the description to be shown for the provider
     *
     * @return string
     */
    abstract public function getDescription();
    /**
     * Returns additional notes to be displayed
     *
     * @return string
     */
    abstract public function getNote();
    /**
     * Returns wether the provider is fully configured and can be used
     *
     * @return bool
     */
    abstract public function isConfigured();
    /**
     * Returns the provider client
     *
     * @return mixed
     */
    abstract public function getClient();
    /**
     * Returns Site IDs that are configured for import
     *
     * @return array
     */
    abstract public function getConfiguredSiteIds();
    /**
     * Returns an array with problems in current account and website configuration
     *
     * @return array [ sites => [], accounts => [] ]
     */
    abstract public function getConfigurationProblems();
    /**
     * Record a new timestamp for the current provider indicating an API error occurred.
     *
     * @return void
     */
    public function recordNewApiErrorForProvider(): void
    {
        Option::set(self::OPTION_PREFIX_LAST_ERROR_TIME . $this->getId(), time());
    }
    /**
     * Get the timestamp of the most recent API error for the current provider. If none is found, 0 is returned.
     *
     * @return int Unix timestamp or 0;
     */
    public function getLastApiErrorTimestamp(): int
    {
        $option = Option::get(self::OPTION_PREFIX_LAST_ERROR_TIME . $this->getId());
        if (empty($option)) {
            return 0;
        }
        return (int) $option;
    }
    /**
     * Checks if there has been an API error for the current provider within the past week.
     *
     * @return bool Indicates whether the most recent API error was less than a week ago.
     */
    public function hasApiErrorWithinWeek(): bool
    {
        $timestamp = $this->getLastApiErrorTimestamp();
        if ($timestamp === 0) {
            return \false;
        }
        return $timestamp > strtotime('-1 week');
    }
    /**
     * If there's been an API error within the past week a message string is provided. Otherwise, the string is empty.
     *
     * @return string Either the message or empty string depending on whether there's been a recent error.
     */
    public function getRecentApiErrorMessage(): string
    {
        $message = '';
        if ($this->hasApiErrorWithinWeek()) {
            $message = '<strong>' . $this->getName() . '</strong> - Most recent error: ' . (new Formatter())->getPrettyTimeFromSeconds(time() - $this->getLastApiErrorTimestamp()) . ' ago';
        }
        return $message;
    }

    protected function getMeasurableHelper(): MeasurableHelper
    {
        return MeasurableHelper::getInstance();
    }
}
