import { useState, useEffect } from 'react';
import { getInventoryOverview } from '@app/services/api';

interface ProviderDetail {
  account_count: number;
  cluster_count: number;
}

interface InventoryData {
  clusters: {
    running: number;
    stopped: number;
    unknown: number;
    archived: number;
  };
  instances: {
    count: number;
  };
  providers: {
    aws: ProviderDetail;
    gcp: ProviderDetail;
    azure: ProviderDetail;
  };
}

export const useDashboardData = () => {
  const [inventoryData, setInventoryData] = useState<InventoryData | undefined>();

  useEffect(() => {
    const inventoryOverview = async () => {
      try {
        const data = await getInventoryOverview();
        setInventoryData(data);
      } catch {
        console.error('Failed to fetch inventory data.');
      }
    };
    inventoryOverview();
  }, []);

  return { inventoryData };
};
