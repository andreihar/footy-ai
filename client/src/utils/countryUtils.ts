import { useState, useEffect } from 'react';
import { useStats } from './StatsContext';
import { useIntl } from 'react-intl';

const useCountryFlags = () => {
  const [countryCodes, setCountryCodes] = useState<{ [key: string]: string; }>({});
  const { year } = useStats();
  const { formatMessage } = useIntl();

  const uefaChanges = {
    1960: ['Albania', 'Austria', 'Belgium', 'Bulgaria', 'Czechia', 'Denmark', 'East Germany', 'England', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Luxembourg', 'Netherlands', 'Northern Ireland', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'Scotland', 'Serbia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Wales'],
    1964: ['Cyprus', 'Malta'],
    1984: ['Liechtenstein'],
    1992: ['Faroe Islands', 'San Marino', '-East Germany'],
    1996: ['Armenia', 'Azerbaijan', 'Belarus', 'Croatia', 'Estonia', 'Georgia', 'Israel', 'Latvia', 'Lithuania', 'Moldova', 'North Macedonia', 'Slovakia', 'Slovenia', 'Ukraine'],
    2000: ['Andorra', 'Bosnia and Herzegovina'],
    2004: ['Kazakhstan'],
    2008: ['Montenegro'],
    2016: ['Gibraltar'],
    2020: ['Kosovo']
  };

  const historicalNames: { [country: string]: ({ year: number; name: string; })[]; } = {
    'Germany': [{ year: 1992, name: 'West Germany' }],
    'Russia': [
      { year: 1992, name: 'Soviet Union' },
      { year: 1996, name: 'CIS' }
    ],
    'Czechia': [{ year: 1996, name: 'Czechoslovakia' }],
    'Serbia': [{ year: 2008, name: 'Yugoslavia' }]
  };

  const historicalFlags: { [country: string]: { year: number; flagUrl: string; }[]; } = {
    'Russia': [
      { year: 1992, flagUrl: 'https://cdn.britannica.com/36/22536-050-E22B1D13/Flag-Union-of-Soviet-Socialist-Republics.jpg?w=400&h=300&c=crop' },
      { year: 1996, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_the_CIS.svg' }
    ],
    'Serbia': [
      { year: 1996, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Flag_of_Yugoslavia_%281946-1992%29.svg' },
      { year: 2008, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Flag_of_Yugoslavia_%281918%E2%80%931941%29.svg' },
    ],
    'East Germany': [{ year: 1992, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Flag_of_the_German_Democratic_Republic.svg' }]
  };

  useEffect(() => {
    const fetchCountryCodes = async () => {
      const response = await fetch('https://flagcdn.com/en/codes.json');
      const data = await response.json();
      const invertedData = Object.entries(data).reduce((obj, [code, country]) => {
        if (!code.startsWith('us-')) {
          obj[country as string] = code;
        }
        return obj;
      }, {} as { [key: string]: string; });
      setCountryCodes(invertedData);
    };

    fetchCountryCodes();
  }, []);

  const getFlag = (country: string) => {
    if (historicalFlags[country]) {
      const customFlag = historicalFlags[country].filter(entry => year < entry.year)[0];
      if (customFlag) {
        return customFlag.flagUrl;
      }
    }

    const countryCode = countryCodes[country];
    return countryCode ? `https://flagcdn.com/w640/${countryCode}.png` : '';
  };

  const getUefaCountries = (): string[] => {
    const uefaCountries = new Set<string>();

    Object.entries(uefaChanges).forEach(([changeYear, countries]) => {
      if (parseInt(changeYear) <= year) {
        countries.forEach(country => {
          if (country.startsWith('-')) {
            uefaCountries.delete(country.substring(1));
          } else {
            uefaCountries.add(country);
          }
        });
      }
    });

    return Array.from(uefaCountries).sort();
  };

  const getHistoricalName = (country: string): string => {
    if (historicalNames[country]) {
      for (const { year: historicalYear, name } of historicalNames[country]) {
        if (year < historicalYear) {
          return formatMessage({ id: `country.${name}` });
        }
      }
    }
    return formatMessage({ id: `country.${country}` });
  };

  return { countryCodes, getFlag, getUefaCountries, getHistoricalName };
};

export default useCountryFlags;
