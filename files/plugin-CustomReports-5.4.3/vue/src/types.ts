/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret
 * or copyright law. Redistribution of this information or reproduction of this material is
 * strictly forbidden unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from
 * InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

import { SiteRef } from 'CoreHome';

export interface CustomReportType {
  key: string;
  value: string;
}

interface Category {
  id: string;
  name?: string;
  order?: number;
  icon?: string;
}

interface Subcategory {
  id: string|number;
  name?: string;
  order?: number;
}

export interface Site {
  idsite: string | number;
  name: string;
}

export interface ChildReport {
  idcustomreport: string|number;
  name: string;
  subcategory_order: string|number;
}

export interface CustomReport {
  category: Category;
  created_date: string;
  description: string;
  dimensions: string[];
  idcustomreport: string|number;
  idsite: string|number;
  metrics: string[];
  name: string;
  report_type: string;
  revision: string|number;
  segment_filter: string;
  site: SiteRef;
  status: string;
  subcategory: Subcategory|null;
  updated_date: string;
  child_reports: ChildReport[]
  multipleIdSites: Site[];
  multiple_idsites: null|string;
  allowedToEdit: boolean;

  linkIdSite?: string|number;
  subcategoryLink?: string|number;
}
