import React from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { Event } from '@app/types/events';

interface ActivityTableProps {
  events: Event[];
}

export const ActivityTable: React.FunctionComponent<ActivityTableProps> = ({ events }) => {
  if (events.length === 0) {
    return <div>No recent events</div>;
  }

  return (
    <Table aria-label="Recent events table" variant="compact">
      <Thead>
        <Tr>
          <Th>Time</Th>
          <Th>Action</Th>
          <Th>Result</Th>
          <Th>Resource</Th>
          <Th>Triggered By</Th>
        </Tr>
      </Thead>
      <Tbody>
        {events.map(event => (
          <Tr key={event.id}>
            <Td>{new Date(event.timestamp).toLocaleString()}</Td>
            <Td>{event.action}</Td>
            <Td>{event.result}</Td>
            <Td>
              {event.resourceType} {event.resourceId}
            </Td>
            <Td>{event.triggeredBy}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
