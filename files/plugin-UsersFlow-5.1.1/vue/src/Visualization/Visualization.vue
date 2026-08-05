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
  <div class="piwikUsersFlowVisualization" ref="root">
    <div class="usersFlowActionBar">
      <div class="levelOfDetail" name="levelOfDetail">
        <Field
          uicontrol="select"
          name="levelOfDetail"
          :model-value="actualLevelOfDetail"
          @update:model-value="actualLevelOfDetail = $event; updateViewParams()"
          :title="translate('UsersFlow_OptionLevelOfDetail')"
          :full-width="true"
          :options="levelOfDetailOptions"
        >
        </Field>
      </div>
      <div class="actionsPerStep" name="actionsPerStep">
        <Field
          uicontrol="select"
          name="actionsPerStep"
          :title="translate('UsersFlow_OptionNumActionsPerStep')"
          v-model="numActionsPerStep"
          :full-width="true"
          :options="actionsPerStepOptions"
        >
        </Field>
      </div>
      <div class="userFlowSource" name="userFlowSource">
        <Field
          uicontrol="select"
          name="userFlowSource"
          :title="translate('General_Source')"
          v-model="actualUserFlowSource"
          :full-width="true"
          :options="flowSources"
        >
        </Field>
      </div>
    </div>
    <div class="usersFlowLegend" v-show="!isLoading && hasData">
      <div class="items">
        <div class="item">
          <div class="colorBox colorBoxFlow"></div>
          <div class="text">
            <span class="title">{{ translate('UsersFlow_LegendFlow') }}</span>
          </div>
        </div>
        <div class="item">
          <div class="colorBox colorBoxExit"></div>
          <div class="text">
            <span class="title">{{ translate('General_ColumnExits') }}</span>
          </div>
        </div>
        <div class="item">
          <div class="colorBox colorBoxOthers"></div>
          <div class="text">
            <span class="title">
              {{ translate('UsersFlow_LegendGrouped', translate('General_Others')) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="exploringTraffic alert alert-info "
      v-show="exploreStep && exploreUrl"
    >
      {{ translate('UsersFlow_ExploringInfo', exploreUrl, exploreStep) }}
    </div>
    <ActivityIndicator :loading="isLoading" />
    <div
      class="sankeyChartOuter"
      v-show="!isLoading && hasData"
    >
      <div
        class="sankeyChart"
        :class="`linkDetail${actualLevelOfDetail}`"
        ref="sankeyChart"
      />
    </div>
    <div class="usersFlowPopupMenu" />
    <div
      class="pk-emptyDataTable"
      v-show="!hasData"
    >
      {{ translate('CoreHome_ThereIsNoDataForThisReport') }}
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { defineComponent } from 'vue';
import * as d3 from 'd3';
import d3tip from 'd3-tip';
import {
  translate,
  Matomo,
  AjaxHelper,
  ActivityIndicator,
  MatomoUrl,
} from 'CoreHome';
import { Field } from 'CorePluginsAdmin';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import initSankey from '../../../libs/sankey/sankey.js';

initSankey(d3);

interface Option {
  key: string;
  value: string;
}

interface DataSource {
  name: string;
  value: string;
}

interface SubtableRow {
  label: string;
  nb_visits: number;
  nb_proceeded: number;
  nb_exits?: number;
  nb_pages_in_group?: number;
  idsubdatatable: number;
  subtable?: SubtableRow[];
}

interface ReportRow {
  label: string;
  subtable?: SubtableRow[];
  nb_visits: number;
  nb_proceeded: number;
  nb_exits: number;
}

interface DepthNode {
  depth: number;
  in: number;
  out: number;
  totalIn: number;
  totalOut: number;
  totalExits: number;
}

interface SanKeyNode {
  depth: number;
  name: string;
  node: number;
  totalIn: number;
  totalOut?: number;
  totalExits?: number;
  pagesInGroup?: number;
  isSummaryNode?: boolean;
  idSubtable?: number|null;
  value?: number;
}

interface NodeLink {
  depth: number;
  source: number|SanKeyNode;
  target: string|number|SanKeyNode;
  value: number;
}

interface UsersFlowVisualizationState {
  numSteps: number;
  hasData: boolean;
  isLoading: boolean;
  maxSankeyChartDepth: number;
  maxNodeLength: number;
  isExploringTraffic: boolean;
  exploreStep: boolean|number;
  exploreUrl: boolean|string;
  flowSources: Option[];
  numActionsPerStep: number|null;
  rawResponse: ReportRow[]|null;
  actualLevelOfDetail: number;
  actualUserFlowSource?: string;
}

const OUT_NODE_NAME = '_out_';
const SUMMARY_NODE_NAME = 'Others';
const SUMMARY_NODE_NAME_TRANSLATED = translate('General_Others');

const { $ } = window;

function isOutNode(name?: string) {
  return name === OUT_NODE_NAME;
}

function isSummaryNode(name?: string) {
  return name === SUMMARY_NODE_NAME || name === SUMMARY_NODE_NAME_TRANSLATED;
}

export default defineComponent({
  props: {
    actionsPerStep: Number,
    levelOfDetail: Number,
    userFlowSource: String,
    isUserIsAnonymous: Boolean,
  },
  components: {
    Field,
    ActivityIndicator,
  },
  data(): UsersFlowVisualizationState {
    return {
      numSteps: 4,
      hasData: true,
      isLoading: false,
      maxSankeyChartDepth: 0,
      maxNodeLength: 0,
      isExploringTraffic: false,
      exploreStep: false,
      exploreUrl: false,
      flowSources: [],
      numActionsPerStep: this.actionsPerStep || 5,
      rawResponse: null,
      actualLevelOfDetail: this.levelOfDetail || 5,
      actualUserFlowSource: this.userFlowSource,
    };
  },
  watch: {
    numActionsPerStep(newValue) {
      if (newValue === null) {
        return;
      }

      this.fetchData();
      this.updateViewParams();
    },
    actualUserFlowSource(newValue) {
      if (newValue === null) {
        return;
      }

      this.fetchData();
      this.updateViewParams();
    },
  },
  created() {
    AjaxHelper.fetch<DataSource[]>({
      method: 'UsersFlow.getAvailableDataSources',
    }).then((dataSources) => {
      this.flowSources = dataSources.map((ds) => ({
        key: ds.value,
        value: ds.name,
      }));
    });

    this.fetchData();
  },
  beforeUnmount() {
    this.clearSankeyChart();
  },
  methods: {
    isUrlLike(name?: string) {
      if (!name) {
        return false;
      }

      if (this.actualUserFlowSource !== 'page_url') {
        return false;
      }

      return /^(.+)[.](.+)\/(.*)$/.test(name);
    },
    completeUrl(name: string) {
      if (name.indexOf('http') === 0) {
        return name;
      }

      // piwik stores urls without eg http://www.
      return `${window.location.protocol}//${name}`;
    },
    showGroupDetails(
      rowLabel: string,
      depth: string|number,
      onlyOthers: boolean,
      idSubtable?: string|number,
    ) {
      const url = MatomoUrl.stringify({
        showtitle: 1,
        widget: 1,
        module: 'UsersFlow',
        action: 'getInteractionActions',
        interactionPosition: depth,
        offsetActionsPerStep: onlyOthers ? this.numActionsPerStep : undefined,
        rowLabel: rowLabel || undefined,
        idSubtable: idSubtable || undefined,
        dataSource: this.actualUserFlowSource || undefined,
      });

      window.Piwik_Popover.createPopupAndLoadUrl(url, translate('UsersFlow_Interactions'));
    },
    setSankeyStep(setStep: number) {
      if (setStep > this.maxSankeyChartDepth) {
        this.numSteps = 1;
      } else if (setStep < 1) {
        this.numSteps = 1;
      } else {
        this.numSteps = setStep;
      }

      this.clearSankeyChart();
      const nodesAndLinks = this.buildNodesAndIndexes(this.rawResponse || []);
      this.drawSankeyChart(nodesAndLinks);
    },
    addSankeyStep() {
      this.setSankeyStep(this.numSteps + 1);
    },
    clearSankeyChart() {
      const node = this.$refs.sankeyChart as HTMLElement;

      if (node) {
        const svg = d3.select(node).selectAll('svg');
        if (svg) {
          d3.select(node).selectAll('svg').remove();
        }
      }
    },
    makeToolTip(message: string) {
      return `<span class="userFlowNodeTooltip">${message}</span>`;
    },
    setMaxSankeyChartDepth(maxDepth: string) {
      this.maxSankeyChartDepth = parseInt(maxDepth, 10);
    },
    setMaxNodeLength(maxLength: string) {
      this.maxNodeLength = parseInt(maxLength, 10);
    },
    getPercentage(val1: number, val2: number) {
      const percentage = Math.round(((val1 / val2) * 100) * 100) / 100;
      return `${percentage}%`;
    },
    drawSankeyChart(
      { nodes, links, depthNodes }: {
        nodes: SanKeyNode[],
        links: NodeLink[],
        depthNodes: DepthNode[],
      },
    ) {
      const self = this;
      let popupExitHandlerSetup = false;
      // the node whose path is pinned via the popup menu, or null while nothing
      // is pinned. Hover only highlights while nothing is pinned, so a pinned
      // trace survives the mouse moving away.
      let pinnedNodeId: number|null = null;
      // the chart's root <g>; captured once the svg is built so the highlight
      // helpers (defined above it) can toggle the fade-others class on it
      let chartRoot: any = null;

      function highlightLink(id: string|number, doHighlight: boolean) {
        if (!chartRoot) {
          return;
        }
        chartRoot.select(`#link-${id}`).classed('highlightedLink', doHighlight);
      }

      function highlightNode(id: string|number, doHighlight: boolean) {
        if (!chartRoot) {
          return;
        }
        chartRoot.select(`#node-${id}`).classed('highlightedNode', doHighlight);
      }

      function clearHighlight() {
        if (!chartRoot) {
          return;
        }
        chartRoot.selectAll('.link.highlightedLink').classed('highlightedLink', false);
        chartRoot.selectAll('.node.highlightedNode').classed('highlightedNode', false);
        // stop fading the rest of the chart
        chartRoot.classed('usersFlowHasHighlight', false);
      }

      // light up the whole path through `node`: the node itself, every page node
      // reachable up- and down-stream, and the links between them.
      function highlightNodeTraffic(node: any) {
        let remainingNodes: any[] = [];

        // fade everything that is not on this path
        if (chartRoot) {
          chartRoot.classed('usersFlowHasHighlight', true);
        }
        highlightNode(node.node, true);
        const traverse = [
          {
            linkType: 'sourceLinks',
            nodeType: 'target',
          },
          {
            linkType: 'targetLinks',
            nodeType: 'source',
          },
        ];

        const traverseNode = (nodeLink: any, step: any, nodeList: any[]) => {
          if (isOutNode(nodeLink.target.name)) {
            return;
          }

          const nextNode = nodeLink[step.nodeType];
          nodeList.push(nextNode);
          highlightLink(nodeLink.id, true);
          highlightNode(nextNode.node, true);
        };

        traverse.forEach((step) => {
          node[step.linkType].forEach(
            (nodeLink: any) => traverseNode(nodeLink, step, remainingNodes),
          );

          while (remainingNodes.length) {
            const nextNodes: any[] = [];
            remainingNodes.forEach((theNode) => {
              theNode[step.linkType].forEach(
                (nodeLink: any) => traverseNode(nodeLink, step, nextNodes),
              );
            });
            remainingNodes = nextNodes;
          }
        });
      }

      // popup "Highlight traffic" action: pin this node's path (or clear it if
      // it is already the pinned one).
      function togglePinnedHighlight(node: any) {
        clearHighlight();
        if (pinnedNodeId === node.node) {
          pinnedNodeId = null;
        } else {
          pinnedNodeId = node.node;
          highlightNodeTraffic(node);
        }
      }

      function showNodeDetails(this: any, theNode: any) {
        // TODO: check this and other instances are actually numbers
        const depth = theNode.depth + 1;

        if (isSummaryNode(theNode.name)) {
          self.showGroupDetails(theNode.name, depth, true);
          return;
        }

        if (theNode.idSubtable) {
          self.showGroupDetails(theNode.name, depth, false, theNode.idSubtable);
        }
      }

      function showPopup(this: any, theNode: SanKeyNode) {
        const event = (d3 as any).event as MouseEvent;
        event.preventDefault();
        event.stopPropagation();

        const isHighlighted = pinnedNodeId === theNode.node;

        if (!popupExitHandlerSetup) {
          if (!$('body > .usersFlowPopupMenu').length) {
            $('.usersFlowPopupMenu').appendTo('body');
          }

          popupExitHandlerSetup = true;
          d3.select('body').on('click', () => {
            const popupMenu = d3.select('body > .usersFlowPopupMenu');
            popupMenu.style('display', 'none');
            popupMenu.html('');
          });
        }

        let trafficTitle = 'UsersFlow_ActionHighlightTraffic';
        if (isHighlighted) {
          trafficTitle = 'UsersFlow_ActionClearHighlight';
        }

        const popupMenu = d3.select('body > .usersFlowPopupMenu');
        popupMenu.html('');

        const list = popupMenu.append('ul');
        list.append('li').attr('class', 'highlightTraffic').on('click', () => {
          togglePinnedHighlight(theNode);
        }).text(translate(trafficTitle));

        if (self.canEnableExploreTraffic && !isSummaryNode(theNode.name)) {
          list.append('li').attr('class', 'divider').html('<hr />');
          list.append('li').attr('class', 'exploreTraffic').on('click', () => {
            self.exploreStep = theNode.depth + 1;
            self.exploreUrl = theNode.name;
            self.numSteps = self.exploreStep + 2;
            self.fetchData();
          }).text(translate('UsersFlow_ExploreTraffic'));
        }

        if (self.isExploringTraffic) {
          list.append('li').attr('class', 'divider').html('<hr />');
          list.append('li').attr('class', 'unexploreTraffic').on('click', () => {
            self.exploreStep = false;
            self.exploreUrl = false;
            self.fetchData();
          }).text(translate('UsersFlow_UnexploreTraffic'));
        } else if (theNode.idSubtable || isSummaryNode(theNode.name)) {
          list.append('li').attr('class', 'divider').html('<hr />');
          list.append('li').attr('class', 'showNodeDetails').on('click', () => {
            showNodeDetails.apply(this, [theNode]);
          }).text(translate('UsersFlow_ActionShowDetails'));
        }

        if (self.isUrlLike(theNode.name) && !isSummaryNode(theNode.name)) {
          list.append('li').attr('class', 'divider').html('<hr />');
          list.append('li')
            .attr('class', 'openPageUrl')
            .append('a')
            .attr('href', self.completeUrl(theNode.name))
            .attr('rel', 'noreferrer')
            .attr('target', '_blank')
            .text(translate('Installation_SystemCheckOpenURL'));
        }

        popupMenu.style('left', `${event.pageX - 2}px`)
          .style('top', `${event.pageY - 2}px`)
          .style('display', 'block');
      }

      const NODE_WIDTH = 200;
      const NODE_PADDING = 52;
      const DEPTH_WIDTH = 350;

      const margin = {
        top: 96,
        right: 20,
        bottom: 20,
        left: 5,
      };

      const width = 550 + (this.numSteps - 2) * DEPTH_WIDTH + 150;
      const sankeyWidth = width - 150; // for next button

      const height = this.maxNodeLength * 100 + margin.top;
      const sankeyNode = this.$refs.sankeyChart as HTMLElement;
      $(sankeyNode)
        .css('width', width + margin.left + margin.right)
        .css('height', height + margin.top + margin.bottom + 5);

      const formatNumber = d3.format(',.0f');
      const format = (d: any) => formatNumber(d);

      const svg = d3.select(sankeyNode).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      chartRoot = svg;

      const sankey = (d3 as any).sankey() // using custom sankey so no typings
        .nodeWidth(NODE_WIDTH)
        .nodePadding(NODE_PADDING)
        .size([sankeyWidth, height]);

      const path = sankey.link();

      if (nodes && links && depthNodes) {
        const depthInfo = svg.append('g').selectAll('.depthInfo')
          .data(depthNodes)
          .enter()
          .append('g')
          .attr('class', (node) => `depthInfo depth${node.depth + 1}`);
        depthInfo.append('rect')
          .attr('height', 50)
          .attr('width', NODE_WIDTH)
          .attr('x', (d) => d.depth * DEPTH_WIDTH)
          .attr('y', -102)
          .style('fill', 'none');

        const depthText = depthInfo.append('text').attr('y', -82);

        if (this.numSteps > 1) {
          const closebuttonSvg = depthInfo.append('svg')
            .attr('viewBox', '0 0 24 24')
            .attr('width', '15')
            .attr('height', '15')
            .attr('y', '-90')
            .attr('x', (d) => d.depth * DEPTH_WIDTH + NODE_WIDTH + 12 /* clear of visit count */)
            .attr('class', 'removeStep')
            .on('click', (d) => {
              this.setSankeyStep(d.depth);
            })
            .style('visibility', (d) => {
              if (d.depth > 1) {
                return 'visible';
              }

              return 'hidden';
            })
            .attr('dy', 1);

          closebuttonSvg.append('path')
            .attr(
              'd',
              'M18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L6.70711 '
              + '18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 '
              + '4.90237 17.6834 5.29289 17.2929L17.2929 5.29289C17.6834 4.90237 18.3166 '
              + '4.90237 18.7071 5.29289Z M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 '
              + '6.70711 5.29289L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 '
              + '18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L5.29289 '
              + '6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z',
            )
            .append('title')
            .text(translate('UsersFlow_ActionRemoveStep'));
          closebuttonSvg.append('rect')
            .attr('fill', 'transparent')
            .attr('width', '24')
            .attr('height', '24')
            .attr('x', 0)
            .append('title')
            .text(translate('UsersFlow_ActionRemoveStep'));
        }

        depthText.append('svg:tspan')
          .attr('x', (d) => d.depth * DEPTH_WIDTH)
          .attr('dy', 5)
          .attr('fill', 'currentColor')
          .style('font-weight', 'bold')
          .attr('class', 'depthContainerTitle')
          .text((d) => `${translate('UsersFlow_ColumnInteraction')} ${d.depth + 1}`)
          .on('click', (d) => {
            const depth = parseInt(d.depth, 10) + 1;
            this.showGroupDetails('', depth, false);
          });

        // visit count on the title line, right-aligned to the end of the bar
        depthText.append('svg:tspan')
          .attr('x', (d) => d.depth * DEPTH_WIDTH + NODE_WIDTH)
          .attr('text-anchor', 'end')
          .attr('class', 'depthContainerVisits')
          .style('font-weight', 'normal')
          .style('font-size', '13px')
          .text((d) => (typeof d.totalIn === 'undefined'
            ? '' : format(d.totalIn)));

        // proceeded/exits bar: full-width track (exits) with the proceeded share overlaid
        const STEP_BAR_W = NODE_WIDTH;
        const STEP_BAR_H = 6;

        depthInfo.append('rect')
          .attr('class', 'stepBarExits')
          .attr('x', (d) => d.depth * DEPTH_WIDTH)
          .attr('y', -64)
          .attr('width', STEP_BAR_W)
          .attr('height', STEP_BAR_H)
          .attr('rx', 3);

        depthInfo.append('rect')
          .attr('class', 'stepBarProceeded')
          .attr('x', (d) => d.depth * DEPTH_WIDTH)
          .attr('y', -64)
          .attr('width', (d) => (d.totalIn && d.totalOut
            ? Math.max(4, STEP_BAR_W * (d.totalOut / d.totalIn)) : 0))
          .attr('height', STEP_BAR_H)
          .attr('rx', 3);

        depthInfo.append('text')
          .attr('class', 'stepMeta')
          .attr('x', (d) => d.depth * DEPTH_WIDTH)
          .attr('y', -40)
          .attr('fill', 'currentColor')
          .text((d) => {
            if (!d.totalIn) {
              return '';
            }

            const proceededPct = Math.round((d.totalOut / d.totalIn) * 100);
            const exitPct = 100 - proceededPct;
            const proceeded = translate('UsersFlow_NProceededInline', `${proceededPct}%`);
            const exits = translate('Transitions_ExitsInline', `${exitPct}%`);
            return `${proceeded} · ${exits}`;
          });

        sankey.nodes(nodes).links(links).layout(32);

        const tipLink = (d3tip as any)()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html((d: any) => {
            let bottom = format(d.value);
            if (d.source && d.source.totalIn) {
              bottom += ` (${this.getPercentage(d.value, d.source.totalIn)})`;
            }

            if (isOutNode(d.target.name)) {
              const message = translate('Transitions_ExitsInline', bottom);
              const name = Matomo.helper.htmlEntities(window.vueSanitize(d.source.name));
              return this.makeToolTip(`${name}: <span class='nodeTooltipExits'>${message}</span>`);
            }

            const from = `"${Matomo.helper.htmlEntities(Matomo.helper.escape(d.source.name))}"`;
            const to = `"${Matomo.helper.htmlEntities(Matomo.helper.escape(d.target.name))}"`;
            const message = translate('UsersFlow_InteractionXToY', from, to);
            return this.makeToolTip(`${message}<br />${bottom}`);
          });

        const link = svg.append('g')
          .selectAll('.link')
          .data(links)
          .enter()
          .append('path')
          .attr('class', (d) => {
            let className = 'link ';

            if (isOutNode((d.target as SanKeyNode).name)) {
              return `${className} outNodeLink`;
            }

            let percentage = 0;
            if ((d.source as SanKeyNode).totalOut! > 0) {
              percentage = (d.value / (d.source as SanKeyNode).totalOut!) * 100;
            }

            // we check how much it contributed in percentage
            // to the total outgoing
            if (percentage <= 8) {
              className += ' linkSize1';
            } else if (percentage <= 16) {
              className += ' linkSize2';
            } else if (percentage <= 24) {
              className += ' linkSize3';
            } else if (percentage <= 32) {
              className += ' linkSize4';
            } else if (percentage <= 42) {
              className += ' linkSize5';
            } else {
              className += ' linkSize6';
            }

            return className;
          })
          .attr('d', path)
          .attr('id', (d: any, i) => {
            d.id = i;
            return `link-${i}`;
          })
          .style('stroke-width', (d: any) => Math.max(1, d.dy))
          .sort((a: any, b: any) => b.dy - a.dy);

        if (link && !link.empty()) {
          link.call(tipLink)
            .on('mouseover', tipLink.show)
            .on('mouseout', tipLink.hide);
        }

        /** d3-tip set */
        const tip = (d3tip as any)()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html((d: any) => {
            if (isOutNode(d.name)) {
              return '';
            }

            const name = Matomo.helper.htmlEntities(Matomo.helper.escape(d.name));
            const visits = translate('General_ColumnNbVisits');
            const proceededValue = `<span class='nodeTooltipProceeded'>
${d.totalOut} (${this.getPercentage(d.totalOut, d.totalIn)})
</span>`;
            const exitsValue = `<span class='nodeTooltipExits'>
${d.totalExits} (${this.getPercentage(d.totalExits, d.totalIn)})
</span>`;

            return this.makeToolTip(`${name}<br/>
${visits}: <span class='nodeTooltipVisits'>${d.totalIn}</span><br/>
${translate('UsersFlow_ColumnProceeded')}: ${proceededValue}<br/>
${translate('General_ColumnExits')}: ${exitsValue}`);
          });

        const node = svg.append('g')
          .selectAll('.node')
          .data(nodes)
          .enter()
          .append('g')
          .attr('class', (d) => {
            let classNames = `node nodeDepth${d.depth + 1}`;

            if (isOutNode(d.name)) {
              classNames += ' outNode';
            }

            if (isSummaryNode(d.name)) {
              classNames += ' summaryNode';
            }

            return classNames;
          })
          .attr('id', (d: any) => (isOutNode(d.name) ? null : `node-${d.node}`))
          .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

        (node as any).on('click', showPopup);

        node.call(tip)
          .on('mouseover', function onNodeMouseover(this: any, d: any) {
            tip.show.call(this, d);
            // hover shows a transient trace; a pinned trace takes precedence
            if (pinnedNodeId === null && !isOutNode(d.name)) {
              highlightNodeTraffic(d);
            }
          })
          .on('mouseout', function onNodeMouseout(this: any, d: any) {
            tip.hide.call(this, d);
            if (pinnedNodeId === null) {
              clearHighlight();
            }
          });

        const NODE_RADIUS = 2;
        const EXIT_W = 7;
        const EXIT_MIN = 6;
        const nodeW = sankey.nodeWidth();

        node.filter((d: any) => !isOutNode(d.name) && d.totalExits > 0)
          .append('path')
          .attr('class', 'nodeExit')
          .attr('d', (d: any) => {
            const ratio = d.totalIn > 0 ? d.totalExits / d.totalIn : 0;
            const eh = Math.min(d.dy, Math.max(EXIT_MIN, ratio * d.dy));
            const xL = nodeW - NODE_RADIUS;
            const xR = nodeW + EXIT_W;
            const yB = d.dy;
            const yTop = yB - eh;
            const r = Math.min(NODE_RADIUS, eh / 2);
            return `M${xL},${yTop} H${xR - r} Q${xR},${yTop} ${xR},${yTop + r}`
              + ` V${yB - r} Q${xR},${yB} ${xR - r},${yB} H${xL} Z`;
          });

        node.append('rect')
          .attr('height', (d: any) => d.dy)
          .attr('width', sankey.nodeWidth())
          .attr('rx', (d: any) => Math.min(NODE_RADIUS, d.dy / 2))
          .attr('ry', (d: any) => Math.min(NODE_RADIUS, d.dy / 2));

        const ACCENT_W = 4;
        node.filter((d: any) => !isOutNode(d.name))
          .append('rect')
          .attr('class', 'nodeAccent')
          .attr('width', ACCENT_W)
          .attr('height', (d: any) => d.dy)
          .attr('rx', (d: any) => Math.min(NODE_RADIUS, d.dy / 2))
          .attr('ry', (d: any) => Math.min(NODE_RADIUS, d.dy / 2));

        const nodeText = node.append('text')
          .attr('y', -8)
          .attr('text-anchor', 'left')
          .attr('transform', 'rotate(0)')
          .attr('fill', 'currentColor');

        nodeText.append('tspan')
          .attr('x', 4)
          .attr('class', 'nodeLabel')
          .text((d) => {
            if (isOutNode(d.name)) {
              return '';
            }

            let { name } = d;

            if (isSummaryNode(name)) {
              if (d.pagesInGroup) {
                name += ` (>${translate('VisitorInterest_NPages', d.pagesInGroup)})`;
              }

              return name;
            }

            if (this.isUrlLike(name)) {
              // if name is like a url, eg erer.com/... then we remove the domain
              name = name.substr(name.indexOf('/'));
            }

            if (name.length > 31) {
              return `${name.substr(0, 14)}...${name.substr(-14)}`;
            }

            return name;
          });

        nodeText.append('tspan')
          .attr('class', 'nodeValue')
          .attr('dx', 6)
          .text((d) => (isOutNode(d.name) ? '' : format(d.totalIn)));

        if (this.numSteps < this.maxSankeyChartDepth) {
          const ADD_RADIUS = 26;
          const ADD_ARM = 10;
          const addCx = sankeyWidth + (width - sankeyWidth) / 2 + 20;
          const drawnNodes = nodes.filter((d: any) => !isOutNode(d.name));
          const lastDepth = (d3 as any).max(drawnNodes, (d: any) => d.depth);
          const lastColumn = drawnNodes.filter((d: any) => d.depth === lastDepth);
          const spanTop = (d3 as any).min(lastColumn, (d: any) => d.y);
          const spanBottom = (d3 as any).max(lastColumn, (d: any) => d.y + d.dy);
          const addCy = (spanTop + spanBottom) / 2;

          const btnNextStep = svg.append('g')
            .attr('class', 'addNewStepContainer')
            .on('click', () => {
              self.addSankeyStep();

              setTimeout(() => {
                const chartWidth = $('.sankeyChartOuter > div').width();
                if (chartWidth) {
                  $('.sankeyChartOuter').animate({
                    scrollLeft: chartWidth - 3,
                  });
                }
              }, 20);
            });

          btnNextStep.append('circle')
            .attr('class', 'addNewStepCircle')
            .attr('cx', addCx)
            .attr('cy', addCy)
            .attr('r', ADD_RADIUS);

          btnNextStep.append('path')
            .attr('class', 'addNewStep')
            .attr(
              'd',
              `M${addCx - ADD_ARM},${addCy} H${addCx + ADD_ARM} `
              + `M${addCx},${addCy - ADD_ARM} V${addCy + ADD_ARM}`,
            );

          btnNextStep.append('text')
            .attr('class', 'addNewStepLabel')
            .attr('x', addCx)
            .attr('y', addCy + ADD_RADIUS + 18)
            .attr('text-anchor', 'middle')
            .text(translate('UsersFlow_ActionAddStep'))
            .attr('fill', 'currentColor');

          btnNextStep.append('title')
            .text(translate('UsersFlow_ActionAddStep'));
        }
      }
    },
    buildNodesAndIndexes(response: ReportRow[]) {
      this.maxSankeyChartDepth = 0;
      this.maxNodeLength = 0;

      const links: NodeLink[] = [];
      const nodes: SanKeyNode[] = [];
      const depthNodes: DepthNode[] = [];

      let depth: number;
      response.forEach((row) => {
        depth = parseInt(row.label, 10);
        if (depth > this.maxSankeyChartDepth) {
          this.maxSankeyChartDepth = depth;
        }
      });

      if (this.numSteps > this.maxSankeyChartDepth) {
        // we need to reset numsteps automatically if api for some reason returns less steps
        // eg when exploring traffic
        this.numSteps = this.maxSankeyChartDepth;
      }

      let nodeIndex = 0;
      response.forEach((depthRow) => {
        depth = parseInt(depthRow.label, 10);

        if (!depthRow.subtable) {
          return;
        }

        if (depthRow.subtable.length + 1 > this.maxNodeLength) {
          this.maxNodeLength = depthRow.subtable.length + 1; // +1 for out node
        }

        if (depth > this.numSteps) {
          // we make sure to only show as many interactions as requested
          return;
        }

        const depthNode = {
          depth: depth - 1,
          in: 0,
          out: 0,
          totalIn: depthRow.nb_visits,
          totalOut: depthRow.nb_proceeded,
          totalExits: depthRow.nb_exits,
        };

        depthRow.subtable.forEach((sourceRow) => {
          const sourceLabel = sourceRow.label;

          if (!isSummaryNode(sourceLabel)) {
            // here we want to count the values only for the nodes shown
            depthNode.in += sourceRow.nb_visits;
            depthNode.out += sourceRow.nb_proceeded;
          }

          nodes.push({
            depth: depth - 1,
            name: sourceLabel,
            node: nodeIndex,
            totalIn: sourceRow.nb_visits,
            totalOut: sourceRow.nb_proceeded,
            totalExits: sourceRow.nb_exits,
            pagesInGroup: sourceRow.nb_pages_in_group ? sourceRow.nb_pages_in_group : 0,
            isSummaryNode: isSummaryNode(sourceLabel),
            idSubtable: sourceRow.idsubdatatable ? sourceRow.idsubdatatable : null,
          });
          // nb_pages_in_group is available for summary rows only so far

          nodeIndex += 1;

          if (depth >= this.numSteps) {
            // we do not add links for the last interaction position
            return;
          }

          if (!sourceRow.subtable) {
            // no subtable, no links
            return;
          }

          (sourceRow.subtable || []).forEach((targetRow) => {
            links.push({
              depth,
              source: nodeIndex - 1,
              // -1 cause we already did nodeIndex++ before
              target: targetRow.label,
              value: targetRow.nb_visits,
            });
          });

          if (sourceRow.nb_exits) {
            // we are also adding a link to the out node of the next step if there were exits
            links.push({
              depth,
              source: nodeIndex - 1,
              // -1 cause we already did nodeIndex++ before
              target: OUT_NODE_NAME,
              value: sourceRow.nb_exits,
            });
          }
        });

        depthNodes.push(depthNode);

        if (depth > 1) {
          nodes.push({
            depth: depth - 1,
            name: OUT_NODE_NAME,
            node: nodeIndex,
            value: 0,
            totalIn: 0,
          });

          nodeIndex += 1;
        }
      });

      // now we need to replace the target labels with proper target node ids
      links.forEach((link) => {
        nodes.some((element) => {
          if (link.target === element.name && link.depth === element.depth) {
            link.target = element.node;
            return true;
          }
          return false;
        });
      });

      return {
        nodes,
        links,
        depthNodes,
      };
    },
    fetchData() {
      this.clearSankeyChart();

      this.isExploringTraffic = !!(this.exploreStep && this.exploreUrl);

      this.isLoading = true;
      this.rawResponse = [];

      AjaxHelper.fetch({
        method: 'UsersFlow.getUsersFlow',
        expanded: '1',
        filter_limit: '-1',
        dataSource: this.actualUserFlowSource,
        limitActionsPerStep: this.numActionsPerStep,
        exploreStep: this.isExploringTraffic ? this.exploreStep : undefined,
        exploreUrl: this.isExploringTraffic ? this.exploreUrl : undefined,
      }).then((response) => {
        this.isLoading = false;
        this.rawResponse = response;
        this.clearSankeyChart();

        this.hasData = Array.isArray(response)
          && response.some((row) => Number(row.nb_visits) > 0);

        if (this.hasData) {
          const nodesAndLinks = this.buildNodesAndIndexes(this.rawResponse!);
          this.drawSankeyChart(nodesAndLinks);
        }
      });
    },
    updateViewParams() {
      if (this.isUserIsAnonymous) {
        return;
      }
      const parameters = {
        numActionsPerStep: this.numActionsPerStep,
        levelOfDetail: this.actualLevelOfDetail,
        userFlowSource: this.actualUserFlowSource,
      };

      AjaxHelper.post(
        {
          module: 'CoreHome',
          action: 'saveViewDataTableParameters',
          report_id: 'UsersFlow.getUsersFlow',
          segment: '',
        },
        {
          parameters: JSON.stringify(parameters),
        },
        {
          withTokenInUrl: true,
          format: 'html',
        },
      ).catch(() => {
        // ignore
      });
    },
  },
  computed: {
    canEnableExploreTraffic() {
      return Matomo.period !== 'year';
    },
    actionsPerStepOptions() {
      const result = [
        {
          key: 4,
          value: 4,
        },
        {
          key: 5,
          value: 5,
        },
      ];

      for (let i = 6; i <= 20; i += 2) {
        result.push({
          key: i,
          value: i,
        });
      }

      return result;
    },
    levelOfDetailOptions() {
      return [
        {
          key: 1,
          value: translate('UsersFlow_OptionLevelOfDetail1'),
        },
        {
          key: 2,
          value: translate('UsersFlow_OptionLevelOfDetail2'),
        },
        {
          key: 3,
          value: translate('UsersFlow_OptionLevelOfDetail3'),
        },
        {
          key: 4,
          value: translate('UsersFlow_OptionLevelOfDetail4'),
        },
        {
          key: 5,
          value: translate('UsersFlow_OptionLevelOfDetail5'),
        },
        {
          key: 6,
          value: translate('UsersFlow_OptionLevelOfDetail6'),
        },
      ];
    },
  },
});
</script>
