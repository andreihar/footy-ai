'use client';
import { Avatar, Box, Button, CardContent, Typography } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import DashboardCard from '@/app/components/shared/DashboardCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';

import ProductPerformance from '@/app/components/dashboard/ProductPerformance';

import euro2024 from '../../../public/data/euro2024.json';
import { useEffect, useState } from 'react';
import Match from '../types/match';

const GroupPage = () => {
  const groups = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F'];

  return (
    <PageContainer title="Group Stage" description="List of matches and predictions for the Group Stage">
      {groups.map(group => (
        <div key={group} style={{ marginBottom: '20px' }}>
          <ProductPerformance group={group} />
        </div>
      ))}
    </PageContainer>
  );
};

export default GroupPage;
