'use client';
import { Typography } from '@mui/material';

function Time({ date, locale }: { date: Date; locale: string; }) {
  return (
    <Typography variant="h6">
      {new Date(date).toLocaleString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      &nbsp; • &nbsp;
      {new Date(date).toLocaleString(locale, { hour: 'numeric', minute: 'numeric' })}
    </Typography>
  );
}

export default Time;
