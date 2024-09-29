'use client';
import { useIntl } from 'react-intl';
import { useStats } from '@/utils/StatsContext';
import PageContainer from '@/components/container/PageContainer';
import GroupPerformance from '@/components/shared/GroupPerformance';

const GroupPage = () => {
  const { formatMessage } = useIntl();
  const { groups } = useStats();

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
