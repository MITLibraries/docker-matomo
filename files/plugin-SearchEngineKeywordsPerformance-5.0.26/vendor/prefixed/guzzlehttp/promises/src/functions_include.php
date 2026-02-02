<?php

namespace Matomo\Dependencies\SearchEngineKeywordsPerformance;

// Don't redefine the functions if included multiple times.
if (!\function_exists('Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\GuzzleHttp\\Promise\\promise_for')) {
    require __DIR__ . '/functions.php';
}
