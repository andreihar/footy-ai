import React, { ReactNode } from 'react';
import { baselightTheme } from './DefaultColors';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useStats } from '@/utils/StatsContext';

const colorThemesByYear: { [year: number]: { primary: { main: string; light: string; }; secondary: { main: string; }; }; } = {
	1960: { primary: { main: '#0078C1', light: '#ECF2FF' }, secondary: { main: '#EE2D1F' } },
	1964: { primary: { main: '#D9281A', light: '#ECF2FF' }, secondary: { main: '#FFDE00' } },
	1968: { primary: { main: '#00A966', light: '#ECF2FF' }, secondary: { main: '#EE2D1F' } },
	1972: { primary: { main: '#FFD500', light: '#ECF2FF' }, secondary: { main: '#DD3F23' } },
	1976: { primary: { main: '#0066B4', light: '#ECF2FF' }, secondary: { main: '#E33C1B' } },
	1980: { primary: { main: '#00AD4D', light: '#ECF2FF' }, secondary: { main: '#E33C1B' } },
	1984: { primary: { main: '#0047C0', light: '#ECF2FF' }, secondary: { main: '#EE2D1F' } },
	1988: { primary: { main: '#FF0900', light: '#ECF2FF' }, secondary: { main: '#FFF200' } },
	1992: { primary: { main: '#00B0EF', light: '#ECF2FF' }, secondary: { main: '#FFC857' } },
	1996: { primary: { main: '#0096D7', light: '#ECF2FF' }, secondary: { main: '#49BEFF' } },
	2000: { primary: { main: '#002161', light: '#ECF2FF' }, secondary: { main: '#49BEFF' } },
	2004: { primary: { main: '#FDB922', light: '#ECF2FF' }, secondary: { main: '#49BEFF' } },
	2008: { primary: { main: '#F00000', light: '#ECF2FF' }, secondary: { main: '#7E7D66' } },
	2012: { primary: { main: '#002161', light: '#ECF2FF' }, secondary: { main: '#49BEFF' } },
	2016: { primary: { main: '#002161', light: '#ECF2FF' }, secondary: { main: '#49BEFF' } },
	2020: { primary: { main: '#0085A5', light: '#ECF2FF' }, secondary: { main: '#49BEFF' } },
	2024: { primary: { main: '#143CDB', light: '#ECF2FF' }, secondary: { main: '#49BEFF' } }
};

const DynamicTheme: React.FC<{ children: ReactNode; }> = ({ children }) => {
	const { year } = useStats();

	const getThemeForYear = () => {
		const colorsForYear = colorThemesByYear[year];
		if (colorsForYear) {
			return createTheme({
				...baselightTheme,
				palette: {
					...baselightTheme.palette,
					primary: colorsForYear.primary,
					secondary: colorsForYear.secondary
				}
			});
		}
		return baselightTheme; // Use baselightTheme directly if no specific year match
	};

	const theme = getThemeForYear();

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};

export default DynamicTheme;
