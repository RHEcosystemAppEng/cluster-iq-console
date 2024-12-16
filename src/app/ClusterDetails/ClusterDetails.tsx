import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { renderStatusLabel } from "src/app/utils/renderStatusLabel";
import { parseScanTimestamp, parseNumberToCurrency, } from 'src/app/utils/parseFuncs';
import {
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabContent,
  TabContentBody,
  TabTitleText,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  Flex,
  FlexItem,
  Page,
  Spinner,
  LabelGroup,
  Dropdown, DropdownItem, DropdownList, Divider, MenuToggle, MenuToggleElement,
  Button
} from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr, ThProps } from "@patternfly/react-table";
import { getCluster, getClusterInstances, getClusterTags } from "../services/api";
import { ClusterData, Instance, Tag, TagData } from "@app/types/types";
import { Link, useLocation  } from "react-router-dom";

interface LabelGroupOverflowProps {
  labels: Array<Tag>;
}
export const DropdownBasic: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {

    console.log('selected', value);
    setIsOpen(false);
  };

  return (
    <Dropdown
    isOpen={isOpen}
    onSelect={onSelect}
    onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
      <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen}>
        Actions
      </MenuToggle>
  )}
    ouiaId="BasicDropdown"
    shouldFocusToggleOnSelect
  >
  <DropdownList>
  <DropdownItem value={0} key="power on">
      Power on
    </DropdownItem>
    <DropdownItem
      value={1}
      key="power off"
      to="#default-link2"
      onClick={(ev: any) => ev.preventDefault()}
    >
      Power off
    </DropdownItem>
  </DropdownList>
    </Dropdown>
  );
};

// export const DropdownBasic: React.FunctionComponent = () => { 
//   return (
//   <Button> 
//     roni
//   </Button>)
// }

export const DividerUsingDiv: React.FunctionComponent = () => <Divider component="div" />;


const LabelGroupOverflow: React.FunctionComponent<LabelGroupOverflowProps> = ({
  labels,
}) => (
  <LabelGroup>
    {labels.map(label => (
      <Label key={label.key}>{label.key}: {label.value}</Label>
    ))}
  </LabelGroup>
);

const AggregateInstancesPerCluster: React.FunctionComponent = () => {
  const [data, setData] = useState<Instance[] | []>([]);
  const [loading, setLoading] = useState(true);
  const { clusterID } = useParams();
  const { accountName } = useParams();


  useEffect(() => {
    const fetchData = async () => {
      try {
          console.log("Fetching data...");
          const fetchedInstancesPerCluster = await getClusterInstances(accountName,clusterID);
          console.log("Fetched data:", fetchedInstancesPerCluster);
          setData(fetchedInstancesPerCluster);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("Rendered with data:", data);

  //### Sorting ###
  // Index of the currently active column
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | undefined>(0);
  // sort direction of the currently active column
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | undefined>('asc');
  // sort dropdown expansion
  const getSortableRowValues = (instance: Instance): (string | number | null)[] => {
    const { id, name, availabilityZone, instanceType, status, clusterID, provider } = instance;
    return [id, name, availabilityZone, instanceType, status, clusterID, provider];
  };

  // Sorting
  let sortedData = data;
  if (typeof activeSortIndex === 'number' && activeSortIndex !== null) {
    sortedData = data.sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex];
      const bValue = getSortableRowValues(b)[activeSortIndex];
      if (typeof aValue === 'number') {
        // Numeric sort
        if (activeSortDirection === 'asc') {
          return (aValue as number) - (bValue as number);
        }
        return (bValue as number) - (aValue as number);
      } else {
        // String sort
        if (activeSortDirection === 'asc') {
          return (aValue as string).localeCompare(bValue as string);
        }
        return (bValue as string).localeCompare(aValue as string);
      }
    });
  }

  // set table column properties
  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc' // starting sort direction when first sorting a column. Defaults to 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });
  //### --- ###

  return (
    <React.Fragment>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner size="xl" />
        </div>
      ) : (
        <Table aria-label="Simple table">
          <Thead>
            <Tr>
              <Th sort={getSortParams(0)}>ID</Th>
              <Th sort={getSortParams(1)}>Name</Th>
              <Th sort={getSortParams(3)}>Type</Th>
              <Th sort={getSortParams(4)}>Status</Th>
              <Th sort={getSortParams(2)}>AvailabilityZone</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedData.map((instance) => (
              <Tr key={instance.id}>
                <Td dataLabel={instance.id}>
                  <Link
                    to={`/servers/${instance.id}`}
                  >
                    {instance.id}
                  </Link>
                </Td>
                <Td>{instance.name}</Td>
                <Td>{instance.instanceType}</Td>
                <Td dataLabel={instance.status}>
                  {renderStatusLabel(instance.status)}
                </Td>
                <Td>{instance.availabilityZone}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </React.Fragment>
  );
};

const ClusterDetails: React.FunctionComponent = () => {
  
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggleClick = () => {
    setIsOpen(prevState => !prevState);
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    // eslint-disable-next-line no-console
    console.log('selected', value);
    setIsOpen(false);
  };
  const { clusterID } = useParams();
  const [activeTabKey, setActiveTabKey] = React.useState(0);
  const [tags, setTagData] = useState<TagData>({
    count: 0,
    tags: []
  });
  const [cluster, setClusterData] = useState<ClusterData>({
    count: 0,
    clusters: []
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  useEffect(() => {
    const fetchData = async () => {
      try {
          const fetchedCluster = await getCluster(clusterID);
          setClusterData(fetchedCluster);
          const fetchedTags = await getClusterTags(clusterID);
          setTagData(fetchedTags);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterTagsByKey = (key) => {
    const result = tags.tags.filter(tags => tags.key == key)
    if(result[0] !== undefined && result[0] != null){
      return result[0].value
    }
    return "unknown"
  }

  const ownerTag = filterTagsByKey("Owner");
  const partnerTag = filterTagsByKey("Partner");

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const detailsTabContent = (

    <React.Fragment>
    {loading ? (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner size="xl" />
      </div>
    ) : 
    (<Flex direction={{ default: "column" }}>
      <FlexItem spacer={{ default: "spacerLg" }}>
        <Title
          headingLevel="h2"
          size="lg"
          className="pf-v5-u-mt-sm"
          id="open-tabs-example-tabs-list-details-title"
        >
          Cluster details
        </Title>
      </FlexItem>

      <FlexItem>
        <DescriptionList
          columnModifier={{ lg: "2Col" }}
          aria-labelledby="open-tabs-example-tabs-list-details-title"
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Name</DescriptionListTerm>
            <DescriptionListDescription>
              {clusterID}
            </DescriptionListDescription>
            <DescriptionListTerm>Status</DescriptionListTerm>
            <DescriptionListDescription>
              {renderStatusLabel(cluster.clusters[0].status)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Web console</DescriptionListTerm>
            <DescriptionListDescription>
                <a href={cluster.clusters[0].consoleLink} target="_blank" rel="noopener noreferrer">Console</a>
            </DescriptionListDescription>
            <DescriptionListTerm>Cluster Total Cost (Estimated)</DescriptionListTerm>
            <DescriptionListDescription>
              {parseNumberToCurrency(cluster.clusters[0].totalCost)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup name="Cloud Properties">
            <DescriptionListTerm>Cloud Provider</DescriptionListTerm>
            <DescriptionListDescription>
              {cluster.clusters[0].provider}
            </DescriptionListDescription>
            <DescriptionListTerm>Account</DescriptionListTerm>
            <DescriptionListDescription>
              {cluster.clusters[0].accountName || "unknown"}
            </DescriptionListDescription>
            <DescriptionListTerm>Region</DescriptionListTerm>
            <DescriptionListDescription>
              {cluster.clusters[0].region || "unknown"}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup name="Timestamps">
            <DescriptionListTerm>Created at</DescriptionListTerm>
            <DescriptionListDescription>
              {parseScanTimestamp(cluster.clusters[0].creationTimestamp)}
            </DescriptionListDescription>
            <DescriptionListTerm>Last scanned at</DescriptionListTerm>
            <DescriptionListDescription>
              {parseScanTimestamp(cluster.clusters[0].lastScanTimestamp)}
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup name="Extra metadata">
            <DescriptionListTerm>Labels</DescriptionListTerm>
              <LabelGroupOverflow labels={tags.tags} />
            <DescriptionListTerm>Partner</DescriptionListTerm>
            <DescriptionListDescription>
              {partnerTag}
            </DescriptionListDescription>
            <DescriptionListTerm>Owner</DescriptionListTerm>
            <DescriptionListDescription>
              {ownerTag}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </FlexItem>
    </Flex>)}
    </React.Fragment>
  );


  const serversTabContent = (
    <TabContentBody>
      <AggregateInstancesPerCluster />
    </TabContentBody>
  );


  return (
    <Page>
      <PageSection isWidthLimited variant={PageSectionVariants.light}>
        <Flex
        spaceItems={{ default: "spaceItemsMd" }}
        alignItems={{ default: "alignItemsFlexStart" }}
        flexWrap={{ default: "nowrap" }}
        >
        <FlexItem>
        <Label color="blue">Cluster</Label>
        </FlexItem>

        <FlexItem>
        <Title headingLevel="h1" size="2xl">
        {clusterID}
        </Title>
        </FlexItem>

        <FlexItem align={{ default: "alignRight" }}>
        <DropdownBasic></DropdownBasic>
        </FlexItem>
        </Flex>
        {/* Page tabs */}
      </PageSection>
      <PageSection
        type="tabs"
        variant={PageSectionVariants.light}
        isWidthLimited
        
      ><DividerUsingDiv></DividerUsingDiv>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          usePageInsets
          id="open-tabs-example-tabs-list"
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>Details</TabTitleText>}
            tabContentId={`tabContent${0}`}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>Servers</TabTitleText>}
            tabContentId={`tabContent${1}`}
          />    
        </Tabs>
  </div>
    <DividerUsingDiv></DividerUsingDiv>
      </PageSection>
      <PageSection isWidthLimited variant={PageSectionVariants.light}>
        <TabContent
          key={0}
          eventKey={0}
          id={`tabContent${0}`}
          activeKey={activeTabKey}
          hidden={0 !== activeTabKey}
        >
          <TabContentBody>{detailsTabContent}</TabContentBody>
        </TabContent>
        <TabContent
          key={1}
          eventKey={1}
          id={`tabContent${1}`}
          activeKey={activeTabKey}
          hidden={1 !== activeTabKey}
        >
          <TabContentBody>{serversTabContent}</TabContentBody>
        </TabContent>

      </PageSection>
    </Page>
  );
};

export default ClusterDetails;
