import { Nav, NavList, NavItem, NavExpandable } from '@patternfly/react-core';
import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const SidebarNavigation: React.FunctionComponent = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isArchived = searchParams.get('archived') === 'true';

  // Set initial states based on current path
  const getInitialStates = () => {
    const pathname = location.pathname;

    if (pathname === '/') {
      return { group: '', item: 'overview' };
    }
    if (pathname === '/accounts') {
      return { group: '', item: 'accounts' };
    }
    if (pathname === '/clusters') {
      return {
        group: 'clusters-group',
        item: isArchived ? 'clusters-history' : 'clusters-active',
      };
    }
    if (pathname === '/servers') {
      return {
        group: 'servers-group',
        item: isArchived ? 'servers-history' : 'servers-active',
      };
    }
    return { group: '', item: '' };
  };

  const [activeGroup, setActiveGroup] = React.useState(getInitialStates().group);
  const [activeItem, setActiveItem] = React.useState(getInitialStates().item);

  // Update active items when location or archived state changes
  React.useEffect(() => {
    const { group, item } = getInitialStates();
    setActiveGroup(group);
    setActiveItem(item);
  }, [location.pathname, isArchived]);

  const onToggle = (
    _event: React.MouseEvent<HTMLButtonElement>,
    result: { groupId: number | string; isExpanded: boolean }
  ) => {
    setActiveGroup(result.isExpanded ? (result.groupId as string) : '');
  };

  return (
    <Nav onToggle={onToggle} aria-label="Nav">
      <NavList>
        <NavItem itemId="overview" isActive={activeItem === 'overview'}>
          <Link to="/">Overview</Link>
        </NavItem>
        <NavItem itemId="accounts" isActive={activeItem === 'accounts'}>
          <Link to="/accounts">Accounts</Link>
        </NavItem>
        <NavExpandable
          title="Clusters"
          groupId="clusters-group"
          isActive={activeGroup === 'clusters-group'}
          isExpanded={activeGroup === 'clusters-group'}
        >
          <NavItem groupId="clusters-group" itemId="clusters-active" isActive={activeItem === 'clusters-active'}>
            <Link to="/clusters">Active</Link>
          </NavItem>
          <NavItem groupId="clusters-group" itemId="clusters-history" isActive={activeItem === 'clusters-history'}>
            <Link to="/clusters?archived=true">History</Link>
          </NavItem>
        </NavExpandable>
        <NavExpandable
          title="Servers"
          groupId="servers-group"
          isActive={activeGroup === 'servers-group'}
          isExpanded={activeGroup === 'servers-group'}
        >
          <NavItem groupId="servers-group" itemId="servers-active" isActive={activeItem === 'servers-active'}>
            <Link to="/servers">Active</Link>
          </NavItem>
          <NavItem groupId="servers-group" itemId="servers-history" isActive={activeItem === 'servers-history'}>
            <Link to="/servers?archived=true">History</Link>
          </NavItem>
        </NavExpandable>
      </NavList>
    </Nav>
  );
};

export default SidebarNavigation;
