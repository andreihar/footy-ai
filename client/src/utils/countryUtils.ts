import { useState, useEffect } from 'react';

const useCountryFlags = () => {
  const [countryCodes, setCountryCodes] = useState<{ [key: string]: string }>({});

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
    const countryCode = countryCodes[country];
    return countryCode ? `https://flagcdn.com/w640/${countryCode}.png` : '';
  };

  return { countryCodes, getFlag };
};

export default useCountryFlags;
