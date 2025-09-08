# Search Engine Keywords Performance Plugin for Matomo

## Description

Uncover the keywords people use to find your site in the search engines. Learn which keywords are driving the most traffic, leads, and sales.

There was a time when Google Analytics let you see what keywords people searched for to find your site. But one day, Google curtailed this critical information behind two fateful, cryptic words: "(not provided)."

Since then, there was no way you could access this data. Unless you used Matomo's Search Engine Keywords Performance plugin, that is.

With Search Engine Keywords Performance, the keywords people use to find your site become a dimension in your "Referrers" reports.

Monitor your keywords' positions and boost your SEO performance like in the old days.

### How Search Engine Keywords Performance Works

#### All the Keywords Search Engines Don't Want You to See In One Report

<div class="main-div-readme" style="display: flex;height: auto;">
<div class="left-div-readme" style="width: 50%;">
<p>Google, Yahoo, and Bing may not want you to see what keywords get you traffic, but we do. How? By leveraging their APIs.</p>
<p>Slice the keywords data with one of the 90+ dimensions and mix them with metrics like impressions, clicks, CTR, and the average position in the SERPs.</p>
</div>
<div class="right-div-readme" style="flex-grow: 1;">
<img src="https://plugins.matomo.org/img/SearchEngineKeywordsPerformance/image1.png" style="margin-left: 24px;" alt="All the Keywords Search Engines Don't Want You to See In One Report">
</div>
</div>

#### Get An In-Depth Look at Your Crawling Performance

<div class="main-div-readme" style="display: flex;height: auto;">
<div class="left-div-readme" style="width: 50%;">
<p>No matter how well you optimise your site, without proper crawling, your SEO efforts will be in vain.</p>
<p>Discover the number of pages crawled and indexed, 404 pages found, and other issues that could affect your crawling performance in Yahoo and Bing.</p>
<p>The page crawling error reports will show you what pages could not be crawled by a search engine with a detailed reason, so you can fix them right away.</p>
</div>
<div class="right-div-readme" style="flex-grow: 1;">
<img src="https://plugins.matomo.org/img/SearchEngineKeywordsPerformance/image2.png" style="margin-left: 24px;" alt="Get An In-Depth Look at Your Crawling Performance">
</div>
</div>

#### Identify What Keywords Your Images and Videos Bring You Traffic

<div class="main-div-readme" style="display: flex;height: auto;">
<div class="left-div-readme" style="width: 50%;">
<p>Considering that YouTube and Google Images are the second and third largest search engines, your videos and images can drive significant organic traffic to your site.</p>
<p>With the Search Engine Keywords Performance plugin, you can uncover every keyword they rank for and how many visitors they attract, among other metrics.</p>
</div>
<div class="right-div-readme" style="flex-grow: 1;">
<img src="https://plugins.matomo.org/img/SearchEngineKeywordsPerformance/image3.png" style="margin-left: 24px;" alt="Identify What Keywords Your Images and Videos Bring You Traffic">
</div>
</div>

#### See How Your Keyword Performance Evolves Over Time

<div class="main-div-readme" style="display: flex;height: auto;">
<div class="left-div-readme" style="width: 50%;">
<p>Track your top keywords and see how your metrics and KPIs unfold. Monitor, identify, and optimise your SEO strategy for opportunities to get the highest return from your efforts.</p>
</div>
<div class="right-div-readme" style="flex-grow: 1;">
<img src="https://plugins.matomo.org/img/SearchEngineKeywordsPerformance/image4.png" style="margin-left: 24px;" alt="See How Your Keyword Performance Evolves Over Time">
</div>
</div>

### Try Search Engine Keywords Performance Today

Unveil the true picture of your SEO performance with Matomo's Search Engine Keywords Performance plugin. See once again what keywords you rank for and take your organic traffic to the next level.

It's time you enjoy an unparalleled data-driven SEO strategy with Matomo. Start your 30-day free trial today.

## Dependencies
This plugin had its vendored dependencies scoped using [matomo scoper](https://github.com/matomo-org/matomo-scoper). This means that composer packages are prefixed so that they won't conflict with the same libraries used by other plugins. If you need to update a dependency, you should be able to run `composer install` to populate the vendor directory, make sure that you have the [DevPluginCommands plugin](https://github.com/innocraft/dev-plugin-commands) installed, and run the following command `./console devplugincommands:process-dependencies --plugin="SearchEngineKeywordsPerformance" --downgrade-php` to scope and transpile the dependencies.

### Features
* New Search Keywords report in Matomo Referrers section.
* View Keywords analytics by search type (web VS image VS video).
* View combined Keywords across all search engines (Google + Bing + Yahoo + Yandex).
* Monitor Keyword rankings and Search Engine Optimisation performance for each keyword with [Row Evolution](https://matomo.org/docs/row-evolution/).
* New Crawling overview report show how Search engines bots crawl your websites (Bing + Yahoo and Yandex).
* View crawling overview key metrics (for Bing + Yahoo and Yandex): crawled pages, total pages in index, total inboud links, robots.txt exclusion page count, crawl errors, DNS failures, connection timeouts, page redirects (301, 302 http status), error pages (4xx http status), internet error pages (5xx http status).
* Import the detailed list of search keywords for Google search, Google images and Google Videos directly from Google Search Console.
* Import the detailed list of search keywords from Bing and Yahoo! search directly from Bing Webmaster Tools.
* Import the detailed list of search keywords from Yandex search directly from Yandex Webmaster API.
* View all crawling errors with detailed reasons like server errors, robots.txt exclusions, not found pages, ... (Bing + Yahoo)
* Possibility to add support for other search engines that provide their data through an API (contact us).
* Get your Keyword analytics SEO reports by [email](https://matomo.org/docs/email-reports/) to you, your colleagues or customers.
* Export your Keyword analytics report using the [Search Keywords Performance Monitor API](http://developer.matomo.org/api-reference/reporting-api#SearchEngineKeywordsPerformance). 