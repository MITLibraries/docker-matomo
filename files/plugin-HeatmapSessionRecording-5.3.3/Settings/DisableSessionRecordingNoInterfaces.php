<?php

declare(strict_types=1);

namespace Piwik\Plugins\HeatmapSessionRecording\Settings;

use Piwik\Settings\FieldConfig;
use Piwik\Settings\Plugin\SystemSetting;

class DisableSessionRecordingNoInterfaces
{
    private $value;

    private function __construct(bool $value)
    {
        $this->value = $value;
    }

    public static function getInstance(?int $idSite = null): self
    {
        $systemSetting = new SystemSetting(
            'disableSessionRecording',
            false,
            FieldConfig::TYPE_BOOL,
            'HeatmapSessionRecording'
        );
        return new self($systemSetting->getValue());
    }

    public function getValue(): bool
    {
        return $this->value;
    }
}
