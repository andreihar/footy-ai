'use client';
import { Pagination, Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';

interface PaginationComponentProps {
  total: number;
  current: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ total, current }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (_event: ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Pagination count={total} page={current} onChange={handleChange} color="primary" size="large" />
    </Box>
  );
};

export default PaginationComponent;
