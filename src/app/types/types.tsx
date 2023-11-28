export type ClusterData = {
  count: number;
  clusters: Cluster[];
};

export type Cluster = {
  name: string;
  provider: string;
  status: string;
  region: string;
  consoleLink: string;
  accountName: string;
  instances: Instance[];
};

export type AccountData = {
  count: number;
  accounts: Account[];
};

export type Account = {
  id: string;
  name: string;
  provider: string;
  clusterCount: number;
  clusters: Record<string, Cluster>;
};

export type TagData = {
  count: number;
  tags: Tag[];
}

export type Tag = {
  key: string;
  value: string;
}

export type ClusterPerCP = {
  count: number;
  accounts: Account[];
};

export type Instance = {
    id: string;
    name: string;
    availabilityZone: string;
    instanceType: string;
    state: string;
    provider: string;
    tags: Array<Tag>;
}

export type Instances = {
    count: number;
    instances: Instance[];
}
