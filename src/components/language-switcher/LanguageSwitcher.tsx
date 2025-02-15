import { useCallback, useEffect, useState } from 'react';
import {
    Image,
    ImageStyle,
    StyleProp,
    Text,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
import { useStyles } from '../../styles';
import { isCountryIso, isEmpty, normalizeLocale, stripAccents } from '../../utils';
import Autocomplete, { AutocompleteComponentProps } from '../autocomplete/Autocomplete';

type LanguageSwitcherVariant = 'native' | 'localized';

type NativeLanguages = {
    language: string;
    nativeName: string;
    countryCode: string;
}

type LocalizedLanguage = {
    code: string;
    locale: string;
}

export type Language = {
    locale: string;
    nativeName?: string;
    localizedName?: string;
    countryCode: string;
    flagUri: string;
}

interface LanguageSwitcherProps extends AutocompleteComponentProps<Language> {
    /**
     * The supported locales.
     */
    supportedLocales?: string[];
    /**
     * Locale for country translations.
     */
    locale?: string;
    /**
     * The LanguageSwitcher variant.
     */
    variant?: LanguageSwitcherVariant;
    /**
     * Callback when a language is selected.
     */
    onSelected: (language: Language) => void;
    /**
     * Overrides the flag style.
     */
    flagStyle?: StyleProp<ImageStyle>;
    /**
     * If true, the flag will be displayed in a circle shape.
     */
    flagRounded?: boolean;
    /**
     * Overrides the listItem container style.
     */
    listItemStyle?: StyleProp<ViewStyle>;
    /**
     * Overrides the language style.
     */
    languageStyle?: StyleProp<TextStyle>;
}

const LOCALIZED_LANGUAGES_URI = 'https://raw.githubusercontent.com/jereztech/react-elements/refs/heads/main/src/assets/api/locales/translations';

const NATIVE_LANGUAGES_URI = 'https://raw.githubusercontent.com/jereztech/react-elements/refs/heads/main/src/assets/api/languages/languages.json';

const FLAGS_URI = 'https://raw.githubusercontent.com/jereztech/react-elements/refs/heads/main/src/assets/images/flags/w80';

export default function LanguageSwitcher({
    theme,
    supportedLocales,
    locale = 'en-US',
    variant = 'native',
    onSelected,
    flagStyle,
    flagRounded = false,
    placeholder = 'Select a language...',
    autocompleteStyle,
    inputContainerStyle,
    iconProps,
    listProps,
    listItemStyle,
    languageStyle,
    ...inputProps
}: LanguageSwitcherProps) {

    const styles = useStyles(theme);

    const [languages, setLanguages] = useState<Language[]>([]);

    const isNativeLanguages = variant === 'native';

    const loadLanguages = useCallback(async () => {
        try {
            let languages: Language[] = [];
            if (isNativeLanguages) {
                const nativeLanguages = await fetch(NATIVE_LANGUAGES_URI).then(response => response.json());
                languages = nativeLanguages.map(({ language: locale, nativeName, countryCode }: NativeLanguages) => ({
                    locale,
                    nativeName,
                    countryCode,
                    flagUri: `${FLAGS_URI}/${countryCode.toLowerCase()}.png`
                } as Language));
            } else {
                const localizedLanguages = await fetch(`${LOCALIZED_LANGUAGES_URI}/${locale.replace('-', '_')}.json`)
                    .then(response => response.json());
                languages = localizedLanguages.map(({ code, locale: localizedName }: LocalizedLanguage) => {
                    const locale = normalizeLocale(code);
                    const [, countryCode] = locale.split('-');
                    return {
                        locale,
                        localizedName,
                        countryCode,
                        flagUri: isCountryIso(countryCode) && `${FLAGS_URI}/${countryCode.toLowerCase()}.png`
                    } as Language;
                }).filter(({ flagUri }: Language) => !!flagUri);
            }
            if (!!supportedLocales?.length) {
                languages = languages.filter(({ locale }: Language) => supportedLocales.includes(locale));
            }
            setLanguages(languages);
        } catch (error) {
            console.error('Error fetching languages:', error);
            setLanguages([]);
        }
    }, [locale]);

    useEffect(() => {
        loadLanguages();
    }, [loadLanguages]);

    const filterLanguages = async (filter = ''): Promise<Language[]> => {
        const normalizedFilter = filter?.trim()?.toLowerCase() ?? '';
        if (isEmpty(normalizedFilter)) {
            return languages;
        }
        return isNativeLanguages ?
            languages.filter(({ nativeName }) => nativeName!.toLowerCase().includes(normalizedFilter)) :
            languages.filter(({ localizedName }) => stripAccents(localizedName!.toLowerCase())
                .includes(stripAccents(normalizedFilter))
            );
    };

    return (
        <Autocomplete<Language>
            placeholder={placeholder}
            fetchItems={filterLanguages}
            autocompleteStyle={autocompleteStyle}
            inputContainerStyle={inputContainerStyle}
            iconProps={iconProps}
            listProps={listProps}
            {...inputProps}
            renderItem={({ item: language }) => (
                <View style={[styles.listItem, listItemStyle]}>
                    <Image
                        source={{ uri: language.flagUri }}
                        style={[styles.flag, flagRounded && styles.flagRounded, flagStyle]}
                    />
                    <Text style={[styles.text, languageStyle]}>
                        {isNativeLanguages ? language.nativeName : language.localizedName}
                    </Text>
                </View>
            )}
            onSelected={({ item }) => onSelected(item)}
        />
    );
}
