<!--
  Copyright (C) InnoCraft Ltd - All rights reserved.

  NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
  The intellectual and technical concepts contained herein are protected by trade secret
  or copyright law. Redistribution of this information or reproduction of this material is
  strictly forbidden unless prior written permission is obtained from InnoCraft Ltd.

  You shall use this code only in accordance with the license agreement obtained from
  InnoCraft Ltd.

  @link https://www.innocraft.com/
  @license For license details see https://www.innocraft.com/license
-->

<template>
  <div>
    <ContentBlock
      :content-title="translate('CustomReports_ManageReports')"
      :feature="translate('CustomReports_ManageReports')"
    >
      <p>{{ translate('CustomReports_CustomReportIntroduction') }}</p>
      <div class="reportSearchFilter">
        <Field
          uicontrol="text"
          name="reportSearch"
          :title="translate('General_Search')"
          v-show="reports.length > 0"
          v-model="searchFilter"
        >
        </Field>
      </div>
      <table v-content-table>
        <thead>
          <tr>
            <th class="index">{{ translate('General_Id') }}</th>
            <th class="name">{{ translate('General_Name') }}</th>
            <th class="description">{{ translate('General_Description') }}</th>
            <th class="reportType">{{ translate('CustomReports_Type') }}</th>
            <th class="reportCategory">{{ translate('CustomReports_Category') }}</th>
            <th class="action">{{ translate('General_Actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-show="isLoading || isUpdating">
            <td colspan="7">
              <span class="loadingPiwik"><img src="plugins/Morpheus/images/loading-blue.gif" />
                {{ translate('General_LoadingData') }}</span>
            </td>
          </tr>
          <tr v-show="!isLoading && reports.length == 0">
            <td colspan="7">
              {{ translate('CustomReports_NoCustomReportsFound') }}
            </td>
          </tr>
          <tr
            v-for="report in sortedReports"
            :id="`report${report.idcustomreport}`"
            class="customReports"
            :key="report.idcustomreport"
          >
            <td class="index">{{ report.idcustomreport }}</td>
            <td class="name">{{ report.name }} <span
                class="icon-locked"
                :title="translate('CustomReports_ReportEditNotAllowedAllWebsitesUpdated')"
                v-show="!report.idsite && !isSuperUser"
              /><span
                class="icon-info2"
                :title="translate('CustomReports_ReportAvailableToAllWebsites')"
                v-show="!report.idsite && isSuperUser"
              />
              <span
                class="icon-locked"
                :title="translate('CustomReports_ReportEditNotAllowedMultipleWebsitesAccessIssue')"
                v-show="!report.allowedToEdit && isMultiSiteReport(report)"
              /><span
                class="icon-info2"
                :title="translate('CustomReports_ReportAvailableToMultipleWebsites')"
                v-show="report.allowedToEdit && isMultiSiteReport(report)"
              />
            </td>
            <td
              class="description"
              :title="htmlEntities(report.description)"
            >{{ truncate(report.description.trim(), 60) }}</td>
            <td class="reportType">{{ reportTypesReadable[report.report_type] }}</td>
            <td
              class="reportCategory"
              :title="htmlEntities(report.category.name)"
            >
              {{ truncate(report.category.name.trim(), 60) }}
              <span v-if="report.subcategory?.name">
                - {{ truncate(report.subcategory.name.trim(), 60) }}
              </span>
            </td>
            <td class="action">
              <a
                  v-show="((report.idsite && !isMultiSiteReport(report)) || report.allowedToEdit)
                  && report.status === 'active'"
                  class="table-action icon-pause"
                  :title="translate('CustomReports_PauseReportInfo')"
                  @click="pauseReport(report)"
              />
              <a
                  v-show="((report.idsite && !isMultiSiteReport(report)) || report.allowedToEdit)
                  && report.status === 'paused'"
                  class="table-action icon-play"
                  :title="translate('CustomReports_ResumeReportInfo')"
                  @click="resumeReport(report)"
              />
              <a
                class="table-action icon-edit"
                :title="translate('CustomReports_EditReport')"
                @click="editReport(report.idcustomreport)"
              />
              <a
                target="_blank"
                class="table-action icon-show"
                :title="translate('CustomReports_ViewReportInfo')"
                :href="getViewReportLink(report)"
              />
              <a
                class="table-action icon-delete"
                :title="translate('CustomReports_DeleteReportInfo')"
                @click="deleteReport(report)"
                v-show="(report.idsite && !isMultiSiteReport(report)) || report.allowedToEdit"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tableActionBar">
        <a
          class="createNewReport"
          @click="createReport()"
        ><span class="icon-add" /> {{ translate('CustomReports_CreateNewReport') }}</a>
      </div>
    </ContentBlock>
    <div
      class="ui-confirm"
      ref="confirmDeleteReport"
    >
      <h2>{{ translate('CustomReports_DeleteReportConfirm') }} </h2>
      <input
        role="yes"
        type="button"
        :value="translate('General_Yes')"
      />
      <input
        role="no"
        type="button"
        :value="translate('General_No')"
      />
    </div>
    <div
        class="ui-confirm"
        ref="confirmPauseReport"
    >
      <h2>{{ translate('CustomReports_PauseReportConfirm') }} </h2>
      <input
          role="yes"
          type="button"
          :value="translate('General_Yes')"
      />
      <input
          role="no"
          type="button"
          :value="translate('General_No')"
      />
    </div>
    <div
        class="ui-confirm"
        ref="confirmResumeReport"
    >
      <h2>{{ translate('CustomReports_ResumeReportConfirm') }} </h2>
      <input
          role="yes"
          type="button"
          :value="translate('General_Yes')"
      />
      <input
          role="no"
          type="button"
          :value="translate('General_No')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Matomo,
  ContentBlock,
  ContentTable,
  MatomoUrl,
  NotificationType,
  NotificationsStore,
} from 'CoreHome';
import { Field } from 'CorePluginsAdmin';
import CustomReportsStore from '../CustomReports.store';
import { CustomReport } from '../types';
import truncateText2 from '../truncateText2';

interface ReportsListState {
  searchFilter: string;
}

const notificationId = 'customreportmanagementlist';

export default defineComponent({
  props: {
  },
  components: {
    ContentBlock,
    Field,
  },
  directives: {
    ContentTable,
  },
  data(): ReportsListState {
    return {
      searchFilter: '',
    };
  },
  created() {
    CustomReportsStore.getAvailableReportTypes();
    CustomReportsStore.fetchReports();
  },
  methods: {
    createReport() {
      this.editReport(0);
    },
    editReport(idCustomReport: number) {
      MatomoUrl.updateHash({
        ...MatomoUrl.hashParsed.value,
        idCustomReport,
      });
    },
    pauseReport(report: CustomReport) {
      Matomo.helper.modalConfirm(this.$refs.confirmPauseReport as HTMLElement, {
        yes: () => {
          CustomReportsStore.pauseReport(report.idcustomreport, report.idsite).then((response) => {
            if (!response || response.type === 'error') {
              CustomReportsStore.reload();
              return;
            }
            CustomReportsStore.reload().then(() => {
              this.showNotification(this.translate('CustomReports_PausedReport'), 'success');
            });

            Matomo.postEvent('updateReportingMenu');
          });
        },
      });
    },
    resumeReport(report: CustomReport) {
      Matomo.helper.modalConfirm(this.$refs.confirmResumeReport as HTMLElement, {
        yes: () => {
          CustomReportsStore.resumeReport(report.idcustomreport, report.idsite).then((response) => {
            if (!response || response.type === 'error') {
              CustomReportsStore.reload();
              return;
            }
            CustomReportsStore.reload().then(() => {
              this.showNotification(this.translate('CustomReports_ResumedReport'), 'success');
            });

            Matomo.postEvent('updateReportingMenu');
          });
        },
      });
    },
    showNotification(message: string, context: NotificationType['context'],
      type: null|NotificationType['type'] = null) {
      const instanceId = NotificationsStore.show({
        message,
        context,
        id: notificationId,
        type: type !== null ? type : 'toast',
      });

      setTimeout(() => {
        NotificationsStore.scrollToNotification(instanceId);
      }, 200);
    },
    deleteReport(report: CustomReport) {
      Matomo.helper.modalConfirm(this.$refs.confirmDeleteReport as HTMLElement, {
        yes: () => {
          CustomReportsStore.deleteReport(report.idcustomreport, report.idsite).then(() => {
            CustomReportsStore.reload();

            Matomo.postEvent('updateReportingMenu');
          });
        },
      });
    },
    getViewReportLink(report: CustomReport) {
      return `?${MatomoUrl.stringify({
        module: 'CoreHome',
        action: 'index',
        idSite: report.linkIdSite,
        period: 'day',
        date: 'yesterday',
      })}#?${MatomoUrl.stringify({
        category: report.category.id,
        idSite: report.linkIdSite,
        date: MatomoUrl.parsed.value.date,
        period: MatomoUrl.parsed.value.period,
        segment: MatomoUrl.parsed.value.segment,
        subcategory: report.subcategoryLink,
      })}`;
    },
    truncate: truncateText2,
    htmlEntities(v: string) {
      return Matomo.helper.htmlEntities(v);
    },
    isMultiSiteReport(report: CustomReport) {
      return (report.multiple_idsites && report.multiple_idsites.split(','));
    },
  },
  computed: {
    isSuperUser(): boolean {
      return Matomo.hasSuperUserAccess;
    },
    reports(): (typeof CustomReportsStore)['state']['value']['reports'] {
      return CustomReportsStore.state.value.reports;
    },
    sortedReports(): (typeof CustomReportsStore)['state']['value']['reports'] {
      const searchFilter = this.searchFilter.toLowerCase();

      // look through string properties of custom reports for values that have searchFilter in them
      // (mimics angularjs filter() filter)
      const result = [...this.reports].filter((h) => Object.keys(h).some((propName) => {
        const entity = h as unknown as Record<string, unknown>;
        return typeof entity[propName] === 'string'
          && (entity[propName] as string).toLowerCase().indexOf(searchFilter) !== -1;
      }));
      result.sort((lhs, rhs) => {
        const lhsId = parseInt(`${lhs.idcustomreport}`, 10);
        const rhsId = parseInt(`${rhs.idcustomreport}`, 10);
        return lhsId - rhsId;
      });
      return result;
    },
    isLoading(): boolean {
      return CustomReportsStore.state.value.isLoading;
    },
    isUpdating(): boolean {
      return CustomReportsStore.state.value.isUpdating;
    },
    reportTypesReadable(): (typeof CustomReportsStore)['state']['value']['reportTypesReadable'] {
      return CustomReportsStore.state.value.reportTypesReadable;
    },
  },
});
</script>
