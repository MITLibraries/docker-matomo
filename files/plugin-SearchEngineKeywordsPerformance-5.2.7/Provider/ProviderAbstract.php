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

use Piwik\Container\StaticContainer;
use Piwik\Log\LoggerInterface;
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
     * @var bool whether a decryption failure was already logged during this request
     */
    private $unreadableCredentialsLogged = false;

    /**
     * Verifiability of each configured value classified during this request, keyed by the value.
     * Absent means "not classified yet", which is treated as verifiable.
     *
     * @var array<string, bool>
     */
    private $urlVerifiability = [];

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
     * Returns the primary logo url as a string.
     *
     * This default keeps existing subclasses compatible by deriving the
     * primary logo from the first configured logo, when present.
     *
     * @return string
     */
    public function getLogoUrl()
    {
        $logos = $this->getLogoUrls();

        return $logos[0] ?? '';
    }
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
     * Explains why a measurable's stored site mapping cannot be used, or null when it can.
     *
     * Both the measurable's own settings and the configuration problem list go through this, so a
     * given cause is named the same way wherever the user meets it. Implementations must separate
     * a mapping that is genuinely gone from one they could not check: the remedy for the first,
     * removing the mapping, throws away a working configuration in the second.
     *
     * @param mixed $configuredValue the stored "<account>##<site>" value; anything else posted
     * @return string|null
     */
    abstract public function getConfiguredUrlError($configuredValue);
    /**
     * Whether the last check of this mapping actually reached the provider's API.
     *
     * A mapping that could not be checked is not a mapping that is gone, so callers that carry a
     * severity — the configure page's status column, the system check — must not treat the two the
     * same. Classifies the value itself if that has not happened yet this request, so no caller has
     * to sequence the two calls; the clients memoise their one HTTP call, so asking again is free.
     *
     * @param mixed $configuredValue the stored "<account>##<site>" value
     */
    public function isConfiguredUrlVerifiable($configuredValue): bool
    {
        if (!is_string($configuredValue)) {
            return \true;
        }

        if (!array_key_exists($configuredValue, $this->urlVerifiability)) {
            // classify on demand rather than obliging callers to have asked for the message first;
            // the clients memoise their one API call, so this is free when they already have
            $this->getConfiguredUrlError($configuredValue);
            // classification only records failures, so whatever else it decided is verifiable;
            // caching that here stops every caller re-running it
            $this->urlVerifiability += [$configuredValue => \true];
        }

        return $this->urlVerifiability[$configuredValue];
    }
    /**
     * How to label a stored "<account>##<site>" value in the UI when the provider's own site list
     * is unavailable. The site part is already the url for Google and Bing; Yandex stores a host id.
     *
     * @param mixed $configuredValue
     * @return string
     */
    public function describeConfiguredSite($configuredValue): string
    {
        if (!is_string($configuredValue) || strpos($configuredValue, '##') === false) {
            return (string) $configuredValue;
        }

        [, $site] = explode('##', $configuredValue, 2);

        return $site;
    }
    /**
     * Records that this value's classification could not reach the API.
     *
     * Keyed by the value rather than by its account on purpose: a provider can classify a mapping
     * without enumerating at all — Google returns early for deprecated property types — and reading
     * an account-keyed flag afterwards would let one site's outage downgrade another site's
     * definite error to a warning.
     *
     * @param mixed $configuredValue
     */
    protected function recordConfiguredUrlNotVerifiable($configuredValue): void
    {
        if (is_string($configuredValue)) {
            $this->urlVerifiability[$configuredValue] = \false;
        }
    }
    /**
     * Returns an array with problems in current account and website configuration
     *
     * The account errors are keyed by an account identifier that is safe to show. Implementations
     * whose account map is keyed by a credential have to obfuscate that key first, because the result
     * is rendered on the settings page and is not limited to the owner of the account.
     *
     * @return array [ sites => [], accounts => [] ]
     */
    abstract public function getConfigurationProblems();
    /**
     * Writes a decryption failure to the log. The settings pages only surface it as a transient
     * notification, so without this a lost encryption key leaves no trace an admin can go back to.
     *
     * @param array $problems the return value of getConfigurationProblems()
     */
    protected function logUnreadableCredentials(array $problems): void
    {
        $message = $problems['accounts']['credentials'] ?? $problems['sites']['credentials'] ?? '';

        if (!empty($message) && !$this->unreadableCredentialsLogged) {
            $this->unreadableCredentialsLogged = true;
            // ignoreInScreenWriter keeps the default screen log writer from rendering the message as
            // a banner on top of the warning the page already shows
            StaticContainer::get(LoggerInterface::class)->error('[SearchEngineKeywordsPerformance] {message}', [
                'message'              => $message,
                'ignoreInScreenWriter' => true,
            ]);
        }
    }
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
