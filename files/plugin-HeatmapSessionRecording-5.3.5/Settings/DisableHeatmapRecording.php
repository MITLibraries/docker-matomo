<?php

declare(strict_types=1);

namespace Piwik\Plugins\HeatmapSessionRecording\Settings;

use Piwik\Piwik;
use Piwik\Policy\CnilPolicy;
use Piwik\Settings\FieldConfig;
use Piwik\Settings\Interfaces\PolicyComparisonInterface;
use Piwik\Settings\Interfaces\SettingValueInterface;
use Piwik\Settings\Interfaces\SystemSettingInterface;
use Piwik\Settings\Interfaces\Traits\Getters\SystemGetterTrait;
use Piwik\Settings\Interfaces\Traits\PolicyComparisonTrait;

if (
    !interface_exists(PolicyComparisonInterface::class) ||
    !interface_exists(SettingValueInterface::class) ||
    !interface_exists(SystemSettingInterface::class) ||
    !trait_exists(PolicyComparisonTrait::class) ||
    !trait_exists(SystemGetterTrait::class)
) {
    class_alias(DisableHeatmapRecordingNoInterfaces::class, DisableHeatmapRecording::class);
} else {
    class DisableHeatmapRecording implements
        PolicyComparisonInterface,
        SettingValueInterface,
        SystemSettingInterface
    {
        /**
        * @use PolicyComparisonTrait<bool>
        */
        use PolicyComparisonTrait;

        /**
        * @use SystemGetterTrait<bool>
        */
        use SystemGetterTrait;

        /**
        * @var bool
        */
        private $value;

        private function __construct(bool $value)
        {
            $this->value = $value;
        }

        public function getValue()
        {
            return $this->value;
        }

        protected static function getSystemDefaultValue()
        {
            return false;
        }

        protected static function getSystemName(): string
        {
            return 'disableHeatmapRecording';
        }

        protected static function getSystemType(): string
        {
            return FieldConfig::TYPE_BOOL;
        }

        public static function getComplianceRequirementNote(?int $idSite = null): string
        {
            return Piwik::translate('HeatmapSessionRecording_PolicyHeatmapRequirementNote');
        }

        public static function getInstance(?int $idSite = null)
        {
            $values = self::getPolicyRequiredValues($idSite);
            $values['system'] = self::getSystemValue();

            $strictest = self::getStrictestValueFromArray($values);
            return new self($strictest);
        }

        public static function getTitle(): string
        {
            return Piwik::translate('HeatmapSessionRecording_PolicyHeatmapTitle');
        }

        public static function getInlineHelp(): string
        {
            return '';
        }

        protected static function compareStrictness($value1, $value2)
        {
            return $value1 || $value2;
        }

        public static function getPolicyRequirements(): array
        {
            return [
                CnilPolicy::class => true
            ];
        }

        public static function isCompliant(string $policy, ?int $idSite = null): bool
        {
            $policyValues = self::getPolicyRequirements();

            if (!array_key_exists($policy, $policyValues)) {
                return true;
            }

            $currentValue = self::getInstance($idSite)->getValue();

            return $currentValue === $policyValues[$policy];
        }
    }
}
