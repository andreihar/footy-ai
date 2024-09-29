import React from 'react';
import Image from 'next/image';
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

  return <Image src={getLogoSrc()} alt={`UEFA Euro ${year} Logo`} width={year === 2024 ? 32 : 79} height={40} objectFit="contain" unoptimized />;
};

export default EuroLogo;
