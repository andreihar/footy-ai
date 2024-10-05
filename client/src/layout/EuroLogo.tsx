import React from 'react';
import Image from 'next/image';

interface EuroLogoProps {
  year: number;
}

const EuroLogo: React.FC<EuroLogoProps> = ({ year }) => {
  const getLogoSrc = (): string => {
    if (year === 2024) {
      return "https://img.uefa.com/imgml/uefacom/elements/logos/competitions/dark/euro2024.svg";
    } else {
      return `https://img.uefa.com/imgml/uefacom/history/uefaeuro/season_picker/${year}.png`;
    }
  };

  return (
    <Image src={getLogoSrc()} alt={`UEFA Euro ${year} Logo`} width={year === 2024 ? 32 : 79} height={40} style={{ objectFit: 'contain' }} unoptimized priority />
  );
};

export default EuroLogo;