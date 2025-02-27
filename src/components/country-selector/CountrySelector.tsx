import { CountryCallingCode, CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { useCallback, useEffect, useState } from 'react';
import { Image, ImageStyle, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useStyles } from '../../styles';
import { DEFAULT_LOCALE, isEmpty, stripAccents } from '../../utils';
import Autocomplete, { AutocompleteComponentProps } from '../autocomplete/Autocomplete';

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

interface CountrySelectorProps extends AutocompleteComponentProps<Country> {
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

const COUNTRIES_URI = 'https://raw.githubusercontent.com/jereztech/react-elements/refs/heads/main/src/assets/api/countries/translations';

const FLAGS_URI = 'https://raw.githubusercontent.com/jereztech/react-elements/refs/heads/main/src/assets/images/flags/w80';

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
    iconProps,
    listProps,
    listItemStyle,
    countryStyle,
    ...inputProps
}: CountrySelectorProps) {

    const styles = useStyles(theme);

    const [countries, setCountries] = useState<Country[]>([]);

    const isCallingCodes = variant === 'callingCodes';

    const loadCountries = useCallback(async () => {
        const data = await fetch(`${COUNTRIES_URI}/${locale.replace('-', '_')}.json`)
            .then(response => response.json())
            .catch(console.error);
        const countries = data
            .filter(({ alpha2Code }: CountryPayload) => countryCodes.includes(alpha2Code))
            .map(({ alpha2Code: code, country: name }: CountryPayload) => ({
                code,
                name,
                callingCode: getCountryCallingCode(code as CountryCode),
                flagUri: `${FLAGS_URI}/${code.toLowerCase()}.png`
            } as Country));
        setCountries(countries);
    }, [locale]);

    useEffect(() => {
        loadCountries();
    }, [locale, loadCountries]);

    const filterCountries = async (filter = ''): Promise<Country[]> => {
        if (isEmpty(filter)) {
            return countries;
        }
        return countries.filter(({ name }) => stripAccents(name.toLowerCase())
            .includes(stripAccents(filter.trim().toLowerCase()))
        );
    };

    return (
        <Autocomplete<Country>
            theme={theme}
            placeholder={placeholder}
            fetchItems={filterCountries}
            autocompleteStyle={autocompleteStyle}
            inputContainerStyle={inputContainerStyle}
            iconProps={iconProps}
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
