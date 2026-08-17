import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
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
import {
    DEFAULT_LOCALE,
    FLAGS_URI,
    LANGUAGES_URI,
    LOCALES_URI,
    isCountryIso,
    isEmpty,
    normalizeLocale,
    stripAccents
} from '../../utils';
import Autocomplete, { AutocompleteInputProps } from '../autocomplete/Autocomplete';

type LanguageSwitcherVariant = 'native' | 'localized';

type NativeLanguagePayload = {
    language: string;
    nativeName: string;
    countryCode: string;
}

type LocalizedLanguagePayload = {
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

interface LanguageSwitcherProps extends AutocompleteInputProps<Language> {
    /**
     * Supported locales whitelist.
     */
    supportedLocales?: string[];
    /**
     * Locale for language translations.
     */
    locale?: string;
    /**
     * Language source variant.
     */
    variant?: LanguageSwitcherVariant;
    /**
     * Callback when a language is selected.
     */
    onSelected: (language: Language) => void;
    /**
     * The currently selected locale, forwarded to `renderItem` as `isSelected`.
     */
    selectedLocale?: string;
    /**
     * Overrides the flag style.
     */
    flagStyle?: StyleProp<ImageStyle>;
    /**
     * If true, the flag will be displayed in a circle shape.
     */
    flagRounded?: boolean;
    /**
     * Overrides the listItem container style (default renderer).
     */
    listItemStyle?: StyleProp<ViewStyle>;
    /**
     * Overrides the language style (default renderer).
     */
    languageStyle?: StyleProp<TextStyle>;
    /**
     * Custom renderer for each language item.
     */
    renderItem?: (params: { language: Language; isSelected: boolean }) => ReactElement;
}

export default function LanguageSwitcher({
    theme,
    supportedLocales,
    locale = DEFAULT_LOCALE,
    variant = 'native',
    onSelected,
    selectedLocale,
    flagStyle,
    flagRounded = false,
    placeholder = 'Select a language...',
    autocompleteStyle,
    inputContainerStyle,
    listProps,
    listItemStyle,
    languageStyle,
    renderItem,
    ...inputProps
}: LanguageSwitcherProps) {

    const styles = useStyles(theme);

    const [allLanguages, setAllLanguages] = useState<Language[]>([]);

    const isNativeLanguages = variant === 'native';

    const loadLanguages = useCallback(async () => {
        try {
            const uri = isNativeLanguages ? LANGUAGES_URI : `${LOCALES_URI}/${locale.replace('-', '_')}.json`;
            const response = await fetch(uri);
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            if (isNativeLanguages) {
                const payload: NativeLanguagePayload[] = await response.json();
                setAllLanguages(payload.map(({ language, nativeName, countryCode }) => ({
                    locale: language,
                    nativeName,
                    countryCode,
                    flagUri: `${FLAGS_URI}/${countryCode.toLowerCase()}.png`
                })));
            } else {
                const payload: LocalizedLanguagePayload[] = await response.json();
                setAllLanguages(payload.flatMap(({ code, locale: localizedName }) => {
                    const normalizedLocale = normalizeLocale(code);
                    const [, countryCode] = normalizedLocale.split('-');
                    return isCountryIso(countryCode) ? [{
                        locale: normalizedLocale,
                        localizedName,
                        countryCode,
                        flagUri: `${FLAGS_URI}/${countryCode.toLowerCase()}.png`
                    }] : [];
                }));
            }
        } catch (error) {
            console.error('Error fetching languages:', error);
            setAllLanguages([]);
        }
    }, [isNativeLanguages, locale]);

    useEffect(() => {
        loadLanguages();
    }, [loadLanguages]);

    const supportedLocalesKey = supportedLocales?.join(',') ?? '';

    const languages = useMemo(() => {
        if (!supportedLocalesKey) {
            return allLanguages;
        }
        const allowedLocales = new Set(supportedLocalesKey.split(','));
        return allLanguages.filter(({ locale: languageLocale }) => allowedLocales.has(languageLocale));
    }, [allLanguages, supportedLocalesKey]);

    const filterLanguages = useCallback(async (filter = ''): Promise<Language[]> => {
        if (isEmpty(filter)) {
            return languages;
        }
        const normalizedFilter = stripAccents(filter.trim().toLowerCase());
        return languages.filter(({ nativeName, localizedName }) => {
            const name = isNativeLanguages ? nativeName : localizedName;
            return stripAccents(name?.toLowerCase() ?? '').includes(normalizedFilter);
        });
    }, [languages, isNativeLanguages]);

    const renderDefaultItem = (language: Language) => (
        <View style={[styles.listItem, listItemStyle]}>
            <Image
                source={{ uri: language.flagUri }}
                style={[styles.flag, flagRounded && styles.flagRounded, flagStyle]}
            />
            <Text style={[styles.text, languageStyle]}>
                {isNativeLanguages ? language.nativeName : language.localizedName}
            </Text>
        </View>
    );

    return (
        <Autocomplete<Language>
            theme={theme}
            placeholder={placeholder}
            fetchItems={filterLanguages}
            autocompleteStyle={autocompleteStyle}
            inputContainerStyle={inputContainerStyle}
            listProps={listProps}
            {...inputProps}
            renderItem={({ item }) =>
                renderItem
                    ? renderItem({ language: item, isSelected: selectedLocale === item.locale })
                    : renderDefaultItem(item)
            }
            onSelected={({ item }) => onSelected(item)}
        />
    );
}
