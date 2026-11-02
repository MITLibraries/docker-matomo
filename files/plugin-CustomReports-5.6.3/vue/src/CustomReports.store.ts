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

import {
  reactive,
  computed,
  readonly,
  DeepReadonly,
} from 'vue';
import { AjaxHelper, Matomo } from 'CoreHome';
import { CustomReport, CustomReportType } from './types';

interface Option {
  key: string;
  value: string;
}

type GetAvailableCategoriesResponse = {
  uniqueId: string;
  name: string;
  subcategories: {
    uniqueId: string;
    name: string;
  }[];
}[];

type ListByCategory<SubcategoryField extends string, ExtraField extends string = ''> = ({
  category: string;
} & {
  [S in SubcategoryField]: ({
    uniqueId: string;
    name: string;
    description?: string;
  } & {
    [E in ExtraField]?: string;
  })[];
})[];

type GetAvailableMetricsResponse = ListByCategory<'metrics'>;
type GetAvailableDimensionsResponse = ListByCategory<'dimensions', 'sqlSegment'>;

function arrayFilterAndRemoveDuplicates<T>(values: T[]) {
  return [...new Set(values)].filter((v) => !!v);
}

type FormattedListItem<ExtraField extends string = ''> = ({
  group: string;
  key: string;
  value: string;
  tooltip?: string;
} & {
  [E in ExtraField]?: string;
});

function formatExpandableList<SubcategoryField extends string, ExtraField extends string = ''>(
  listByCategories: ListByCategory<SubcategoryField, ExtraField>,
  subcategoryField: SubcategoryField,
  extraField?: ExtraField,
) {
  const list: FormattedListItem<ExtraField>[] = [];

  listByCategories.forEach((category) => {
    category[subcategoryField].forEach((value) => {
      list.push({
        group: category.category,
        key: value.uniqueId,
        value: value.name,
        tooltip: value.description || undefined,
        ...(extraField ? { [extraField]: value[extraField] } : {}),
      });
    });
  });

  return list;
}

const EMPTY_CAT = {
  key: '',
  value: '',
};

interface CustomReportsStoreState {
  reports: CustomReport[];
  reportTypesReadable: Record<string, string>;
  dimensionsReadable: Record<string, string>;
  metricsReadable: Record<string, string>;
  categories: Option[];
  subcategories: Record<string, Option[]>;
  isLoading: boolean;
  isUpdating: boolean;
  allMetrics: FormattedListItem[];
  allDimensions: FormattedListItem<'sqlSegment'>[];
}

class CustomReportsStore {
  private privateState = reactive<CustomReportsStoreState>({
    reports: [],
    reportTypesReadable: {},
    dimensionsReadable: {},
    metricsReadable: {},
    categories: [],
    subcategories: {},
    isLoading: false,
    isUpdating: false,
    allMetrics: [],
    allDimensions: [],
  });

  readonly state = computed(() => readonly(this.privateState));

  private fetchPromise: Promise<CustomReport[]>|null = null;

  private availableReportTypesPromise: Promise<void>|null = null;

  private dimensionsPromise: Promise<void>|null = null;

  private dimensionsIdsiteLoaded: number|string = 0;

  private metricsPromise: Promise<void>|null = null;

  private metricsIdsiteLoaded: number|string = 0;

  reload() {
    this.privateState.reports = [];
    this.fetchPromise = null;
    return this.fetchReports();
  }

  cleanupSegmentDefinition(definition: string) {
    let result = definition;
    result = result.replace('\'', '%27');
    result = result.replace('&', '%26');
    return result;
  }

  getAvailableReportTypes(): Promise<CustomReportsStore['state']['value']['reportTypesReadable']> {
    if (!this.availableReportTypesPromise) {
      this.availableReportTypesPromise = AjaxHelper.fetch<CustomReportType[]>({
        method: 'CustomReports.getAvailableReportTypes',
        filter_limit: '-1',
      }).then((reportTypes) => {
        const reportTypeMap: Record<string, string> = {};
        reportTypes.forEach((rt) => {
          reportTypeMap[rt.key] = rt.value;
        });
        this.privateState.reportTypesReadable = reportTypeMap;
      });
    }

    return this.availableReportTypesPromise!.then(() => this.state.value.reportTypesReadable);
  }

  getAvailableDimensions(
    idSite: number|'all',
  ): Promise<CustomReportsStore['state']['value']['dimensionsReadable']> {
    if (!this.dimensionsPromise || this.dimensionsIdsiteLoaded !== idSite) {
      this.dimensionsIdsiteLoaded = idSite;

      this.dimensionsPromise = AjaxHelper.fetch<GetAvailableDimensionsResponse>({
        method: 'CustomReports.getAvailableDimensions',
        filter_limit: '-1',
        idSite,
      }).then((dimensions) => {
        const dimensionMap: Record<string, string> = {};
        dimensions.forEach((category) => {
          category.dimensions.forEach((dimension) => {
            dimensionMap[dimension.uniqueId] = dimension.name;
          });
        });
        this.privateState.dimensionsReadable = dimensionMap;

        this.privateState.allDimensions = formatExpandableList(
          dimensions,
          'dimensions',
          'sqlSegment',
        );
      });
    }

    return this.dimensionsPromise!.then(() => this.state.value.dimensionsReadable);
  }

  getAvailableMetrics(
    idSite: number|'all',
  ): Promise<CustomReportsStore['state']['value']['metricsReadable']> {
    if (!this.metricsPromise || this.metricsIdsiteLoaded !== idSite) {
      this.metricsIdsiteLoaded = idSite;
      this.metricsPromise = AjaxHelper.fetch<GetAvailableMetricsResponse>({
        method: 'CustomReports.getAvailableMetrics',
        filter_limit: '-1',
        idSite,
      }).then((metrics) => {
        const metricsMap: Record<string, string> = {};
        metrics.forEach((metricsCategory) => {
          metricsCategory.metrics.forEach((metric) => {
            metricsMap[metric.uniqueId] = metric.name;
          });
        });
        this.privateState.metricsReadable = metricsMap;

        this.privateState.allMetrics = formatExpandableList(metrics, 'metrics');
      });
    }

    return this.metricsPromise!.then(() => this.state.value.metricsReadable);
  }

  private categoriesPromise: Promise<void>|null = null;

  private categoriesIdsiteLoaded: number|null = null;

  getAvailableCategories(idSite?: number|'all'): Promise<void> {
    const idSiteToUse = !idSite || idSite === 'all' ? Matomo.idSite : idSite;

    if (!this.categoriesPromise || this.categoriesIdsiteLoaded !== idSite) {
      this.categoriesPromise = AjaxHelper.fetch<GetAvailableCategoriesResponse>({
        method: 'CustomReports.getAvailableCategories',
        filter_limit: '-1',
        idSite: idSiteToUse,
      }).then((response) => {
        const categories: Option[] = [];
        const subcategories: Record<string, Option[]> = {};

        response.forEach((category) => {
          categories.push({ key: category.uniqueId, value: category.name });

          category.subcategories.forEach((subcat) => {
            subcategories[category.uniqueId] = subcategories[category.uniqueId] || [EMPTY_CAT];
            subcategories[category.uniqueId].push({ key: subcat.uniqueId, value: subcat.name });
          });
        });

        this.privateState.categories = categories;
        this.privateState.subcategories = subcategories;
      });
    }

    return this.categoriesPromise!;
  }

  fetchReports(): Promise<CustomReportsStore['state']['value']['reports']> {
    if (!this.fetchPromise) {
      this.fetchPromise = AjaxHelper.fetch<CustomReport[]>({
        method: 'CustomReports.getConfiguredReports',
        filter_limit: '-1',
      });
    }

    this.privateState.isLoading = true;
    this.privateState.reports = [];
    return this.fetchPromise.then((reports) => {
      this.privateState.reports = reports.map((report) => {
        let subcategoryLink: string|number|undefined = undefined;
        if (report?.subcategory?.id) {
          subcategoryLink = report.subcategory.id;
        } else if (report?.category?.id === 'CustomReports_CustomReports') {
          subcategoryLink = report.idcustomreport;
        } else {
          subcategoryLink = report.name;
        }

        return {
          ...report,
          // report.idsite is falsey when report is set for all sites
          linkIdSite: report.idsite ? report.idsite : Matomo.idSite,
          subcategoryLink,
        };
      });

      return this.state.value.reports;
    }).finally(() => {
      this.privateState.isLoading = false;
    });
  }

  findReport(idCustomReport: number, isReload: boolean): Promise<DeepReadonly<CustomReport>> {
    // before going through an API request we first try to find it in loaded reports
    const found = this.state.value.reports.find(
      (r) => parseInt(`${r.idcustomreport}`, 10) === idCustomReport,
    );

    if (found && !isReload) {
      return Promise.resolve(found);
    }

    // otherwise we fetch it via API
    this.privateState.isLoading = true;
    return AjaxHelper.fetch<CustomReport>({
      idCustomReport,
      method: 'CustomReports.getConfiguredReport',
    }).finally(() => {
      this.privateState.isLoading = false;
    });
  }

  deleteReport(
    idCustomReport: number|string,
    idSite: number|string,
  ): Promise<{ type: string, message?: string }> {
    this.privateState.isUpdating = true;
    this.privateState.reports = [];

    return AjaxHelper.fetch(
      {
        idCustomReport,
        idSite: `${idSite}`,
        method: 'CustomReports.deleteCustomReport',
      },
      {
        withTokenInUrl: true,
      },
    ).then(() => ({
      type: 'success',
    })).catch((e) => ({
      type: 'error',
      message: e.message || e as string,
    })).finally(() => {
      this.privateState.isUpdating = false;
    });
  }

  pauseReport(
    idCustomReport: number|string,
    idSite: number|string,
  ): Promise<{ type: string, message?: string }> {
    this.privateState.isUpdating = true;
    this.privateState.reports = [];

    return AjaxHelper.fetch(
      {
        idCustomReport,
        idSite: `${idSite}`,
        method: 'CustomReports.pauseCustomReport',
      },
      {
        withTokenInUrl: true,
      },
    ).then(() => ({
      type: 'success',
    })).catch((e) => ({
      type: 'error',
      message: e.message || e as string,
    })).finally(() => {
      this.privateState.isUpdating = false;
    });
  }

  resumeReport(
    idCustomReport: number|string,
    idSite: number|string,
  ): Promise<{ type: string, message?: string }> {
    this.privateState.isUpdating = true;
    this.privateState.reports = [];

    return AjaxHelper.fetch(
      {
        idCustomReport,
        idSite: `${idSite}`,
        method: 'CustomReports.resumeCustomReport',
      },
      {
        withTokenInUrl: true,
      },
    ).then(() => ({
      type: 'success',
    })).catch((e) => ({
      type: 'error',
      message: e.message || e as string,
    })).finally(() => {
      this.privateState.isUpdating = false;
    });
  }

  createOrUpdateReport(
    report: CustomReport,
    method: string,
    childReportIds: Array<string|number>,
    multipleIdSites: Array<string|number>,
  ): Promise<{ type: string, message?: string, response?: { value: number|string }}> {
    this.privateState.isUpdating = true;
    return AjaxHelper.post<{ value: number|string }>(
      {
        method,
        idCustomReport: report.idcustomreport,
        reportType: report.report_type,
        name: report.name.trim(),
        description: report.description.trim(),
        segmentFilter: encodeURIComponent(report.segment_filter),
        categoryId: report.category?.id,
        subcategoryId: report.subcategory?.id,
        idSite: report.site.id,
        subCategoryReportIds: childReportIds,
        multipleIdSites,
      },
      {
        dimensionIds: arrayFilterAndRemoveDuplicates(report.dimensions),
        metricIds: arrayFilterAndRemoveDuplicates(report.metrics),
      },
      { withTokenInUrl: true },
    ).then((response) => ({
      type: 'success',
      response,
    })).catch((error) => ({
      type: 'error',
      message: error.message || error as string,
    })).finally(() => {
      this.privateState.isUpdating = false;
    });
  }
}

export default new CustomReportsStore();
