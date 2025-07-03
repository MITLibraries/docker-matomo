## Changelog

__5.0.22__ - 2025-05-28
- Added fallback URI for valid redirect URI check to solve issues with some Matomo for WordPress install

__5.0.21__ - 2025-05-12
- Added auto-scroll for long lists of available websites

__5.0.20__ - 2025-03-20
- Added nonce check for add and remove actions

__5.0.19__ - 2025-03-12
- Improved redirect URI handling logic

__5.0.18__ - 2024-11-05
- Updated README.md

__5.0.17__ - 2024-10-08
- Improved access check for managing accounts

__5.0.16__ - 2024-09-23
- Made adjustments to improve code performance

__5.0.15__ - 2024-08-26
- Pricing updated

__5.0.14__
* Added isReportEnabled check in API methods to prevent creating empty archives with done flag

__5.0.13__
* Added cover image for marketplace

__5.0.12__
* Upgraded phpseclib to 3.0.36

__5.0.11__
*  Prefixed Monolog library

__5.0.10__
*  Updating dependencies to work with PHP 7.2-8.3

__5.0.9__
* Added code to fix redirect error exception when executing via misc cron

__5.0.8__
* Added code to not set Related reports if not enabled

__5.0.7__
* Updated README.md
* Upgraded phpseclib to 3.0.34

__5.0.6__
* Fix IP rate limit issue with Bing integration

__5.0.5__
* Scope vendored libraries to improve compatibility with other plugins
* Fix missing translation

__5.0.4__
* Updated dependency (Guzzle)

__5.0.3__
* Fix regression in unlink Cloud config

__5.0.2__
* Fix compatibility issue

__5.0.1__
* Compatibility with Matomo 5.0.0-b4

__5.0.0__
* Compatibility with Matomo 5

__4.5.5__
* Updated dependency (Guzzle)

__4.5.4__
* Added additional check for redirect URL

__4.5.3__
* Removed unwanted icons from index view

__4.5.2__
* Fixed regression is UI for Admin users

__4.5.1__
* Improvements to handle bad oauth configs
* Improved nonce check after authorization

__4.5.0__
* Updated dependencies to improve PHP 8.2 compatability
* Redesigned UI to simplify connecting to Google Search Console
* Added metric semantic types
* Adjusted log level for error messages during the archiving process
* Updated language translations

__4.4.2__
* Improved API error logging and started showing a notification of API error on the UI

__4.4.1__
* Started getting measurable setting as superuser for rollup sites

__4.4.0__
* Added code to show configuration to superusers only
* Added option to show websites during configuration based on access
* Added created by column in configure website iew
* Added option to delete add/delete website configuration based on access
* Added example URLs to easily configure OAuth for Google and Yandex

__4.3.10__
* Fixed guide link url.

__4.3.9__
* Upgraded guzzleHTTP version to 7.5.0

__4.3.8__
* Started setting idSite after auth process for Google and Yandex to make menu visible

__4.3.7__
* Disabled report metadata for GetCrawlingErrorExamplesBing report

__4.3.6__
* Made securityPolicy adding optional only if it is available

__4.3.5__
* Fixed Google and Yandex avatar not loading due to CSP changes
* Fixed positioning of icons on configuration page
* Upgraded google-apiclient to v2.11 to make it compatible with PHP 8.1  

__4.3.4__
* Started logging additional exception messages when not triggered via archiving process 

__4.3.3__
* Fixed bug where footer message might have been shown more than once in row evolution
* Improved error handling of Yandex import

__4.3.2__
* Various improvements & fixes for Yandex crawl stats import

__4.3.1__
* Improve handling of ThrottleUser error for Bing API
* Translation updates

__4.3.0__
* Adjustments in Google import:
    * Added support for import of news keywords
    * Import of keywords that are not yet final (Google now provides not finalized reports of the last 2 days)
    * Import of keywords that are older than 30 days (Google now provides up to ~500 days)
* Fix possible notice in Yandex reports

__4.2.2__
* Fix bug where adding a new site was impossible
* Translation updates

__4.2.1__
* Improve Google oauth handling.
* Add category help texts.

__4.2.0__
* Implement import of Yandex keywords and crawl stats
* fixed a bug, occurring when updating from < 3.3.0 to 4.1.0+

__4.1.2__
* Improved handling of failing Bing API requests
* Avoid unneeded Google API requests

__4.1.1__
* Various tweaks

__4.1.0__
* Fully removed Google Crawl stats & errors reports (deprecated since 3.3.0)

__4.0.0__
* Compatibility with Matomo 4

__3.6.0__
* Updated dependencies to fix possible compatibility issues with other plugins
* Translation updates

__3.5.1__
* Fix image path for WordPress installation

__3.5.0__
* Update database table definitions to work with `utf8mb4` without `innodb_large_prefix`

__3.4.2__
* Translation updates
* Tiny code improvements
* Lower positions will now be shown as better (requires Matomo 3.13)

__3.4.1__
* Compatibility with upcoming Matomo 3.12.0
* Removed obsolete Code for importing Google Crawl Stats & Errors
* Translation updates

__3.4.0__
* Use imported keywords for (subtable) reports of more reports:
    * *Acquisition > All channels > Channel type*
    * *Acquisition > All channels > Referrers*
    * *Acquisition > Search Engines*
* Show related reports for reports showing imported keywords to show originally tracked keywords instead
* Translations for German and Albanian

__3.3.2__
* Fix sorting for keyword tables
* Improved compatibility with Roll-Up Reporting plugin
* Translation updates

__3.3.1__
* Ensure at least one keyword type is configured for Google imports
* Deprecated Property Set and Android App imports
* Improve sorting of keyword reports by adding a secondary sort column
* Added proper handling for new Domain properties on Google Search Console

__3.3.0__
* Fixed bug with incorrect numbers for reports including day stats for Bing
* Improved validation of uploaded Google client configs
* Updated dependencies
* Deprecated Google Crawl Errors reports (due to Google API deprecation).
  Old reports will still be available, but no new data can be imported after end of March '19.
  New installs won't show those reports at all.
* Translation updates

__3.2.7__
* Fixed notice occurring if search import is force enabled

__3.2.6__
* Allow force enabling crawling error reports.
* Improve handling of Google import (avoid importing property set data since it does not exist)

__3.2.5__
* Security improvements
* Theme updates

__3.2.4__
* Improve handling of Bing Crawl Errors (fixes a notice while import)
* Improve Google import handling of empty results
* Security improvements
* UI improvements
* Translations for Polish

__3.2.3__
* Various code improvements
* Translations for Chinese (Taiwan) and Italian

__3.2.0__
* Changes the _Combined Keywords_ report to also include keywords reported by Referrers.getKeywords
* Adds new reports _Combined imported keywords_ (which is what the combined keywords was before)
* Replaces Referrers.getKeywords reports in order to change name and show it as related report
* Move all reports to the Search Engines & Keywords category (showing Search Engines last)

__3.1.0__
* New crawl errors reports und Pages > crawl errors showing pages having crawl issues on Google and Bing/Yahoo!

__3.0.10__
* Improved error handling
* Row evolution for combined keywords reports
* Fixed error when generating scheduled reports with evolution charts

__3.0.9__
* Renamed Piwik to Matomo

__3.0.8__
* Possibility to show keyword position as float instead of integer

__3.0.7__
* Added commands to trigger import using console command
* Various UI/UX improvements

__3.0.6__
* Now uses Piwik proxy config if defined

__3.0__
* Possibility to import keyords & crawl stats from Google Search Console
* Setting per website if web, image and/or video keywords should be imported
* Possibility to import keywords & crawl stats from Bing/Yahoo! Webmaster API
