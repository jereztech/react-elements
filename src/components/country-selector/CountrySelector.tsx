import { CountryCallingCode, CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ImageStyle, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useStyles } from '../../styles';
import { COUNTRIES_URI, DEFAULT_LOCALE, FLAGS_URI, isEmpty, stripAccents } from '../../utils';
import Autocomplete, { AutocompleteInputProps } from '../autocomplete/Autocomplete';

type CountrySelectorVariant = 'countries' | 'callingCodes';

type CountryPayload = {
    alpha2Code: string;
    country: string;
}

export type Country = {
    code: CountryCode;
    name: string;
    callingCode?: CountryCallingCode;
    flagUri: string;
}

interface CountrySelectorProps extends AutocompleteInputProps<Country> {
    /**
     * When provided, only the countries with these codes (ISO 3166) are shown.
     */
    countryCodes?: string[];
    /**
     * Locale for country translations.
     */
    locale?: string;
    /**
     * The CountrySelector variant.
     */
    variant?: CountrySelectorVariant;
    /**
     * Callback when a country is selected.
     */
    onSelected: (country: Country) => void;
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
     * Overrides the country style.
     */
    countryStyle?: StyleProp<TextStyle>;
}

export default function CountrySelector({
    theme,
    countryCodes = getCountries(),
    locale = DEFAULT_LOCALE,
    variant = 'countries',
    onSelected,
    flagStyle,
    flagRounded = false,
    placeholder = 'Select a country...',
    autocompleteStyle,
    inputContainerStyle,
    listProps,
    listItemStyle,
    countryStyle,
    ...inputProps
}: CountrySelectorProps) {

    const styles = useStyles(theme);

    const [countries, setCountries] = useState<Country[]>([]);

    const isCallingCodes = variant === 'callingCodes';

    const countryCodesKey = countryCodes.join(',');

    const loadCountries = useCallback(async () => {
        try {
            const response = await fetch(`${COUNTRIES_URI}/${locale.replace('-', '_')}.json`);
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            const payload: CountryPayload[] = await response.json();
            const allowedCodes = new Set(countryCodesKey.split(','));
            const dialableCodes = new Set<string>(getCountries());
            setCountries(payload
                .filter(({ alpha2Code }) => allowedCodes.has(alpha2Code))
                .map(({ alpha2Code, country }) => ({
                    code: alpha2Code as CountryCode,
                    name: country,
                    callingCode: dialableCodes.has(alpha2Code) ?
                        getCountryCallingCode(alpha2Code as CountryCode) :
                        undefined,
                    flagUri: `${FLAGS_URI}/${alpha2Code.toLowerCase()}.png`
                }))
            );
        } catch (error) {
            console.error('Error fetching countries:', error);
            setCountries([]);
        }
    }, [locale, countryCodesKey]);

    useEffect(() => {
        loadCountries();
    }, [loadCountries]);

    const selectableCountries = useMemo(
        () => isCallingCodes ? countries.filter(({ callingCode }) => !!callingCode) : countries,
        [countries, isCallingCodes]
    );

    const filterCountries = useCallback(async (filter = ''): Promise<Country[]> => {
        if (isEmpty(filter)) {
            return selectableCountries;
        }
        const normalizedFilter = stripAccents(filter.trim().toLowerCase());
        return selectableCountries.filter(({ name }) => stripAccents(name.toLowerCase()).includes(normalizedFilter));
    }, [selectableCountries]);

    return (
        <Autocomplete<Country>
            theme={theme}
            placeholder={placeholder}
            fetchItems={filterCountries}
            autocompleteStyle={autocompleteStyle}
            inputContainerStyle={inputContainerStyle}
            listProps={listProps}
            {...inputProps}
            renderItem={({ item: country }) => (
                <View style={[styles.listItem, listItemStyle]}>
                    <Image
                        source={{ uri: country.flagUri }}
                        style={[styles.flag, flagRounded && styles.flagRounded, flagStyle]}
                    />
                    <Text style={[styles.text, countryStyle]}>
                        {isCallingCodes ? `(+${country.callingCode}) ${country.name}` : country.name}
                    </Text>
                </View>
            )}
            onSelected={({ item }) => onSelected(item)}
        />
    );
}
