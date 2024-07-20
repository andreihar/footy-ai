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

  // const historicalFlags: { [country: string]: { year: number; flagUrl: string; }[]; } = {
  //   'Russia': [
  //     { year: 1992, flagUrl: 'https://cdn.britannica.com/36/22536-050-E22B1D13/Flag-Union-of-Soviet-Socialist-Republics.jpg?w=400&h=300&c=crop' },
  //     { year: 1996, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_the_CIS.svg' }
  //   ],
  //   'Serbia': [
  //     { year: 1996, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Flag_of_Yugoslavia_%281946-1992%29.svg' },
  //     { year: 2008, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Flag_of_Yugoslavia_%281918%E2%80%931941%29.svg' },
  //   ]
  // };

  const historicCountriesCodes = {
    'Czechoslovakia': 'cz',
    'Soviet Union': 'su',
    'CIS': 'su',
    'Yugoslavia': 'yu',
    'East Germany': 'de',
    'West Germany': 'de'
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
      Object.entries(historicCountriesCodes).forEach(([country, code]) => {
        invertedData[country] = code;
      });
      setCountryCodes(invertedData);
    };
    fetchCountryCodes();
  }, []);

  const historicalFlags: { [country: string]: { year: number; flagUrl: string; }[]; } = {
    'Russia': [
      { year: 1992, flagUrl: 'https://cdn.britannica.com/36/22536-050-E22B1D13/Flag-Union-of-Soviet-Socialist-Republics.jpg?w=400&h=300&c=crop' },
      { year: 1996, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_the_CIS.svg' }
    ],
    'Serbia': [
      { year: 1996, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Flag_of_Yugoslavia_%281946-1992%29.svg' },
      { year: 2008, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Flag_of_Yugoslavia_%281918%E2%80%931941%29.svg' },
    ]
  };

  const getFlag = (country: string, circle: boolean) => {
    const customFlag = (country === 'Russia' && year >= 1992 && year < 1996) || (country === 'Serbia' && year >= 1996 && year < 2008) || !circle
      ? historicalFlags[country]?.find(entry => year < entry.year) : undefined;
    return customFlag ? customFlag.flagUrl : `${circle ? 'https://hatscripts.github.io/circle-flags/flags/' : 'https://raw.githubusercontent.com/lipis/flag-icons/b919a036693ee1ee0434ef5ae05f93543fc4f437/flags/4x3/'}${countryCodes[(getHistoricalNameEnglish(country) || country)]}.svg`;
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
    return formatMessage({ id: `country.${getHistoricalNameEnglish(country)}` });
  };

  return { getFlag, getUefaCountries, getHistoricalName };
};

export default useCountryFlags;
