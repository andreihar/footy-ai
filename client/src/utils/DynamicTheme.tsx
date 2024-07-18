import React, { ReactNode } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useStats } from '@/utils/StatsContext';
import { Plus_Jakarta_Sans, Ubuntu } from "next/font/google";

export const plus = Plus_Jakarta_Sans({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
	fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const ubuntu = Ubuntu({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
	fallback: ["Helvetica", "Arial", "sans-serif"],
});

const baselightTheme = createTheme({
	direction: "ltr",
	palette: {
		primary: { main: "#143CDB", light: "#ECF2FF", dark: "#4570EA" },
		secondary: { main: "#49BEFF", light: "#E8F7FF", dark: "#23afdb" },
		success: { main: "#13DEB9", light: "#E6FFFA", dark: "#02b3a9", contrastText: "#ffffff" },
		info: { main: "#539BFF", light: "#EBF3FE", dark: "#1682d4", contrastText: "#ffffff" },
		error: { main: "#FA896B", light: "#FDEDE8", dark: "#f3704d", contrastText: "#ffffff" },
		warning: { main: "#FFAE1F", light: "#FEF5E5", dark: "#ae8e59", contrastText: "#ffffff" },
		grey: { 100: "#F2F6FA", 200: "#EAEFF4", 300: "#DFE5EF", 400: "#7C8FAC", 500: "#5A6A85", 600: "#2A3547" },
		text: { primary: "#2A3547", secondary: "#5A6A85" },
		action: { disabledBackground: "rgba(73,82,88,0.12)", hoverOpacity: 0.02, hover: "#f6f9fc" },
		divider: "#e5eaef",
	},
	typography: {
		fontFamily: plus.style.fontFamily,
		h1: { fontWeight: 500, fontSize: "2.25rem", lineHeight: "2.75rem", fontFamily: ubuntu.style.fontFamily },
		h2: { fontWeight: 500, fontSize: "1.875rem", lineHeight: "2.25rem", fontFamily: ubuntu.style.fontFamily },
		h3: { fontWeight: 500, fontSize: "1.5rem", lineHeight: "1.75rem", fontFamily: ubuntu.style.fontFamily },
		h4: { fontWeight: 600, fontSize: "1.3125rem", lineHeight: "1.6rem" },
		h5: { fontWeight: 600, fontSize: "1.125rem", lineHeight: "1.6rem" },
		h6: { fontWeight: 600, fontSize: "1rem", lineHeight: "1.2rem" },
		button: { textTransform: "capitalize", fontWeight: 500 },
		body1: { fontSize: "1rem", fontWeight: 400, lineHeight: "1.334rem" },
		body2: { fontSize: "0.75rem", letterSpacing: "0rem", fontWeight: 400, lineHeight: "1rem" },
		subtitle1: { fontSize: "0.875rem", fontWeight: 400 },
		subtitle2: { fontSize: "0.875rem", fontWeight: 400 },
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
					boxShadow: "rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px !important",
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: { borderRadius: "7px" },
			},
		},
	},
});

const colorThemesByYear: { [year: number]: { primary: { main: string; light: string; }; secondary: { main: string; }; }; } = {
	1960: { primary: { main: '#0078C1', light: '#D0E9F9' }, secondary: { main: '#EE2D1F' } },
	1964: { primary: { main: '#D9281A', light: '#F9D4D0' }, secondary: { main: '#FFDE00' } },
	1968: { primary: { main: '#00A966', light: '#CCF3E3' }, secondary: { main: '#EE2D1F' } },
	1972: { primary: { main: '#FFD500', light: '#FFF9CC' }, secondary: { main: '#DD3F23' } },
	1976: { primary: { main: '#0066B4', light: '#CCE5F4' }, secondary: { main: '#E33C1B' } },
	1980: { primary: { main: '#00AD4D', light: '#CCF4E1' }, secondary: { main: '#E33C1B' } },
	1984: { primary: { main: '#0047C0', light: '#CCDDF7' }, secondary: { main: '#EE2D1F' } },
	1988: { primary: { main: '#FF0900', light: '#FFD6D4' }, secondary: { main: '#FFF200' } },
	1992: { primary: { main: '#00B0EF', light: '#CCF2FD' }, secondary: { main: '#FFC857' } },
	1996: { primary: { main: '#0096D7', light: '#CCEAF9' }, secondary: { main: '#00C1FF' } },
	2000: { primary: { main: '#F36C21', light: '#FCE3D1' }, secondary: { main: '#00BAFF' } },
	2004: { primary: { main: '#F3721B', light: '#FCE4D3' }, secondary: { main: '#FDB922' } },
	2008: { primary: { main: '#F00000', light: '#FFD6D6' }, secondary: { main: '#D9D7AF' } },
	2012: { primary: { main: '#0066CC', light: '#CCE5FF' }, secondary: { main: '#FFCC00' } },
	2016: { primary: { main: '#002161', light: '#CCD4E9' }, secondary: { main: '#395AFF' } },
	2020: { primary: { main: '#0085A5', light: '#CCEAF2' }, secondary: { main: '#00BFFF' } },
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
