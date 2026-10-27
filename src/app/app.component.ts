import { Component } from '@angular/core';

import { TreeGraphComponent } from './tree-graph/tree-graph.component';
import {
  NodeStatus,
  NodeStatusMap,
  TreeGraphNode,
} from './tree-graph/tree-graph.models';

const STATUS_META: NodeStatusMap = {
  online: { label: 'Online', color: '#2f7d4a' },
  offline: { label: 'Offline', color: '#c83b31' },
  'power-outage': { label: 'Power outage', color: '#e5b83f' },
  impaired: { label: 'Impaired', color: '#df7a37' },
  unknown: { label: 'Unknown', color: '#b8bdc3' },
};

const TOPOLOGY: TreeGraphNode = {
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
                {
                  id: 'ont-river',
                  name: 'River House',
                  detail: 'ONT 84:2A',
                  status: 'online',
                },
                {
                  id: 'ont-maple',
                  name: 'Maple Studio',
                  detail: 'ONT C1:70',
                  status: 'online',
                },
                {
                  id: 'ont-orchid',
                  name: 'Orchid Market',
                  detail: 'ONT B5:1E',
                  status: 'impaired',
                },
                {
                  id: 'ont-beacon',
                  name: 'Beacon Labs',
                  detail: 'ONT 09:AF',
                  status: 'online',
                },
              ],
            },
            {
              id: 'nap-pine',
              name: 'Pine NAP',
              detail: 'Distribution point · East',
              status: 'online',
              children: [
                {
                  id: 'ont-lantern',
                  name: 'Lantern Cafe',
                  detail: 'ONT 31:DD',
                  status: 'online',
                },
                {
                  id: 'ont-juniper',
                  name: 'Juniper Office',
                  detail: 'ONT 7E:19',
                  status: 'online',
                },
                {
                  id: 'ont-summit',
                  name: 'Summit Dental',
                  detail: 'ONT A4:62',
                  status: 'offline',
                },
              ],
            },
            {
              id: 'nap-birch',
              name: 'Birch NAP',
              detail: 'Distribution point · South',
              status: 'impaired',
              children: [
                {
                  id: 'ont-canvas',
                  name: 'Canvas Works',
                  detail: 'ONT 5F:80',
                  status: 'online',
                },
                {
                  id: 'ont-cedar',
                  name: 'Cedar Court',
                  detail: 'ONT D9:14',
                  status: 'impaired',
                },
                {
                  id: 'ont-tidal',
                  name: 'Tidal Books',
                  detail: 'ONT E2:39',
                  status: 'online',
                },
              ],
            },
            {
              id: 'nap-glass',
              name: 'Glass NAP',
              detail: 'Distribution point · West',
              status: 'unknown',
              children: [
                {
                  id: 'ont-meadow',
                  name: 'Meadow Clinic',
                  detail: 'ONT 12:AB',
                  status: 'unknown',
                },
              ],
            },
            {
              id: 'nap-unassigned',
              name: 'Unassigned',
              detail: 'Pending field assignment',
              status: 'unknown',
              children: [
                {
                  id: 'ont-horizon',
                  name: 'Horizon Gym',
                  detail: 'ONT 61:CE',
                  status: 'online',
                },
                {
                  id: 'ont-kestrel',
                  name: 'Kestrel Bakery',
                  detail: 'ONT 0B:47',
                  status: 'online',
                },
                {
                  id: 'ont-oak',
                  name: 'Oak Pharmacy',
                  detail: 'ONT 98:F3',
                  status: 'power-outage',
                },
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
  imports: [TreeGraphComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly topology = TOPOLOGY;
  readonly statusMeta = STATUS_META;
  readonly legend = Object.entries(STATUS_META).map(([status, meta]) => ({
    status: status as NodeStatus,
    ...meta,
  }));

  activeNode: TreeGraphNode =
    this.findNode(TOPOLOGY, 'ont-juniper') ?? TOPOLOGY;

  onNodeSelect(selected: TreeGraphNode): void {
    this.activeNode = selected;
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
