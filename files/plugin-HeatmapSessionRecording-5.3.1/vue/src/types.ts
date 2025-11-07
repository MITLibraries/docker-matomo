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

export interface AvailableTargetPageRuleType {
  name: string;
  value: string;
}

export interface AvailableTargetPageRule {
  example: string;
  name: string;
  types: AvailableTargetPageRuleType[];
  value: string;
}

export interface Status {
  value: string;
  name: string;
}

export interface MatchPageRule {
  attribute: string;
  type: string;
  value: string;
  inverted: string|number;
}

export interface Heatmap {
  breakpoint_mobile: number;
  breakpoint_tablet: number;
  created_date?: string;
  created_date_pretty?: string;
  excluded_elements: string;
  heatmapViewUrl: string;
  idsite: number;
  idsitehsr: number;
  match_page_rules: MatchPageRule[];
  name: string;
  page_treemirror: string;
  sample_limit: number;
  sample_rate: string;
  screenshot_url: string;
  status: string;
  updated_date?: string;
  capture_manually: boolean,
}

export interface SessionRecording {
  capture_keystrokes: boolean;
  created_date?: string;
  created_date_pretty?: string;
  idsite: number;
  idsitehsr: number;
  match_page_rules: MatchPageRule[];
  min_session_time: number;
  name: string;
  requires_activity: boolean;
  sample_limit: number;
  sample_rate: string|number;
  status: string;
  updated_date?: string;
}

export interface DeviceType {
  name: string;
  key: number;
  logo: string;
}

export interface HeatmapType {
  name: string;
  key: number;
}

export type HeatmapMetadata = Record<string, number>;

export interface SessionRecordingEvent {
  time_since_load: number|string;
  event_type: number|string;
  x: number|string;
  y: number|string;
  selector: string;
  text?: unknown;
}

export interface PageviewInSession {
  idloghsr: number|string;
  fold_y_relative: string|number;
  idvisitor: string;
  label: string;
  resolution: string;
  scroll_y_max_relative: string|number;
  server_time: string;
  server_time_pretty: string;
  time_on_page: string|number;
  time_on_page_pretty: string;
}

export interface SessionRecordingData {
  events: SessionRecordingEvent[];
  viewport_w_px: number|string;
  viewport_h_px: number|string;
  pageviews: PageviewInSession[];
  idLogHsr: number|string;
  idSiteHsr: number|string;
  idSite: number|string;
  duration: number|string;
  url: string;
}

declare global {
  interface PiwikGlobal {
    heatmapWriteAccess?: boolean;
  }

  interface Window {
    sessionRecordingData: SessionRecordingData;
  }
}
