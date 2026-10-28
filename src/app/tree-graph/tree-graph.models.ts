export type NodeStatus =
  | 'online'
  | 'offline'
  | 'power-outage'
  | 'impaired'
  | 'unknown';

export interface TreeGraphNode {
  id: string;
  name: string;
  detail: string;
  status: NodeStatus;
  children?: TreeGraphNode[];
}

export interface NodeStatusMeta {
  label: string;
  color: string;
}

export type NodeStatusMap = Record<NodeStatus, NodeStatusMeta>;
