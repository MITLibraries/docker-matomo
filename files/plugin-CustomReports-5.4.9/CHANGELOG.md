## Changelog

5.4.9 - 2026-01-05
- Preview screenshot updated for higher quality

5.4.8 - 2025-12-08
- Fixed CHANGELOG.md versioning
- Preview screenshot updated to show higher dimensions

5.4.7 - 2025-11-24
- README.md updated

5.4.6 - 2025-11-10
- Added operating system version dimension

5.4.5 - 2025-10-13
- Added triggering of event when reports are copied

5.4.4 - 2025-09-15
- Added ability to copy a custom report when Matomo 5.4.0-b4 or later is installed
- Fixed bug when creating an evolution report which prevented historical archiving of weekly/monthly/yearly data

5.4.3 - 2025-07-21
- Stopped filtering empty values for regionCode dimension

5.4.2 - 2025-06-09
- Added custom_reports_max_dimensions config setting if not present in config.ini.php 

5.4.1 - 2025-05-15
- Fixed array reference error

5.4.0 - 2025-05-12
- Added the ability to use more than 3 dimensions
- No longer show Insights visualization option when it's not available

5.3.4 - 2025-04-15
- Made preview report timeframes as a config value

5.3.3 - 2025-03-17
-  Improved preview report performance to limit by timeframe

5.3.2 - 2025-03-03
- Added new `getNthLevelTableDimension` method to support new Matomo core changes
- Added query validation check before add, update or preview of report

5.3.1 - 2025-02-17
- Improved paused state message

5.3.0 - 2025-02-03
- Added code to pause/resume a custom report

5.2.3 - 2025-01-20
- Fixes add and update report not working when rearchive_reports_in_past_last_n_months & custom_reports_rearchive_reports_in_past_last_n_months config is set as 0

5.2.2 - 2025-01-15
- Lower campaign values based on a event to honor keep campaign parameter capitalisation setting

5.2.1 - 2025-01-06
- Added code to allow admins to add/edit multiple websites if access to all websites in a report

5.2.0 - 2024-12-09
- Added option to assign multiple idSites to a single report
- Added action type dimension
- Updated region dimension query to group by country and show region name instead of region code 

5.1.1 - 2024-12-02
- Added region and action type dimension

5.1.0 - 2024-11-18
- Added an option to sort subcategory reports

5.0.19 - 2024-11-05
- Updated README.md

5.0.18 - 2024-10-21
- Added config for setting custom reports historical archiving period

5.0.17 - 2024-09-26
- Added some new metrics specifically for this plugin:
  - Average Product Quantity
  - Average Product Price
  - Product Revenue (Total & avg)
  - Total Click Outlinks (Clicked Outlinks)
  - Content Impressions
  - Content Interactions
  - Content Interaction Rate
  - Product Category (Dimension)

5.0.16 - 2024-08-26
- Pricing updated

5.0.15
- Improved validation for dimensions being added to look for allowed dimensions

5.0.14
- Added cover image for marketplace

5.0.13
- Fixed error when changing number of rows in evolution report

5.0.12
- Added a fix to show 2nd dimension when 3rd dimension has no data

5.0.11
- Added missing translations for glossary

5.0.10
- Improved performance for reports that use dimensions accessed by a visit action via right join

5.0.9
- Updated README.md

5.0.8
- Fixed evolution graph refresh issue after metric selection

5.0.7
- Fixed regression in archiving when a new report is created

5.0.6
- Changes to hide the delete button when user doesn't have permission to delete report

5.0.5
- Fix archiving error due to labels not defined
- Added code to allow creating report with same name.

5.0.4
- Fixed error when no metric to sort available in getMetricToSortMultiPeriod()

5.0.3
- Fixed warnings during archive process

5.0.2
- Fixed undefined key notice during previewReport

5.0.1
- Compatibility with Matomo 5.0.0-b4

5.0.0
- Compatibility with Matomo 5

4.1.7
- Fixes regression from previous version where Insights wouldn't load

4.1.6
- Fixes issue where report view preferences do not persist

4.1.5
- Fixes for PHP 8.1

4.1.4
- Fix report links not maintaining the selected date and/or segment

4.1.3
- Fix possible XSS if segment definition contains valid angularjs syntax

4.1.2
- Fixed Unsupported operand error for preview report.

4.1.1
- Fixed Unsupported operand error due to wrong dimension selection for subtable, #PG-1329

4.1.0
- Migrate AngularJS code to Vue.

4.0.15
- Added check to limit live queries for previewReport action if live_query_max_execution_time is set

4.0.14
- Fixed sub data table warning
- Fixed code to show maximum of 3 metrics when type evolution graph for email report

4.0.13
- Changed dimension name to UTC time for Server Time dimensions

4.0.12
- Started supporting 3 dimensions in preview report

4.0.11
- Fixed namespace when previewing a report

4.0.10
- Started re-archiving only when reportType/dimensionIds/metricIds/segmentFilter are changed
- Show empty datatable for no new rows found to avoid fatal error
- Disabled segmented visitor log got download dimension

4.0.9
- Fixed preview report to work even if not metrics provided by other plugins. 

4.0.8
- Updated README.md to highlight benefit of custom reports and mentioned simpler reports

4.0.7
- Add config to aggregate unique metrics instead of raw data for periods specified in config

4.0.6
- Fix archiving of unique metrics in evolution graphs for week, month and year periods 

4.0.5
- Add category help text

4.0.4
- Tweak message when editing a custom report and browser archiving is disabled

4.0.3
- Add back the archive reports command

4.0.2
- Ability to rearchive reports on custom report creation/update

4.0.1
- Compatibility with Matomo 4.X

4.0.0
- Compatibility with Matomo 4.X

3.1.27
- Improve archive command

3.1.26
- List dimension IDs in glossary

3.1.25
- Add new config setting `custom_reports_disabled_dimensions` to disable dimensions

3.1.24
- Ignore new region dimension as it won't work

3.1.23
- Fix view link in manage custom reports may not work when report is configured for all websites
- Fix goalId archiving

3.1.22
- Fix archiver

3.1.21
- Add possibility to set max execution time

3.1.20
- Better segment filter check

3.1.19
- Apply segment filter in segmented visitor log
- Better support for Matomo 3.12

3.1.18
- Sort aggregated reports before generating the report (week, month, year, range)
- Compatibility with Matomo 3.12

3.1.17
- Add more options to archive command

3.1.16
- Support new segmentation in Matomo 3.12

3.1.15
- Compatibility with Matomo 3.12

3.1.14
- Show search box for entities
- Support usage of a reader DB when configured

3.1.13
- Enable more dimensions (visitorId, geolocation)

3.1.12
- Add more translations
- Make sure a report can be moved to its own page after it was assigned to another page

3.1.11
- Add Turkish translation
- Enable Order ID dimension

3.1.10
- Improve report generation for some combination of dimensions

3.1.9
- Fix report preview unter circumstances doesn't show column names when no report is configured yet

3.1.8
- Add config setting to always show unique visitors in all periods

3.1.7
- Improve handling of unique visitors and users

3.1.6
- Use correct category names
- Calculate unique visitors and users from raw data for periods != day if enabled in config in evolution graphs when only these metrics are used

3.1.5
- Support more languages
- Added command to archive reports in past

3.1.4
- Support new languages
- Use new brand colors
- Ensure segment definition is shown correctly

3.1.3
- Fix possible combination with event name and event value may not return a result

3.1.2
- Add dimensions and metrics information to glossary
- Support new "Write" role

3.1.1
- Make sure pie and bar graphs show available columns

3.1.0
- Support [Roll-Up Reporting](https://plugins.matomo.org/RollUpReporting). Create custom reports across multiple sites.

3.0.6
- Prevent possible fatal error when opening manage screen for all websites
- New config setting `custom_reports_validate_report_content_all_websites` which, when enabled under the `[CustomReports]` section, allows the creation of Custom Reports on "All websites", even those that contain "Custom dimensions" or other entities which may not be present on all websites. This is useful when you have many (or all) websites with the exact same dimensions Ids and/or Goals Ids across all websites.


3.0.5
- Renamed Piwik to Matomo

3.0.4
- Prevent possible error when putting a custom report to another custom report page

3.0.3
- Prevent possible problems with custom dimensions in custom reports when also using roll-ups.

3.0.2
- Added German translation
- When generating report data and data needs to be truncated, make sure to sort the data by the first column of the report
- Make number of rows within a datatable configurable 
- Make sure aggregated reports are truncated if needed

3.0.1
- Make sure custom reports category can be always selected when creating a new custom report

3.0.0
- Custom Reports for Piwik 3
