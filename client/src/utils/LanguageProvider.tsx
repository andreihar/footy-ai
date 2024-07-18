import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import EnglishMessages from '../locales/en.json';
import FrenchMessages from '../locales/fr.json';
import GermanMessages from '../locales/de.json';
import SpanishMessages from '../locales/es.json';
import ItalianMessages from '../locales/it.json';
import PortugueseMessages from '../locales/pt.json';

interface LanguageContextType {
	language: string;
	setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const flattenMessages = (nestedMessages: any, prefix = '') => {
	return Object.keys(nestedMessages).reduce((messages: { [key: string]: string; }, key) => {
		const value = nestedMessages[key];
		const prefixedKey = prefix ? `${prefix}.${key}` : key;

		if (typeof value === 'object') {
			Object.assign(messages, flattenMessages(value, prefixedKey));
		} else {
			messages[prefixedKey] = value;
		}

		return messages;
	}, {});
};

export const LanguageProvider: React.FC<{ children: ReactNode; }> = ({ children }) => {
	const getInitialLanguage = () => {
		if (typeof window !== "undefined") {
			return localStorage.getItem('appLanguage') || 'en';
		}
		return 'en';
	};

	const [language, setLanguage] = useState(getInitialLanguage);
	const handleSetLanguage = (language: string) => {
		if (typeof window !== "undefined") {
			localStorage.setItem('appLanguage', language);
		}
		setLanguage(language);
	};

	type Language = 'en' | 'fr' | 'de' | 'es' | 'it' | 'pt';
	const messagesMap: { [key in Language]: { [key: string]: string; } } = {
		en: flattenMessages(EnglishMessages),
		fr: flattenMessages(FrenchMessages),
		de: flattenMessages(GermanMessages),
		es: flattenMessages(SpanishMessages),
		it: flattenMessages(ItalianMessages),
		pt: flattenMessages(PortugueseMessages),
	};

	const messages = messagesMap[language as Language];

	return (
		<LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
			<IntlProvider locale={language} messages={messages}>
				{children}
			</IntlProvider>
		</LanguageContext.Provider>
	);
};

export const useLanguage = (): LanguageContextType => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return context;
};