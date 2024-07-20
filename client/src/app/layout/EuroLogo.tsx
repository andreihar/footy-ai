import React from 'react';
import { useStats } from '@/utils/StatsContext';

const EuroLogo = () => {
  const { year } = useStats();

  const getLogoSrc = (): string => {
    if (year === 2024) {
      return "https://img.uefa.com/imgml/uefacom/elements/logos/competitions/dark/euro2024.svg";
    } else {
      return `https://img.uefa.com/imgml/uefacom/history/uefaeuro/season_picker/${year}.png`;
    }
  };

  return <img src={getLogoSrc()} alt={`UEFA Euro ${year} Logo`} height={40} />;
};

export default EuroLogo;
