import { LoadingSpinner } from '@app/components/common/LoadingSpinner';
import { Flex, FlexItem, Title } from '@patternfly/react-core';
import React from 'react';
import { AccountDetailsContentProps } from './types';
import { AccountDescriptionList } from './AccountDescriptionList';

export const AccountDetailsContent: React.FunctionComponent<AccountDetailsContentProps> = ({
  loading,
  accountData,
}) => {
  return (
    <React.Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Flex direction={{ default: 'column' }}>
          <FlexItem spacer={{ default: 'spacerLg' }}>
            <Title headingLevel="h2" size="lg" className="pf-v5-u-mt-sm" id="open-tabs-example-tabs-list-details-title">
              Account details
            </Title>
          </FlexItem>
          <FlexItem>
            <AccountDescriptionList account={accountData.accounts[0]} />
          </FlexItem>
        </Flex>
      )}
    </React.Fragment>
  );
};
