import { ClusterStates } from '@app/types/types';
import { Dropdown, DropdownItem, DropdownList, MenuToggle, MenuToggleElement } from '@patternfly/react-core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ModalPowerManagement } from './ModalPowerManagement';

export enum PowerAction {
  POWER_ON = 'Power on',
  POWER_OFF = 'Power off',
}

interface ClusterDetailsDropdownProps {
  clusterStatus: ClusterStates | null;
}

export const ClusterDetailsDropdown: React.FunctionComponent<ClusterDetailsDropdownProps> = ({ clusterStatus }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  useParams();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalAction, setModalAction] = React.useState<PowerAction | null>(null);

  // Disable actions based on cluster status
  const isPowerOnDisabled =
    clusterStatus === null || [ClusterStates.Running, ClusterStates.Terminated].includes(clusterStatus);

  const isPowerOffDisabled =
    clusterStatus === null || [ClusterStates.Stopped, ClusterStates.Terminated].includes(clusterStatus);

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    if (value === PowerAction.POWER_ON || value === PowerAction.POWER_OFF) {
      setModalAction(value as PowerAction);
      setIsModalOpen(true);
      setIsOpen(false);
    }
  };

  const resetModalState = () => {
    setIsModalOpen(false);
    setModalAction(null);
  };

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        onSelect={onSelect}
        onOpenChange={setIsOpen}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle ref={toggleRef} onClick={() => setIsOpen(!isOpen)} isExpanded={isOpen}>
            Actions
          </MenuToggle>
        )}
      >
        <DropdownList>
          <DropdownItem value={PowerAction.POWER_ON} key="power on" isDisabled={isPowerOnDisabled}>
            {PowerAction.POWER_ON}
          </DropdownItem>
          <DropdownItem value={PowerAction.POWER_OFF} key="power off" isDisabled={isPowerOffDisabled}>
            {PowerAction.POWER_OFF}
          </DropdownItem>
        </DropdownList>
      </Dropdown>

      <ModalPowerManagement isOpen={isModalOpen} onClose={resetModalState} action={modalAction} />
    </>
  );
};
