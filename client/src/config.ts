export const port = process.env.PORT || 3000;
export const host = process.env.NEXT_PUBLIC_URL
  ? `https://${process.env.NEXT_PUBLIC_URL}`
  : `http://localhost:${port}`;

export const startYear = parseInt(process.env.NEXT_PUBLIC_START_YEAR || '2020', 10);
export const endYear = parseInt(process.env.NEXT_PUBLIC_END_YEAR || '2024', 10);

export const generateYearsArray = (start: number, end: number, gap: number): number[] => {
  const years = [];
  for (let year = end; year >= start; year -= gap) {
    years.push(year);
  }
  return years;
};

export const years = generateYearsArray(startYear, endYear, 4);
