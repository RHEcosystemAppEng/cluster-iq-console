import { Nav, NavList, NavItem, NavExpandable } from '@patternfly/react-core';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SidebarNavigation: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [activeGroup, setActiveGroup] = React.useState('');
  const [activeItem, setActiveItem] = React.useState('');

  const onSelect = (
    _event: React.FormEvent<HTMLInputElement>,
    result: { itemId: number | string; groupId: number | string; to: string }
  ) => {
    setActiveGroup(result.groupId as string);
    setActiveItem(result.itemId as string);
    if (result.to) {
      navigate(result.to);
    }
  };

  const onToggle = (
    _event: React.MouseEvent<HTMLButtonElement>,
    result: { groupId: number | string; isExpanded: boolean }
  ) => {
    setActiveGroup(result.isExpanded ? (result.groupId as string) : '');
  };

  return (
    <Nav onSelect={onSelect} onToggle={onToggle} aria-label="Nav">
      <NavList>
        <NavItem preventDefault itemId="overview" to="/" isActive={activeItem === 'overview'}>
          Overview
        </NavItem>
        <NavItem preventDefault itemId="accounts" to="/accounts" isActive={activeItem === 'accounts'}>
          Accounts
        </NavItem>
        <NavExpandable
          title="Clusters"
          groupId="clusters-group"
          isActive={activeGroup === 'clusters-group'}
          isExpanded={activeGroup === 'clusters-group'}
        >
          <NavItem
            preventDefault
            groupId="clusters-group"
            itemId="clusters-active"
            isActive={activeItem === 'clusters-active'}
            to="/clusters"
          >
            Active
          </NavItem>
          <NavItem
            preventDefault
            groupId="clusters-group"
            itemId="clusters-history"
            isActive={activeItem === 'clusters-history'}
            to="/clusters?archived=true"
          >
            History
          </NavItem>
        </NavExpandable>
        <NavExpandable
          title="Servers"
          groupId="servers-group"
          isActive={activeGroup === 'servers-group'}
          isExpanded={activeGroup === 'servers-group'}
        >
          <NavItem
            preventDefault
            groupId="servers-group"
            itemId="servers-active"
            isActive={activeItem === 'servers-active'}
            to="/servers"
          >
            Active
          </NavItem>
          <NavItem
            preventDefault
            groupId="servers-group"
            itemId="servers-history"
            isActive={activeItem === 'servers-history'}
            to="/servers?archived=true"
          >
            History
          </NavItem>
        </NavExpandable>
      </NavList>
    </Nav>
  );
};

export default SidebarNavigation;
