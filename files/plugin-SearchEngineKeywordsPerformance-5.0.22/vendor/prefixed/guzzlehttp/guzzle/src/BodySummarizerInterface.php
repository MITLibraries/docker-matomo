<?php

namespace Matomo\Dependencies\SearchEngineKeywordsPerformance\GuzzleHttp;

use Matomo\Dependencies\SearchEngineKeywordsPerformance\Psr\Http\Message\MessageInterface;
interface BodySummarizerInterface
{
    /**
     * Returns a summarized message body.
     */
    public function summarize(MessageInterface $message) : ?string;
}
