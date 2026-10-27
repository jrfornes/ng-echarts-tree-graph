import { Component } from '@angular/core';
import type { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

type NodeStatus = 'online' | 'offline' | 'power-outage' | 'impaired' | 'unknown';

interface TopologyNode {
  id: string;
  name: string;
  detail: string;
  status: NodeStatus;
  children?: TopologyNode[];
}

interface ChartClickEvent {
  data?: TopologyNode;
}

const STATUS_META: Record<NodeStatus, { label: string; color: string }> = {
  online: { label: 'Online', color: '#2f7d4a' },
  offline: { label: 'Offline', color: '#c83b31' },
  'power-outage': { label: 'Power outage', color: '#e5b83f' },
  impaired: { label: 'Impaired', color: '#df7a37' },
  unknown: { label: 'Unknown', color: '#b8bdc3' },
};

const TOPOLOGY: TopologyNode = {
  id: 'site-harbor',
  name: 'Harbor Exchange',
  detail: 'Metro aggregation site',
  status: 'online',
  children: [
    {
      id: 'shelf-atlas',
      name: 'Atlas Shelf',
      detail: 'Access shelf · Bay 01',
      status: 'online',
      children: [
        {
          id: 'card-a1',
          name: 'Card A1',
          detail: 'Uplink interface',
          status: 'online',
          children: [
            {
              id: 'nap-coral',
              name: 'Coral NAP',
              detail: 'Distribution point · North',
              status: 'online',
              children: [
                { id: 'ont-river', name: 'River House', detail: 'ONT 84:2A', status: 'online' },
                { id: 'ont-maple', name: 'Maple Studio', detail: 'ONT C1:70', status: 'online' },
                { id: 'ont-orchid', name: 'Orchid Market', detail: 'ONT B5:1E', status: 'impaired' },
                { id: 'ont-beacon', name: 'Beacon Labs', detail: 'ONT 09:AF', status: 'online' },
              ],
            },
            {
              id: 'nap-pine',
              name: 'Pine NAP',
              detail: 'Distribution point · East',
              status: 'online',
              children: [
                { id: 'ont-lantern', name: 'Lantern Cafe', detail: 'ONT 31:DD', status: 'online' },
                { id: 'ont-juniper', name: 'Juniper Office', detail: 'ONT 7E:19', status: 'online' },
                { id: 'ont-summit', name: 'Summit Dental', detail: 'ONT A4:62', status: 'offline' },
              ],
            },
            {
              id: 'nap-birch',
              name: 'Birch NAP',
              detail: 'Distribution point · South',
              status: 'impaired',
              children: [
                { id: 'ont-canvas', name: 'Canvas Works', detail: 'ONT 5F:80', status: 'online' },
                { id: 'ont-cedar', name: 'Cedar Court', detail: 'ONT D9:14', status: 'impaired' },
                { id: 'ont-tidal', name: 'Tidal Books', detail: 'ONT E2:39', status: 'online' },
              ],
            },
            {
              id: 'nap-glass',
              name: 'Glass NAP',
              detail: 'Distribution point · West',
              status: 'unknown',
              children: [
                { id: 'ont-meadow', name: 'Meadow Clinic', detail: 'ONT 12:AB', status: 'unknown' },
              ],
            },
            {
              id: 'nap-unassigned',
              name: 'Unassigned',
              detail: 'Pending field assignment',
              status: 'unknown',
              children: [
                { id: 'ont-horizon', name: 'Horizon Gym', detail: 'ONT 61:CE', status: 'online' },
                { id: 'ont-kestrel', name: 'Kestrel Bakery', detail: 'ONT 0B:47', status: 'online' },
                { id: 'ont-oak', name: 'Oak Pharmacy', detail: 'ONT 98:F3', status: 'power-outage' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

@Component({
  selector: 'app-root',
  imports: [NgxEchartsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly statusMeta = STATUS_META;
  readonly legend = Object.entries(STATUS_META).map(([status, meta]) => ({
    status: status as NodeStatus,
    ...meta,
  }));

  activeNode: TopologyNode = this.findNode(TOPOLOGY, 'ont-juniper') ?? TOPOLOGY;
  chartOptions: EChartsOption = this.buildChartOptions();

  onChartClick(event: unknown): void {
    const click = event as ChartClickEvent;
    if (!click.data?.id) {
      return;
    }

    const selected = this.findNode(TOPOLOGY, click.data.id);
    if (!selected) {
      return;
    }

    this.activeNode = selected;
    this.chartOptions = this.buildChartOptions();
  }

  private buildChartOptions(): EChartsOption {
    return {
      animationDuration: 420,
      animationDurationUpdate: 520,
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: '#101c2c',
        borderWidth: 0,
        padding: [10, 12],
        textStyle: { color: '#ffffff', fontSize: 12 },
        formatter: (params: unknown) => {
          const node = (params as { data: TopologyNode }).data;
          const status = STATUS_META[node.status];
          return `<strong>${node.name}</strong><br/>${node.detail}<br/><span style="color:${status.color}">●</span> ${status.label}`;
        },
      },
      series: [
        {
          type: 'tree',
          data: [this.toChartNode(TOPOLOGY)],
          top: 24,
          left: 30,
          bottom: 24,
          right: 184,
          orient: 'LR',
          symbol: 'circle',
          symbolSize: 17,
          roam: false,
          expandAndCollapse: true,
          initialTreeDepth: -1,
          lineStyle: {
            color: '#aab4c0',
            width: 1.4,
            curveness: 0.55,
          },
          label: {
            position: 'bottom',
            verticalAlign: 'top',
            align: 'center',
            distance: 6,
            color: '#536173',
            fontSize: 10,
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
              distance: 9,
              color: '#263548',
              fontSize: 11,
            },
          },
          emphasis: {
            focus: 'none',
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(38, 91, 140, 0.25)' },
            lineStyle: { width: 2 },
          },
        },
      ],
    };
  }

  private toChartNode(node: TopologyNode): object {
    const isActive = node.id === this.activeNode.id;
    const status = STATUS_META[node.status];

    return {
      ...node,
      itemStyle: {
        color: status.color,
        borderColor: isActive ? '#1677c8' : '#3e4c5b',
        borderWidth: isActive ? 4 : 1.3,
        shadowBlur: isActive ? 12 : 0,
        shadowColor: 'rgba(22, 119, 200, 0.35)',
      },
      label: {
        color: isActive ? '#1266a7' : undefined,
        fontWeight: isActive ? 700 : 400,
      },
      children: node.children?.map((child) => this.toChartNode(child)),
    };
  }

  private findNode(node: TopologyNode, id: string): TopologyNode | undefined {
    if (node.id === id) {
      return node;
    }

    for (const child of node.children ?? []) {
      const match = this.findNode(child, id);
      if (match) {
        return match;
      }
    }

    return undefined;
  }
}
