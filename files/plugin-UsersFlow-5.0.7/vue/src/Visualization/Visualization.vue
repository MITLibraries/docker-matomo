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
    <div
      class="exploringTraffic alert alert-info "
      v-show="exploreStep && exploreUrl"
    >
      {{ translate('UsersFlow_ExploringInfo', exploreUrl, exploreStep) }}
    </div>
    <ActivityIndicator :loading="isLoading" />
    <div
      class="sankeyChartOuter"
      v-show="!isLoading"
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

      function highlightLink(id: string|number, doHighlight: boolean) {
        d3.select(`#link-${id}`).classed('highlightedLink', doHighlight);
      }

      function highlightNodeTraffic(this: any, node: any) {
        let remainingNodes: any[] = [];

        const $this = d3.select(this);

        let doHighlight: boolean;
        if ($this.attr('data-clicked') === '1') {
          $this.attr('data-clicked', '0');
          doHighlight = false;
        } else {
          d3.select(this).attr('data-clicked', '1');
          doHighlight = true;
        }

        $this.classed('highlightedNode', doHighlight);
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

          nodeList.push(nodeLink[step.nodeType]);
          highlightLink(nodeLink.id, doHighlight);
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

        const isHighlighted = d3.select(this).attr('data-clicked') === '1';

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
          highlightNodeTraffic.call(this, theNode);
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
      const NODE_PADDING = 40;
      const DEPTH_WIDTH = 350;

      const margin = {
        top: 70,
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

      const normalGradient = svg.append('svg:defs')
        .append('svg:linearGradient')
        .attr('id', 'normalGradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad');

      normalGradient.append('svg:stop')
        .attr('offset', '0%')
        .attr('stop-color', '#F2FFE9')
        .attr('stop-opacity', 1);

      normalGradient.append('svg:stop')
        .attr('offset', '100%')
        .attr('stop-color', '#84D04D')
        .attr('stop-opacity', 1);

      const pageOutGradient = svg.append('svg:defs')
        .append('svg:linearGradient')
        .attr('id', 'pageOutGradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad');

      pageOutGradient.append('svg:stop')
        .attr('offset', '0%')
        .attr('stop-color', '#FCE8E8')
        .attr('stop-opacity', 1);

      pageOutGradient.append('svg:stop')
        .attr('offset', '100%')
        .attr('stop-color', '#FA5858')
        .attr('stop-opacity', 1);

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
          .attr('y', -80)
          .style('fill', 'none');

        const depthText = depthInfo.append('text').attr('y', -60);

        if (this.numSteps > 1) {
          const closebuttonSvg = depthInfo.append('svg')
            .attr('viewBox', '-100 -100 1500 1500')
            .attr('width', '18')
            .attr('height', '18')
            .attr('y', '-68')
            .attr('x', (d) => d.depth * DEPTH_WIDTH + NODE_WIDTH - 10 /* plus padding */)
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
              'M874.048 810.048c-199.936 199.936-524.16 199.936-724.096 '
              + '0s-199.936-524.16 0-724.096c199.936-199.936 524.16-199.936 724.096 0s199.936 '
              + '524.16 0 724.096zM692.992 267.008c-33.344-33.344-87.36-33.344-120.64 0l-60.352 '
              + '60.288-60.352-60.352c-33.344-33.344-87.36-33.344-120.64 0-33.344 33.344-33.344 '
              + '87.36 0 120.704l60.352 60.352-60.352 60.352c-33.344 33.344-33.344 87.36 0 '
              + '120.704s87.36 33.344 120.64 0l60.352-60.352 60.352 60.352c33.344 33.344 87.36 '
              + '33.344 120.64 0 33.344-33.344 33.344-87.36 0-120.704l-60.288-60.352 60.352-'
              + '60.352c33.28-33.344 33.28-87.36-0.064-120.64z',
            ).attr('fill', '#999')
            .append('title')
            .text(translate('UsersFlow_ActionRemoveStep'));
          closebuttonSvg.append('rect')
            .attr('fill', 'transparent')
            .attr('width', '900')
            .attr('height', '900')
            .attr('x', 50)
            .append('title')
            .text(translate('UsersFlow_ActionRemoveStep'));
        }

        depthText.append('svg:tspan')
          .attr('x', (d) => d.depth * DEPTH_WIDTH)
          .attr('dy', 5)
          .attr('fill', 'black')
          .style('font-weight', 'bold')
          .attr('class', 'depthContainerTitle')
          .text((d) => `${translate('UsersFlow_ColumnInteraction')} ${d.depth + 1}`)
          .on('click', (d) => {
            const depth = parseInt(d.depth, 10) + 1;
            this.showGroupDetails('', depth, false);
          })
          .append('svg:tspan')
          .attr('x', (d) => d.depth * DEPTH_WIDTH)
          .attr('dy', 20)
          .style('font-weight', 'normal')
          .style('font-size', '13px')
          .text((d) => {
            if (typeof d.totalIn === 'undefined') {
              return null;
            }

            let message = `${translate('General_NVisits', d.totalIn)}, `;
            message += `${translate('UsersFlow_NProceededInline', d.totalOut)}, `;
            message += translate('Transitions_ExitsInline', d.totalExits);
            return message;
          })
          .attr('fill', 'black');

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
          .style('stroke', (d) => {
            if (isOutNode((d.target as SanKeyNode).name)) {
              return '#ec5540';
            }

            return '#A9E2F3';
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

            return classNames;
          })
          .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

        (node as any).on('click', showPopup);

        node.call(tip)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        node.append('rect')
          .attr('height', (d: any) => d.dy)
          .attr('width', sankey.nodeWidth())
          .style('fill', (d) => {
            if (isOutNode(d.name)) {
              return 'url(#pageOutGradient)';
            }

            return 'url(#normalGradient)';
          })
          .style('stroke', '#333');

        node.append('text')
          .attr('x', 4)
          .attr('y', -5)
          .attr('text-anchor', 'left')
          .attr('transform', 'rotate(0)')
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

            if (name.length > 33) {
              return `${name.substr(0, 15)}...${name.substr(-15)}`;
            }

            return name;
          })
          .attr('fill', 'black');

        node.append('text')
          .attr('x', 4)
          .attr('y', 18)
          .attr('transform', 'rotate(0)')
          .attr('text-anchor', 'left')
          .text((i) => format(i.totalIn))
          .attr('fill', 'black');

        if (this.numSteps < this.maxSankeyChartDepth) {
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

          btnNextStep.append('path')
            .attr(
              'd',
              'M512 960c-282.752 0-512-229.248-512-512s229.248-512 512-512 512 229.248 512 '
              + '512-229.248 512-512 512zM682.688 362.688h-85.376v-85.312c0-47.168-38.208-85.376-85'
              + '.312-85.376s-85.312 38.208-85.312 85.312v85.376h-85.376c-47.104 0-85.312 38.208-85'
              + '.312 85.312s38.208 85.312 85.312 85.312h85.312v85.376c0.064 47.104 38.272 85.312 '
              + '85.376 85.312s85.312-38.208 85.312-85.312v-85.312h85.312c47.168-0.064 85.376-38.'
              + '272 85.376-85.376s-38.208-85.312-85.312-85.312z',
            )
            .attr('dx', width - 50)
            .attr('dy', -30)
            .attr('transform', `translate(${width - 50},-66) scale(0.04)`)
            .attr('text-anchor', 'middle')
            .attr('class', 'addNewStep')
            .append('title')
            .text(translate('UsersFlow_ActionAddStep'));

          btnNextStep.append('rect')
            .attr('x', width - 50)
            .attr('y', '-69')
            .attr('width', '40')
            .attr('height', '40')
            .attr('fill', 'transparent')
            .style('cursor', 'pointer')
            .append('title')
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

        if (response?.length > 0) {
          const nodesAndLinks = this.buildNodesAndIndexes(this.rawResponse!);
          this.drawSankeyChart(nodesAndLinks);
        } else {
          this.hasData = false;
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
