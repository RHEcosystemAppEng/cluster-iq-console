import { renderStatusLabel } from '@app/utils/renderStatusLabel';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import React from 'react';
import { Link } from 'react-router-dom';
import { ClustersTableProps } from './types';

const columnNames = {
  id: 'ID',
  name: 'Name',
  status: 'Status',
  cloudProvider: 'Cloud Provider',
  instanceCount: 'Instance Count',
};

export const ClustersTable: React.FunctionComponent<ClustersTableProps> = ({ clusters }) => {
  return (
    <Table aria-label="Simple table">
      <Thead>
        <Tr>
          <Th>{columnNames.id}</Th>
          <Th>{columnNames.name}</Th>
          <Th>{columnNames.status}</Th>
          <Th>{columnNames.cloudProvider}</Th>
          <Th>{columnNames.instanceCount}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {clusters.map((cluster) => (
          <Tr key={cluster.id}>
            <Td dataLabel={cluster.name}>
              <Link to={`/clusters/${cluster.id}`}>{cluster.id}</Link>
            </Td>
            <Td>{cluster.name}</Td>
            <Td dataLabel={cluster.status}>{renderStatusLabel(cluster.status)}</Td>
            <Td>{cluster.provider}</Td>
            <Td>{cluster.instanceCount}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
