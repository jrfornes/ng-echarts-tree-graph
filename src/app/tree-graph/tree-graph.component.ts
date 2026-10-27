import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import type { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import {
  NodeStatusMap,
  TreeGraphNode,
} from './tree-graph.models';

interface ChartClickEvent {
  data?: TreeGraphNode;
}

@Component({
  selector: 'app-tree-graph',
  imports: [NgxEchartsModule],
  templateUrl: './tree-graph.component.html',
  styleUrl: './tree-graph.component.scss',
})
export class TreeGraphComponent implements OnChanges {
  @Input({ required: true }) root!: TreeGraphNode;
  @Input({ required: true }) statusMeta!: NodeStatusMap;
  @Input() activeNodeId?: string;

  @Output() readonly nodeSelect = new EventEmitter<TreeGraphNode>();

  chartOptions: EChartsOption = {};

  ngOnChanges(): void {
    if (this.root && this.statusMeta) {
      this.chartOptions = this.buildChartOptions();
    }
  }

  onChartClick(event: unknown): void {
    const click = event as ChartClickEvent;
    if (!click.data?.id) {
      return;
    }

    const selected = this.findNode(this.root, click.data.id);
    if (!selected || selected.children?.length) {
      return;
    }

    this.nodeSelect.emit(selected);
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
          const node = (params as { data: TreeGraphNode }).data;
          const status = this.statusMeta[node.status];
          return `<strong>${node.name}</strong><br/>${node.detail}<br/><span style="color:${status.color}">●</span> ${status.label}`;
        },
      },
      series: [
        {
          type: 'tree',
          data: [this.toChartNode(this.root)],
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
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(38, 91, 140, 0.25)',
            },
            lineStyle: { width: 2 },
          },
        },
      ],
    };
  }

  private toChartNode(node: TreeGraphNode): object {
    const isActive = node.id === this.activeNodeId;
    const status = this.statusMeta[node.status];

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

  private findNode(
    node: TreeGraphNode,
    id: string,
  ): TreeGraphNode | undefined {
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
