export const port = process.env.PORT || 3000;
export const host = process.env.NEXT_PUBLIC_URL
  ? `https://${process.env.NEXT_PUBLIC_URL}`
  : `http://localhost:${port}`;

export const endEuroYear = parseInt(process.env.NEXT_PUBLIC_END_EURO_YEAR || '2024', 10);
export const endNationsYear = parseInt(process.env.NEXT_PUBLIC_END_NATIONS_YEAR || '2025', 10);

export const generateYearsArray = (startEuro: number, startNations: number, endEuro: number, endNations: number): number[] => {
  const euroYears = [];
  const nationsYears = [];
  for (let year = endEuro; year >= startEuro; year -= 4) {
    euroYears.push(year);
  }
  for (let year = endNations; year >= startNations; year -= 2) {
    nationsYears.push(year);
  }
  const combinedYears = [...euroYears, ...nationsYears].sort((a, b) => b - a);

  return combinedYears;
};

export const years = generateYearsArray(1960, 2019, endEuroYear, endNationsYear);
