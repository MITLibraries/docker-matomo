## Changelog

5.2.6 - 2025-08-04
- Added ability to copy configured heatmaps when Matomo 5.4.0-b4 or later is installed

5.2.5 - 2025-07-07
- Textual changes

5.2.4 - 2025-06-09
- Started showing the troubleshooting link even when no heatmap sample has been recorded
- Do not crash when displaying a heatmap for a page with invalid HTML

5.2.3 - 2025-01-20
- Added an activity for pause and resume action
- Added a troubleshooting FAQ link for heatmaps 

5.2.2 - 2024-12-16
- Fixes PHP deprecation warnings

5.2.1 - 2024-12-02
- Added activities to track deleting recorded sessions and page views

5.2.0 - 2024-11-04
- Implemented a tooltip which displays click count and rate

5.1.8 - 2024-10-17
- Fixes excluded_elements not working for escaped values for a heatmap

5.1.7 - 2024-10-11
- Fixes classes with word script being removed due to xss filtering

5.1.6 - 2024-08-26
- Pricing updated

5.1.5
- Added cover image for marketplace

5.1.4
- Fixes captureInitialDom not working for single heatmap

5.1.3
- Added code to disable matomo.js file writable check code for Matomo Cloud

5.1.2
- Added code to alert if matomo.js is not writable

5.1.1 
- Fixed applying segment returns error for SessionRecording

5.1.0
- Added an option to capture Heatmap DOM on demand

5.0.10
- Added total actions column in Session Recording listing page

5.0.9
- Added code to keep playing on resize event
- Added code to update Translation keys via event

5.0.8
- Changes for README.md
- Fixed an error that occurs when viewing posts that have heatmaps associated in WordPress.

5.0.7
- Fixed issue where form fields that were supposed to be unmasked weren't
- Added code to pause/resume heatmap for Matomo Cloud

5.0.6
- Fixed input[type="button"] background being ignored
- Added code to display AdBlocker banner when detected

5.0.5
- Fixed regression where good configs were disabled

5.0.4
- Fixed location provider not loading for cloud customers

5.0.3
- Fixed error when location provider is null

5.0.2
- Added option to fire heatmap/session recording only for certain geographies

5.0.1
- Compatibility with Matomo 5.0.0-b4

5.0.0
- Compatibility with Matomo 5

4.5.10
- Started skipping deletion of heatmap and session recordings for proxysite

4.5.9
- Started hiding period selector when viewing heatmaps

4.5.8
- Fixed scroll data not displaying correctly due to sort missing

4.5.7
- Fixed deprecation warnings for PHP 8.1

4.5.6
- Changed time_on_page column to BIGINT for new installation for log_hsr and log_hsr_event table 

4.5.5
- Fixed session recording not masking image with `data-matomo-mask` attribute set on parent node

4.5.4
- Fixed unmasking issue for text-node elements
- Fixed recording to not end on tabs switch 

4.5.3
- Added support to pass media attribute if present for external stylesheets

4.5.2
- Made regex to work consistently, #PG-373
- Added examples of possible xss from portswigger.net

4.5.1
- Fixed mutation id bug to load css from DB

4.5.0
- Starting migrating AngularJS to Vue.
- Migrated view code to VueJs
- Updated code to respect max execution time during Archiving

4.4.3
- Added code to remove attributes with possible XSS values

4.4.2
- Added support for lazy loaded images

4.4.1
- Fixed masking issue for dynamically added DOM elements

4.4.0
- Added option to disable heatmap independently
- Stopped showing visitor profile icon in session recording when visitor profile is disabled 

4.3.1
- Fixed recorded session link not working for segmented logs in visit action

4.3.0
- Started storing CSS content in DB
- Fixed range error when range is disabled

4.2.1
- Fixed double encoded segments

4.2.0
- Fixed heatmap not triggering when tracker configured directly.
- Added masking for images with height and width
- Added masking for [input type="image"]
- Fixed non-masking bug for child elements with data-matomo-unmask

4.1.2
- Fix to record inputs with data-matomo-unmask 

4.1.1
- Removed masking for input type button, submit and reset 

4.1.0
- Added option to disable session recording independently

4.0.14
- Support Matomo's new content security policy header

4.0.13
- Fix sharing a session might not work anymore with latest Matomo version

4.0.12
- Ensure configs.php is loaded correctly with multiple trackers
- Translation updates

4.0.11
- Improve handling of attribute changes
- Add translations for Czech, Dutch & Portuguese

4.0.10
- Further improvements for loading for iframes

4.0.9
- Improve loading for iframes

4.0.8
- Improve tracking react pages 

4.0.7
- Add category help texts
- Increase possible sample limit
- jQuery 3 compatibility for WP

4.0.6
- Performance improvements

4.0.4
- Compatibility with Matomo 4.X

4.0.3
- Compatibility with Matomo 4.X

4.0.2
- Compatibility with Matomo 4.X

4.0.1
- Handle base URLs better

4.0.0
- Compatibility with Matomo 4.X

3.2.39
- Better handling for base URL

3.2.38
- Improve SPA tracking

3.2.37
- Improve sorting of server time

3.2.36
- Fix number of recorded pages may be wrong when a segment is applied

3.2.35 
- Improve widgetize feature when embedded as iframe

3.2.34
- Further improvements for WordPress

3.2.33
- Improve compatibilty with WordPress

3.2.32
- Improve checking for number of previously recorded sessions

3.2.31
- Matomo for WordPress support

3.2.30
- Send less tracking requests by queueing more requests together

3.2.29
- Use DB reader in Aggregator for better compatibility with Matomo 3.12

3.2.28
- Improvements for Matomo 3.12 to support faster segment archiving
- Better support for single page applications

3.2.27
 - Show search box for entities
 - Support usage of a reader DB when configured

3.2.26
 - Tracker improvements

3.2.25
 - Tracker improvements

3.2.24
 - Generate correct session recording link when a visitor matches multiple recordings in the visitor log

3.2.23
 - Internal tracker performance improvements

3.2.22
 - Add more translations
 - Tracker improvements
 - Internal changes

3.2.21
 - title-text of JavaScript Tracking option help box shows HTML
 - Add primary key to log_event table for new installs (existing users should receive the update with Matomo 4)

3.2.20
 - Fix tracker may under circumstances not enable tracking after disabling it manually

3.2.19
 - Add possibility to delete an already taken heatmap screenshot so it can be re-taken

3.2.18
 - Performance improvements for high traffic websites

3.2.17
 - Add possibility to define alternative CSS file through `data-matomo-href`
 - Added new API method `HeatmapSessionRecording.deleteHeatmapScreenshot` to delete an already taken heatmap screenshot
 - Add possibility to delete an already taken heatmap screenshot so it can be re-taken

3.2.16
 - Add useDateUrl=0 to default Heatmap export URL so it can be used easier

3.2.15
 - Support a URL parameter &useDateUrl=1 in exported heatmaps to fetch heatmaps only for a specific date range

3.2.14
 - Improve compatibility with tag manager
 - Fix possible notice when matching url array parameters 
 - Add command to remove a stored heatmap

3.2.13
 - Fix some coordinate cannot be calculated for SVG elements
 - Added more languages
 - Use new brand colors
 - If time on page is too high, abort the tracking request

3.2.12
 - Update tracker file
 
3.2.11
 - Add possibility to mask images

3.2.10
 - Make sure to replay scrolling in element correctly

3.2.9
 - Change min height of heatmaps to 400 pixels.

3.2.8
 - When widgetizing the session player it bursts out of the iframe
 - Log more debug information in tracker
 - Use API calls instead of model

3.2.7
 - Support new "Write" role

3.2.6
 - Improve compatibility with styled-components and similar projects
 - Add possibility to not record mouse and touch movements.

3.2.5
 - Compatibility with SiteUrlTrackingID plugin
 - Ensure selectors are generated correctly

3.2.4
 - Allow users to pass sample limit of zero for unlimited recordings
 - Show which page view within a session is currently being replayed

3.2.3
 - In configs.php return a 403 if Matomo is not installed yet

3.2.2
 - Validate an entered regular expression when configuring a heatmap or session recording
 - Improve heatmap rendering of sharepoint sites

3.2.1
 - Improve the rendering of heatmaps and session recordings

3.2.0
 - Optimize tracker cache file
 - Prevent recording injected CSS resources that only work on a visitors' computer such as Kaspersky Antivirus CSS.
 - For better GDPR compliance disable capture keystroke in sessions by default.
 - Added logic to support Matomo GDPR features
 - Only specifically whitelisted form fields can now be recorded in plain text
 - Some form fields that could potentially include personal information such as an address will be always masked and anonymized
 - Trim any whitespace when configuring target pages

3.1.9
 - Support new attribute `data-matomo-mask` which works similar to `data-piwik-mask` but additionally allows to mask content of elements.

3.1.8
 - Support new CSS rendering classes matomoHsr, matomoHeatmap and matomoSessionRecording
 - For input text fields prefer a set value on the element directly
 - Differentiate between scrolling of the window and scrolling within an element (part of the window)
 - Replay in the recorded session when a user is scrolling within an element

3.1.7
 - Make sure validating URL works correctly with HTML entities
 - Prevent possible fatal error when opening manage screen for all websites

3.1.6
 - Renamed Piwik to Matomo

3.1.5
 - Fix requested stylesheet URLs were requested lowercase when using a relative base href in the recorded page
 - Show more accurate time on page and record pageviews for a longer period in case a user is not active right away.

3.1.4
 - Prevent target rules in heatmap or session recording to visually disappear under circumstances when not using the cancel or back button.
 - Respect URL prefix (eg www.) when replaying a session recording, may fix some displaying issues if website does not work without www.
 - Improved look of widgetized session recording 

3.1.3
 - Make Heatmap & Session Recording compatible with canvas and webgl libraries like threejs and earcut
 - Better detected of the embedded heatmap height 
 - Fix scroll heatmap did not paint the last scroll section correctly
 - It is now possible to configure the sample limits in the config via `[HeatmapSessionRecording] session_recording_sample_limits = 50,100,...`

3.1.2
 - Added URL to view heatmap and to replay a session recording to the API response
 - Fix widgetized URL for heatmaps and sessions redirected to another page when authenticated via token_auth
 
3.1.1
 - Better error code when a site does not exist
 - Fix configs.php may fail if plugins directory is a symlink
 - Available sessions are now also displayed in the visitor profile

3.1.0
 - Added autoplay feature for page views within a visit
 - Added possibility to change replay speed
 - Added possibility to skip long pauses in a session recording automatically
 - Better base URL detection in case a relative base URL is used

3.0.15
 - Fix only max 100 heatmaps or session recordings were shown when managing them for a specific site.
 - Mask closing body in embedded page so it won't be replaced by some server logic

3.0.14
 - Make sure to find all matches for a root folder when "equals simple" is used
 
3.0.13
 - Fix a custom set based URL was ignored.
 
3.0.12
 - Fix session recording stops when a user changes a file form field because form value is not allowed to be changed.
 
3.0.11
 - Improve the performance of a DB query of a daily task when cleaning up blob entries.
 
3.0.10
 - Improve the performance of a DB query of a daily task
 - Respect the new config setting `enable_internet_features` in the system check

3.0.9
 - Make sure page rules work fine when using HTML entities

3.0.8
 - Fix possible notice when tracking
 - Avoid some logs in chrome when viewing a heatmaps or session recordings
 - Always prefer same protocol when replaying sessions as currently used

3.0.7
 - When using an "equals exactly" comparison, ignore a trailing slash when there is no path set
 - Let users customize if the tracking code should be included only when active records are configured

3.0.6
 - Fix link to replay session in visitor log may not work under circumstances

3.0.5
 - More detailed "no data message" when nothing has been recorded yet
 - Fix select fields were not recorded

3.0.4
 - Only add tracker code when heatmap or sessions are actually active in any site
 - Added index on site_hsr table
 - Add custom stylesheets for custom styling

3.0.3
 - Add system check for configs.php
 - On install, if .htaccess was not created, create the file manually

3.0.2
 - Enrich system summary widget
 - Show an arrow instead of a dash between entry and exit url
 - Added some German translations
 
3.0.1
 - Updated translations

3.0.0
 - Heatmap & Session Recording for Piwik 3
