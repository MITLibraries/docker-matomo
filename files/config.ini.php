; <?php exit; ?> DO NOT REMOVE THIS LINE
; file automatically generated or modified by Matomo; you can manually override the default values in global.ini.php by redefining them in this file.
[database]
schema = Mariadb
charset = utf8mb4
collation = utf8mb4_general_ci

[General]
proxy_client_headers[] = "HTTP_X_FORWARDED_FOR"

; maximum number of rows for any of the Referers tables (keywords, search engines, campaigns, etc.), and Custom variables names
datatable_archiving_maximum_rows_referrers = 5000

; maximum number of rows for any of the Referers subtable (search engines by keyword, keyword by campaign, etc.), and Custom variables values
datatable_archiving_maximum_rows_subtable_referrers = 5000

; maximum number of rows for the User ID report
datatable_archiving_maximum_rows_userid_users = 5000

; maximum number of rows for any of the Actions tables (pages, downloads, outlinks)
datatable_archiving_maximum_rows_actions = 5000

; maximum number of rows for pages in categories (sub pages, when clicking on the + for a page category)
datatable_archiving_maximum_rows_subtable_actions = 5000

; maximum number of rows for the Site Search table
 datatable_archiving_maximum_rows_site_search = 5000

; maximum number of rows for any of the Events tables (Categories, Actions, Names)
datatable_archiving_maximum_rows_events = 5000

; maximum number of rows for sub-tables of the Events tables (eg. for the subtables Categories>Actions or Categories>Names).
datatable_archiving_maximum_rows_subtable_events = 100


[mail]

[Plugins]
Plugins[] = "CoreVue"
Plugins[] = "CorePluginsAdmin"
Plugins[] = "CoreAdminHome"
Plugins[] = "CoreHome"
Plugins[] = "WebsiteMeasurable"
Plugins[] = "IntranetMeasurable"
Plugins[] = "Diagnostics"
Plugins[] = "CoreVisualizations"
Plugins[] = "Proxy"
Plugins[] = "API"
Plugins[] = "Widgetize"
Plugins[] = "Transitions"
Plugins[] = "LanguagesManager"
Plugins[] = "Actions"
Plugins[] = "Dashboard"
Plugins[] = "MultiSites"
Plugins[] = "Referrers"
Plugins[] = "UserLanguage"
Plugins[] = "DevicesDetection"
Plugins[] = "Goals"
Plugins[] = "SEO"
Plugins[] = "Events"
Plugins[] = "UserCountry"
Plugins[] = "VisitsSummary"
Plugins[] = "VisitFrequency"
Plugins[] = "VisitTime"
Plugins[] = "VisitorInterest"
Plugins[] = "RssWidget"
Plugins[] = "Feedback"
Plugins[] = "Monolog"
Plugins[] = "Login"
Plugins[] = "TwoFactorAuth"
Plugins[] = "UsersManager"
Plugins[] = "SitesManager"
Plugins[] = "Installation"
Plugins[] = "CoreUpdater"
Plugins[] = "CoreConsole"
Plugins[] = "ScheduledReports"
Plugins[] = "UserCountryMap"
Plugins[] = "Live"
Plugins[] = "PrivacyManager"
Plugins[] = "ImageGraph"
Plugins[] = "Annotations"
Plugins[] = "Overlay"
Plugins[] = "SegmentEditor"
Plugins[] = "Insights"
Plugins[] = "Morpheus"
Plugins[] = "Contents"
Plugins[] = "BulkTracking"
Plugins[] = "Resolution"
Plugins[] = "DevicePlugins"
Plugins[] = "Heartbeat"
Plugins[] = "Intl"
Plugins[] = "Marketplace"
Plugins[] = "CustomJsTracker"
Plugins[] = "Tour"
Plugins[] = "PagePerformance"
Plugins[] = "CustomDimensions"
Plugins[] = "FeatureFlags"
Plugins[] = "MobileAppMeasurable"
Plugins[] = "CustomVariables"
Plugins[] = "EnvironmentVariables"
Plugins[] = "HeatmapSessionRecording"
Plugins[] = "UsersFlow"


[PluginsInstalled]
PluginsInstalled[] = "API"
PluginsInstalled[] = "Actions"
PluginsInstalled[] = "Annotations"
PluginsInstalled[] = "BulkTracking"
PluginsInstalled[] = "Contents"
PluginsInstalled[] = "CoreAdminHome"
PluginsInstalled[] = "CoreConsole"
PluginsInstalled[] = "CoreHome"
PluginsInstalled[] = "CorePluginsAdmin"
PluginsInstalled[] = "CoreUpdater"
PluginsInstalled[] = "CoreVisualizations"
PluginsInstalled[] = "CoreVue"
PluginsInstalled[] = "CustomDimensions"
PluginsInstalled[] = "CustomVariables"
PluginsInstalled[] = "CustomJsTracker"
PluginsInstalled[] = "DBStats"
PluginsInstalled[] = "Dashboard"
PluginsInstalled[] = "DevicePlugins"
PluginsInstalled[] = "DevicesDetection"
PluginsInstalled[] = "Diagnostics"
PluginsInstalled[] = "Ecommerce"
PluginsInstalled[] = "EnvironmentVariables"
PluginsInstalled[] = "Events"
PluginsInstalled[] = "FeatureFlags"
PluginsInstalled[] = "Feedback"
PluginsInstalled[] = "GeoIp2"
PluginsInstalled[] = "Goals"
PluginsInstalled[] = "Heartbeat"
PluginsInstalled[] = "HeatmapSessionRecording"
PluginsInstalled[] = "ImageGraph"
PluginsInstalled[] = "Insights"
PluginsInstalled[] = "Installation"
PluginsInstalled[] = "Intl"
PluginsInstalled[] = "IntranetMeasurable"
PluginsInstalled[] = "JsTrackerInstallCheck"
PluginsInstalled[] = "LanguagesManager"
PluginsInstalled[] = "Live"
PluginsInstalled[] = "Login"
PluginsInstalled[] = "Marketplace"
PluginsInstalled[] = "MobileAppMeasurable"
PluginsInstalled[] = "MobileMessaging"
PluginsInstalled[] = "Monolog"
PluginsInstalled[] = "Morpheus"
PluginsInstalled[] = "MultiSites"
PluginsInstalled[] = "Overlay"
PluginsInstalled[] = "PagePerformance"
PluginsInstalled[] = "PrivacyManager"
PluginsInstalled[] = "ProfessionalServices"
PluginsInstalled[] = "Proxy"
PluginsInstalled[] = "Referrers"
PluginsInstalled[] = "Resolution"
PluginsInstalled[] = "RssWidget"
PluginsInstalled[] = "SEO"
PluginsInstalled[] = "ScheduledReports"
PluginsInstalled[] = "SegmentEditor"
PluginsInstalled[] = "SitesManager"
PluginsInstalled[] = "TagManager"
PluginsInstalled[] = "Tour"
PluginsInstalled[] = "Transitions"
PluginsInstalled[] = "TwoFactorAuth"
PluginsInstalled[] = "UserCountry"
PluginsInstalled[] = "UserCountryMap"
PluginsInstalled[] = "UserId"
PluginsInstalled[] = "UserLanguage"
PluginsInstalled[] = "UsersFlow"
PluginsInstalled[] = "UsersManager"
PluginsInstalled[] = "VisitFrequency"
PluginsInstalled[] = "VisitTime"
PluginsInstalled[] = "VisitorInterest"
PluginsInstalled[] = "VisitsSummary"
PluginsInstalled[] = "WebsiteMeasurable"
PluginsInstalled[] = "Widgetize"

[HeatmapSessionRecording]
add_tracking_code_only_when_needed = 1
session_recording_sample_limits = "50,100,250,500,1000,2000,5000"
load_css_from_db = 1
max_time_allowed_on_page_column_limit = "9.2233720368548E+18"
default_heatmap_width = 1920

[UsersFlow]
UsersFlow_num_max_steps = 10
UsersFlow_num_max_rows_in_actions = 100
UsersFlow_num_max_links_per_interaction = 5000
