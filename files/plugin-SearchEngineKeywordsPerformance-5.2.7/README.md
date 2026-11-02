# Search Engine Keywords Performance Plugin for Matomo

## Description

Analyse search queries alongside visits, goals, sales activity, campaigns, and user behaviour to understand which keywords attract valuable visitors and contribute to business outcomes. Instead of reviewing search performance in separate tools, bring keyword data into Matomo and connect it with the analytics reports you already use.

Monitor the keywords people use to find your website, the search engines they come from, and the results they generate. Track impressions, clicks, click-through rates, and average positions without switching between platforms, and identify opportunities to improve your search visibility and organic performance.

### How Search Engine Keywords Performance Works

<div class="main-div-readme" style="display: flex;height: auto;">
<div class="left-div-readme" style="width: 50%;">
<p>Search traffic is not limited to standard web results. Image and video results can also bring visitors to your website.</p>
<p>Review the <a href="https://matomo.org/faq/reports/analyse-search-keywords-reports/">keywords</a> connected to web results and visual search traffic to understand how these assets contribute to search visibility, visits, and <a href="https://matomo.org/faq/reports/analyse-goal-reports-and-conversion-rates/">conversions</a>.</p>
</div>
<div class="right-div-readme" style="flex-grow: 1;">
<img src="https://plugins.matomo.org/img/SearchEngineKeywordsPerformance/image3.png" style="margin-left: 24px;" alt="Web, image and video search keywords">
</div>
</div>

#### Connect SEO data with conversions

<div class="main-div-readme" style="display: flex;height: auto;">
<div class="left-div-readme" style="width: 50%;">
<p>Search Console and webmaster tools show how your content performs in search results. Matomo helps connect that data with what happens after visitors arrive.</p>
<p>Compare keywords with visits, goal conversions, <a href="https://matomo.org/faq/reports/data-measured-and-reported-by-ecommerce-tracking/">sales revenue</a>, <a href="https://matomo.org/faq/reports/common-event-tracking-use-cases/">events</a>, and other Matomo metrics to understand which search queries drive engagement, conversions, and revenue.</p>
</div>
<div class="right-div-readme" style="flex-grow: 1;">
<img src="https://plugins.matomo.org/img/SearchEngineKeywordsPerformance/image1.png" style="margin-left: 24px;" alt="Connect SEO data with conversions">
</div>
</div>

#### Segment keyword performance

Analyse keyword data with Matomo dimensions and segments to answer more specific SEO questions.

Explore keyword performance by landing page, device type, country, [campaign](https://matomo.org/faq/reports/what-is-campaign-tracking-and-why-it-is-important/), or visitor type. Identify search queries that generate conversions, countries that drive valuable traffic, devices that perform best, and landing pages that attract visitors who take action.

#### Collect keyword data from multiple sources

<div class="main-div-readme" style="display: flex;height: auto;">
<div class="left-div-readme" style="width: 50%;">
<p>Search Engine Keywords Performance retrieves keyword performance data from Google Search Console, Bing Webmaster Tools, and Yandex Webmaster, and keyword information available through search engine referrers.</p>
<p>Gain greater visibility into the search keywords that drive visitors to your website and uncover keyword data that is often unavailable in standard analytics reports and hidden behind “Keyword not defined”.</p>
</div>
<div class="right-div-readme" style="flex-grow: 1;">
<img src="https://plugins.matomo.org/img/SearchEngineKeywordsPerformance/image4.png" style="margin-left: 24px;" alt="Collect keyword data from multiple sources">
</div>
</div>

#### Monitor technical search performance

<div class="main-div-readme" style="display: flex;height: auto;">
<div class="left-div-readme" style="width: 50%;">
<p>Track <a href="https://matomo.org/faq/search-engine-keywords-performance/faq_23857/">crawling</a> and indexing information from supported search engines. Review crawled pages, indexed pages, crawl errors, and other issues that may affect search visibility.</p>
<p>Use these reports to identify pages that search engines cannot access and prioritise fixes that improve content discoverability across search engines and AI-powered search experiences.</p>
</div>
<div class="right-div-readme" style="flex-grow: 1;">
<img src="https://plugins.matomo.org/img/SearchEngineKeywordsPerformance/image2.png" style="margin-left: 24px;" alt="Monitor technical search performance">
</div>
</div>

### Try Search Engine Keywords Performance Today

Search Engine Keywords Performance brings search query data into Matomo, where marketing teams can analyse website, goal, and Ecommerce data. Understand which keywords create visibility, which ones drive valuable visits, and where to focus your SEO efforts next.

Start your 30-day free trial today.

## Dependencies
This plugin had its vendored dependencies scoped using [matomo scoper](https://github.com/matomo-org/matomo-scoper). This means that composer packages are prefixed so that they won't conflict with the same libraries used by other plugins. If you need to update a dependency, you should be able to run `composer install` to populate the vendor directory, make sure that you have the [DevPluginCommands plugin](https://github.com/innocraft/dev-plugin-commands) installed, and run the following command `./console devplugincommands:process-dependencies --plugin="SearchEngineKeywordsPerformance" --downgrade-php` to scope and transpile the dependencies.

### Keyword performance reporting
* [Import search query data](https://matomo.org/subcategory/set-up-the-import/) from supported search engines.
* View keywords directly within Matomo reports.
* [Analyse impressions](https://matomo.org/faq/reports/analyse-search-keywords-reports/), clicks, CTR, and average search position.
* Surface keyword data where search engines still provide it.
* Uncover keywords associated with image and video search traffic.

### Supported integrations
* Connect [Google Search Console](https://matomo.org/faq/search-engine-keywords-performance/import-google-search-keywords-to-matomo-cloud/) properties and import search performance data automatically into Matomo.
* Import keyword and search performance data from [Bing Webmaster Tools](https://matomo.org/faq/reports/import-bing-and-yahoo-search-keywords-into-matomo/).
* Import keyword performance data from [Yandex Webmaster](https://matomo.org/faq/reports/import-yandex-search-keywords-into-matomo/).
* Access keyword data without switching between platforms.

### Segmentation and analysis
* Use search keywords as a reporting dimension.
* Combine keyword data with Matomo [segments](https://matomo.org/guide/reporting-tools/segmentation/) and [dimensions](https://matomo.org/faq/custom-reports/faq_25243/).
* Analyse search performance by country, device, landing page, campaign, and other dimensions.

### SEO performance monitoring
* Track rankings over time.
* Monitor impressions, clicks, CTR, and position trends.
* Identify opportunities to improve search visibility.

### Crawl and indexing reports
* Review pages crawled and indexed by supported search engines.
* Monitor crawl errors and indexing issues.
* Identify pages that search engines cannot access.
