'use client';
import { useIntl } from 'react-intl';
import PageContainer from '@/app/components/container/PageContainer';
import GroupPerformance from '@/app/components/shared/GroupPerformance';

const GroupPage = () => {
  const { formatMessage } = useIntl();
  const groups = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F'];

  return (
    <PageContainer title={formatMessage({ id: 'header.group' })} description="List of matches and predictions for the Group Stage">
      {groups.map(group => (
        <div key={group} style={{ marginBottom: '20px' }}>
          <GroupPerformance group={group} />
        </div>
      ))}
    </PageContainer>
  );
};

export default GroupPage;
