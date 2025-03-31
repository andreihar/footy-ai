import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

type CountryCodes = {
  [key: string]: string;
};

export const useCountries = (year: number) => {
  const t = useTranslations('Country');

  const uefaChanges = {
    1960: ['AL', 'AT', 'BE', 'BG', 'CZ', 'DK', 'DD', 'GB-ENG', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LU', 'NL', 'GB-NIR', 'NO', 'PL', 'PT', 'RO', 'RU', 'GB-SCT', 'RS', 'ES', 'SE', 'CH', 'TR', 'GB-WLS'],
    1964: ['CY', 'MT'],
    1984: ['LI'],
    1992: ['FO', 'SM', '-DD'],
    1996: ['AM', 'AZ', 'BY', 'HR', 'EE', 'GE', 'IL', 'LV', 'LT', 'MD', 'MK', 'SK', 'SI', 'UA'],
    2000: ['AD', 'BA'],
    2004: ['KZ'],
    2008: ['ME'],
    2016: ['GI'],
    2020: ['XK']
  };

  const historicalNames: { [country: string]: ({ year: number; name: string; })[]; } = {
    'DE': [{ year: 1992, name: 'DEU' }],
    'RU': [
      { year: 1992, name: 'SU' },
      { year: 1996, name: 'CIS' }
    ],
    'CZ': [{ year: 1996, name: 'CS' }],
    'RS': [{ year: 2008, name: 'YU' }]
  };

  const historicalFlags: { [country: string]: { year: number; flagUrl: string; }[]; } = {
    'RU': [
      { year: 1992, flagUrl: 'https://cdn.britannica.com/36/22536-050-E22B1D13/Flag-Union-of-Soviet-Socialist-Republics.jpg?w=400&h=300&c=crop' },
      { year: 1996, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_the_CIS.svg' }
    ],
    'RS': [
      { year: 1996, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Civil_Ensign_of_Yugoslavia_%281950%E2%80%931992%29.svg' },
      { year: 2008, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Flag_of_Yugoslavia_%281918%E2%80%931941%29.svg' },
    ]
  };

  const historicCountriesCodes: CountryCodes = {
    'CS': 'CZ',
    'DD': 'DE',
    'DEU': 'DE'
  };

  const countryCodes: CountryCodes = { ...historicCountriesCodes };

  const getFlag = (country: string, circle: boolean) => {
    const customFlag = Object.keys(historicalFlags).some(countryKey =>
      historicalFlags[countryKey].some(flag =>
        country === countryKey && year >= flag.year && year < (historicalFlags[countryKey].find(nextFlag => nextFlag.year > flag.year)?.year || Infinity)
      )
    ) || !circle ? historicalFlags[country]?.find(entry => year < entry.year) : undefined;

    const histName = getHistoricalNameEnglish(country);
    // Use mapping if available, else use histName, else fallback to country
    const flagCode = countryCodes[histName] || histName || country;

    return customFlag ? customFlag.flagUrl : `${circle
      ? 'https://hatscripts.github.io/circle-flags/flags/'
      : 'https://raw.githubusercontent.com/lipis/flag-icons/b919a036693ee1ee0434ef5ae05f93543fc4f437/flags/4x3/'
      }${flagCode.toLowerCase()}.svg`;
  };

  const getUefaCountries = (): string[] => {
    return Array.from(Object.entries(uefaChanges).reduce((acc, [changeYear, countries]) => {
      if (parseInt(changeYear) <= year) {
        countries.forEach(country => {
          if (country.startsWith('-')) {
            acc.delete(country.substring(1));
          } else {
            acc.add(country);
          }
        });
      }
      return acc;
    }, new Set<string>())).sort();
  };

  const getHistoricalNameEnglish = (country: string): string => {
    if (historicalNames[country]) {
      for (const { year: historicalYear, name } of historicalNames[country]) {
        if (year < historicalYear) {
          return name;
        }
      }
    }
    return country;
  };

  const getHistoricalName = (country: string): string => {
    return t(`${getHistoricalNameEnglish(country)}` as any);
  };

  return { getFlag, getUefaCountries, getHistoricalName };
};

const isEuro = (year: number) => {
  return (year - 1960) % 4 === 0;
};

export const useYear = () => {
  const t = useTranslations('About');

  const getTourneyName = (year: number) => {
    return isEuro(year) ? `${t('euro')} ${year}` : `${t('nations')} ${year - 1}-${year.toString().slice(-2)}`;
  };

  return { getTourneyName, isEuro };
};

export const getTourneyNameStatic = async (year: number) => {
  const t = await getTranslations('About');
  return isEuro(year) ? `${t('euro')} ${year}` : `${t('nations')} ${year - 1}-${year.toString().slice(-2)}`;
};
