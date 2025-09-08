<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\CustomReports\Columns;

use Piwik\Columns\Discriminator;
use Piwik\Columns\Join\ActionNameJoin;
use Piwik\Plugin\Dimension\ActionDimension;
use Piwik\Tracker\Action;

class ProductCategory extends ActionDimension
{
    protected $type = self::TYPE_TEXT;
    protected $category = 'Goals_Ecommerce';
    protected $nameSingular = 'Goals_ProductCategory';
    protected $columnName = 'idaction_product_cat';

    public function getDbColumnJoin(): ActionNameJoin
    {
        return new ActionNameJoin();
    }

    public function getDbDiscriminator(): Discriminator
    {
        return new Discriminator('log_action', 'type', Action::TYPE_ECOMMERCE_ITEM_CATEGORY);
    }
}
