import parsePhoneNumberFromString, {
    AsYouType,
    CountryCode,
    getExampleNumber,
    isPossiblePhoneNumber,
    isValidPhoneNumber,
    PhoneNumber
} from 'libphonenumber-js';

import examples from 'libphonenumber-js/mobile/examples';
import { ComponentType, PropsWithChildren, useEffect, useRef } from 'react';
import {
    ColorSchemeName,
    Image,
    ImageStyle,
    Modal,
    SafeAreaView,
    StyleProp,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { IconProps } from 'react-native-vector-icons/Icon';
import { useMutableState } from '../../hooks';
import { useStyles, useTheme } from '../../styles';
import { DEFAULT_COUNTRY, DEFAULT_LOCALE, FLAGS_URI } from '../../utils';
import CountrySelector, { Country } from '../country-selector/CountrySelector';

interface CountrySelectorWrapperProps extends PropsWithChildren {
    /**
     * Callback to close the Modal.
     */
    onDismiss?: () => void;
}

interface PhoneInputProps extends TextInputProps {
    /**
     * The user's preferred color scheme ("light" | "dark").
     */
    theme?: ColorSchemeName;
    /**
     * The fallback CountryCode.
     */
    defaultCountry?: CountryCode;
    /**
     * Locale for country translations.
     */
    locale?: string;
    /**
     * If false, disable TextInput.
     */
    editable?: boolean;
    /**
     * Optional props for the Icon.
     */
    iconProps?: Partial<IconProps>;
    /**
     * If true, the country flags will be displayed in a circle shape.
     */
    flagRounded?: boolean;
    /**
     * Overrides the flag style.
     */
    flagStyle?: StyleProp<ImageStyle>;
    /**
     * Overrides the TextInput container style.
     */
    inputContainerStyle?: StyleProp<ViewStyle>;
    /**
     * Overrides the Modal container style.
     */
    modalStyle?: StyleProp<ViewStyle>;
    /**
     * An optional wrapper component for the CountrySelector. 
     * Defaults to SafeAreaView.    
     */
    CountrySelectorWrapper?: ComponentType<CountrySelectorWrapperProps>;
    /**
     * Custom placeholder for the CountrySelector.    
     */
    countryPlaceholder?: string;
    /**
     * The controlled phone input value.
     */
    value?: string;
    /**
     * Returns the phone number in `PhoneNumber` format.
     */
    onChangeValue?: (phoneNumber?: PhoneNumber) => void;
}

type PhoneInputState = {
    country: Country | null;
    displayValue: string;
    phoneNumberValid: boolean;
    exampleNumber: string | null;
    showCallingCodes: boolean;
    focused: boolean;
}

export default function PhoneInput({
    theme: appearance,
    defaultCountry = DEFAULT_COUNTRY,
    locale = DEFAULT_LOCALE,
    placeholder = 'Phone Number',
    editable = true,
    iconProps,
    flagStyle,
    flagRounded = false,
    inputContainerStyle,
    modalStyle,
    CountrySelectorWrapper,
    countryPlaceholder,
    style,
    value = '',
    onChangeValue,
    onChangeText,
    onBlur,
    ...inputProps
}: PhoneInputProps) {

    const styles = useStyles(appearance);
    const theme = useTheme(appearance);

    const formatterRef = useRef<AsYouType>(new AsYouType(defaultCountry));
    const inputRef = useRef<TextInput>(null);

    const [state, setState] = useMutableState<PhoneInputState>({
        country: null,
        displayValue: '',
        phoneNumberValid: true,
        showCallingCodes: false,
        exampleNumber: null,
        focused: false,
    });

    useEffect(() => {
        if (isPossiblePhoneNumber(value, defaultCountry)) {
            const phoneNumber = parsePhoneNumberFromString(value, defaultCountry);
            if (phoneNumber) {
                const countryCode = phoneNumber.country || defaultCountry;
                setState({
                    country: {
                        code: countryCode,
                        callingCode: phoneNumber.countryCallingCode,
                        flagUri: `${FLAGS_URI}/${countryCode.toLowerCase()}.png`
                    } as Country,
                    displayValue: phoneNumber.formatNational()
                });
            }
        }
    }, [value]);

    useEffect(() => {
        if (state.country) {
            const countryCode = state.country.code;
            const exampleNumber = getExampleNumber(countryCode, examples);
            setState({ exampleNumber: exampleNumber?.formatNational(), focused: true });
            formatterRef.current = new AsYouType(countryCode);
            formatterRef.current.reset();
            inputRef.current?.focus();
        }
    }, [state.country]);

    const handleAsYouType = (input: string) => {
        formatterRef.current.reset();
        /**
         * This is a workaround for an AsYouType quirk where, if a user attempts to delete the closing parenthesis using backspace, 
         * the formatter re-inserts it.
         */
        const displayValue = formatterRef.current.input(
            (input.length < state.displayValue.length && state.displayValue.endsWith(')')) ?
                input.slice(0, -1) :
                input
        );
        setState({ displayValue, phoneNumberValid: true, focused: !!displayValue });
        onChangeValue?.(formatterRef.current.getNumber());
        onChangeText?.(displayValue);
    }

    const handleBlur = (e: any) => {
        const e164Number = formatterRef.current.getNumberValue();
        const phoneNumberValid = e164Number && isValidPhoneNumber(e164Number);
        setState({ focused: false, phoneNumberValid });
        onBlur?.(e);
    }

    const CountrySelectorContainer = CountrySelectorWrapper || SafeAreaView;

    return (
        <View>
            <View style={[
                styles.inputContainer,
                state.focused && styles.focused,
                !state.phoneNumberValid && styles.error,
                inputContainerStyle
            ]}>
                <TouchableOpacity
                    disabled={!editable}
                    onPress={() => setState({ showCallingCodes: true })}
                >
                    {state.country ?
                        <View style={styles.row}>
                            <Image
                                source={{ uri: state.country.flagUri }}
                                style={[styles.flag, flagRounded && styles.flagRounded, flagStyle]}
                            />
                            <Text style={styles.text}>
                                +{state.country.callingCode}
                            </Text>
                        </View> :
                        <Icon name="phone" {...iconProps} style={[styles.inputIcon, iconProps?.style]} />
                    }
                </TouchableOpacity>
                <TextInput
                    placeholder={state.exampleNumber || placeholder}
                    placeholderTextColor={state.exampleNumber ?
                        theme.colors.onSurfaceVariant :
                        styles.inputText.color
                    }
                    {...inputProps}
                    style={[styles.inputText, style]}
                    ref={inputRef}
                    keyboardType="phone-pad"
                    value={state.displayValue}
                    maxLength={state.exampleNumber?.length}
                    editable={editable && !!state.country}
                    onChangeText={handleAsYouType}
                    onBlur={handleBlur}
                />
            </View>
            <Modal
                visible={state.showCallingCodes}
                animationType="slide"
                style={[{ backgroundColor: theme.colors.surface }, modalStyle]}
            >
                <CountrySelectorContainer
                    style={styles.container}
                    onDismiss={() => setState({ showCallingCodes: false })}
                >
                    <CountrySelector
                        locale={locale}
                        theme={appearance}
                        flagRounded={flagRounded}
                        variant="callingCodes"
                        placeholder={countryPlaceholder}
                        onSelected={(country: Country) => setState({ country, showCallingCodes: false })}
                    />
                </CountrySelectorContainer>
            </Modal>
        </View>
    );
};
