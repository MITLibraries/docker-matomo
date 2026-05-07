<?php

namespace Matomo\Dependencies\SearchEngineKeywordsPerformance;

if (\class_exists('Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Client', \false)) {
    // Prevent error with preloading in PHP 7.4
    // @see https://github.com/googleapis/google-api-php-client/issues/1976
    return;
}
$classMap = ['Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Client' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Client', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Service' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Service', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\AccessToken\\Revoke' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_AccessToken_Revoke', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\AccessToken\\Verify' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_AccessToken_Verify', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Model' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Model', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Utils\\UriTemplate' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Utils_UriTemplate', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\AuthHandler\\Guzzle6AuthHandler' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_AuthHandler_Guzzle6AuthHandler', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\AuthHandler\\Guzzle7AuthHandler' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_AuthHandler_Guzzle7AuthHandler', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\AuthHandler\\AuthHandlerFactory' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_AuthHandler_AuthHandlerFactory', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Http\\Batch' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Http_Batch', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Http\\MediaFileUpload' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Http_MediaFileUpload', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Http\\REST' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Http_REST', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Task\\Retryable' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Task_Retryable', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Task\\Exception' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Task_Exception', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Task\\Runner' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Task_Runner', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Collection' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Collection', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Service\\Exception' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Service_Exception', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Service\\Resource' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Service_Resource', 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google\\Exception' => 'Matomo\\Dependencies\\SearchEngineKeywordsPerformance\\Google_Exception'];
foreach ($classMap as $class => $alias) {
    \class_alias($class, $alias);
}
/**
 * This class needs to be defined explicitly as scripts must be recognized by
 * the autoloader.
 */
class Google_Task_Composer extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Task\Composer
{
}
/** @phpstan-ignore-next-line */
if (\false) {
    class Google_AccessToken_Revoke extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\AccessToken\Revoke
    {
    }
    class Google_AccessToken_Verify extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\AccessToken\Verify
    {
    }
    class Google_AuthHandler_AuthHandlerFactory extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\AuthHandler\AuthHandlerFactory
    {
    }
    class Google_AuthHandler_Guzzle6AuthHandler extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\AuthHandler\Guzzle6AuthHandler
    {
    }
    class Google_AuthHandler_Guzzle7AuthHandler extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\AuthHandler\Guzzle7AuthHandler
    {
    }
    class Google_Client extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Client
    {
    }
    class Google_Collection extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Collection
    {
    }
    class Google_Exception extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Exception
    {
    }
    class Google_Http_Batch extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Http\Batch
    {
    }
    class Google_Http_MediaFileUpload extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Http\MediaFileUpload
    {
    }
    class Google_Http_REST extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Http\REST
    {
    }
    class Google_Model extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Model
    {
    }
    class Google_Service extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service
    {
    }
    class Google_Service_Exception extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\Exception
    {
    }
    class Google_Service_Resource extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Service\Resource
    {
    }
    class Google_Task_Exception extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Task\Exception
    {
    }
    interface Google_Task_Retryable extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Task\Retryable
    {
    }
    class Google_Task_Runner extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Task\Runner
    {
    }
    class Google_Utils_UriTemplate extends \Matomo\Dependencies\SearchEngineKeywordsPerformance\Google\Utils\UriTemplate
    {
    }
}
