'use client';
import { useTranslations } from 'next-intl';
import * as stats from '@/utils/stats';
import PageContainer from '@/components/container/PageContainer';
import GroupPerformance from '@/components/shared/GroupPerformance';

const GroupPage = () => {
  const t = useTranslations();
  const { groups } = stats;

  return (
    <PageContainer title={t('header.group')} description="List of matches and predictions for the Group Stage">
      {groups.map(group => (
        <div key={group} style={{ marginBottom: '20px' }}>
          <GroupPerformance group={group} />
        </div>
      ))}
    </PageContainer>
  );
};

export default GroupPage;
