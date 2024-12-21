import React from 'react';
import Image from 'next/image';

const EuroLogo: React.FC<{ year: number; }> = ({ year }) => {
  const getLogoSrc = (): string => {
    if ((year - 1960) % 4 === 0) {
      return year === 2024
        ? "https://img.uefa.com/imgml/uefacom/elements/logos/competitions/dark/euro2024.svg"
        : `https://img.uefa.com/imgml/uefacom/history/uefaeuro/season_picker/${year}.png`;
    } else {
      return "https://img.uefa.com/imgml/uefacom/uefanationsleague/logo_small.svg";
    }
  };

  return (
    <Image src={getLogoSrc()} alt={`UEFA ${year} Logo`} width={year === 2024 ? 32 : 79} height={40} style={{ objectFit: 'contain' }} priority />
  );
};

export default EuroLogo;
