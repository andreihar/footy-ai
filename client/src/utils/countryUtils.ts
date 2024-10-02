import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const useCountryFlags = () => {
  const [countryCodes, setCountryCodes] = useState<{ [key: string]: string; }>({});
  let year = 2024;
  const t = useTranslations('country');

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
      { year: 1996, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Civil_Ensign_of_Yugoslavia_%281950%E2%80%931992%29.svg' },
      { year: 2008, flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Flag_of_Yugoslavia_%281918%E2%80%931941%29.svg' },
    ]
  };

  useEffect(() => {
    const historicCountriesCodes = {
      'Czechoslovakia': 'cz',
      'Soviet Union': 'su',
      'Yugoslavia': 'yu',
      'East Germany': 'de',
      'West Germany': 'de'
    };

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

  const getFlag = (country: string, circle: boolean) => {
    const customFlag = Object.keys(historicalFlags).some(countryKey =>
      historicalFlags[countryKey].some(flag =>
        country === countryKey && year >= flag.year && year < (historicalFlags[countryKey].find(nextFlag => nextFlag.year > flag.year)?.year || Infinity)
      )
    ) || !circle ? historicalFlags[country]?.find(entry => year < entry.year) : undefined;
    return customFlag ? customFlag.flagUrl : `${circle ? 'https://hatscripts.github.io/circle-flags/flags/' : 'https://raw.githubusercontent.com/lipis/flag-icons/b919a036693ee1ee0434ef5ae05f93543fc4f437/flags/4x3/'}${countryCodes[(getHistoricalNameEnglish(country) || country)]}.svg`;
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

export default useCountryFlags;
