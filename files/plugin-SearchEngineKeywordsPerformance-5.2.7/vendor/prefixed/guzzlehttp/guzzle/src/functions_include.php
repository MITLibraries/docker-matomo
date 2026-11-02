<?php

namespace Matomo\Dependencies\SearchEngineKeywordsPerformance;

// Don't redefine the functions if included multiple times.
if (!\function_exists('Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\GuzzleHttp\\describe_type')) {
    require __DIR__ . '/functions.php';
}
