<?php

/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret or copyright law.
 * Redistribution of this information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
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
