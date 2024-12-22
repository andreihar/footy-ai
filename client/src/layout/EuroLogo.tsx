import React from 'react';
import Image from 'next/image';
import useYear from '@/utils/yearUtils';

const EuroLogo: React.FC<{ year: number; }> = ({ year }) => {
  const { isEuro, getTourneyName } = useYear(year);
  const getLogoSrc = (): string => {
    if (isEuro(year)) {
      return year === 2024
        ? "https://img.uefa.com/imgml/uefacom/elements/logos/competitions/dark/euro2024.svg"
        : `https://img.uefa.com/imgml/uefacom/history/uefaeuro/season_picker/${year}.png`;
    } else {
      return "https://img.uefa.com/imgml/uefacom/uefanationsleague/logo_small.svg";
    }
  };

  return (
    <Image src={getLogoSrc()} alt={`UEFA ${getTourneyName(year)} Logo`} width={year === 2024 ? 32 : 79} height={40} style={{ objectFit: 'contain' }} priority />
  );
};

export default EuroLogo;
