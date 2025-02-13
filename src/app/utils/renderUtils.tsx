import { ClusterStates } from '@app/types/types';
import { Label } from '@patternfly/react-core';
import { InfoCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon, UnknownIcon } from '@patternfly/react-icons';

export function renderStatusLabel(labelText: string | null | undefined) {
  switch (labelText) {
    case ClusterStates.Running:
      return <Label color="green">{labelText}</Label>;
    case ClusterStates.Stopped:
      return <Label color="red">{labelText}</Label>;
    case ClusterStates.Terminated:
      return <Label color="purple">{labelText}</Label>;
    case ClusterStates.Unknown:
      return <Label color="gold">{labelText}</Label>;
    default:
      return <Label color="grey">{labelText}</Label>;
  }
}

export enum ResultStatus {
  Success = 'success',
  Failed = 'failed',
  Warning = 'warning',
}

export const getResultIcon = (result: string) => {
  const normalizedResult = result.toLowerCase();

  return (
    {
      [ResultStatus.Success]: <InfoCircleIcon color="var(--pf-v5-global--success-color--100)" title="Info" />,
      [ResultStatus.Failed]: <ExclamationTriangleIcon color="var(--pf-v5-global--danger-color--100)" title="Error" />,
      [ResultStatus.Warning]: <ExclamationCircleIcon color="var(--pf-v5-global--warning-color--100)" title="Warning" />,
    }[normalizedResult] || <UnknownIcon color="gray" title="Unknown" />
  );
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
