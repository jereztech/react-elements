import { AsYouType, CountryCode, E164Number, getExampleNumber, isValidPhoneNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import React, { useEffect, useRef, useState } from 'react';
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
import CountrySelector, { Country } from '../country-selector/CountrySelector';

interface PhoneInputProps {
    /**
     * the user's preferred color scheme (e.g. Dark Mode)
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
     * Placeholder text for the TextInput.
     */
    placeholder?: string;
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
     * Callback when loses focus. Validates and returns the phone number in international format.
     */
    onBlur: (phoneNumber: E164Number | undefined) => void;
    /**
     * Overrides the TextInput container style.
     */
    inputContainerStyle?: StyleProp<ViewStyle>;
    /**
     * Overrides the TextInput props.
     */
    inputProps?: Partial<TextInputProps>;
}

type PhoneInputState = {
    country: Country | null;
    phoneNumber: string;
    phoneNumberValid: boolean;
    exampleNumber: string | null;
    showCallingCodes: boolean;
    focused: boolean;
}

export default function PhoneInput({
    theme: appearance,
    defaultCountry = 'US',
    locale = 'en-US',
    placeholder = 'Phone Number',
    editable = true,
    iconProps,
    flagStyle,
    flagRounded = false,
    onBlur,
    inputContainerStyle,
    inputProps,
}: PhoneInputProps) {

    const styles = useStyles(appearance);
    const theme = useTheme(appearance);

    const [countryCode, setCountryCode] = useState<CountryCode>(defaultCountry);

    const formatter = new AsYouType(countryCode);

    const [state, setState] = useMutableState<PhoneInputState>({
        country: null,
        phoneNumber: '',
        phoneNumberValid: true,
        showCallingCodes: false,
        exampleNumber: null,
        focused: false,
    });

    const inputRef = useRef<any>(null);

    useEffect(() => {
        if (state.country) {
            const countryCode = state.country.code;
            const exampleNumber = getExampleNumber(countryCode, examples);
            setCountryCode(countryCode);
            setState({
                exampleNumber: exampleNumber?.formatNational(),
                focused: true,
                phoneNumberValid: true
            });
            formatter.reset();
            inputRef.current?.focus();
        }
    }, [state.country]);

    const handleChange = (input: string) => {
        // Workaround for an AsYouType issue: if the user tries to delete the ')' with the backspace key, AsYouType puts it back.
        const phoneNumber = formatter.input(
            (input.length < state.phoneNumber.length && state.phoneNumber.endsWith(')')) ?
                input.slice(0, -1) :
                input
        );
        setState({ phoneNumber, phoneNumberValid: true, focused: true });
    }

    return (
        <View style={styles.flexGrow}>
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
                        <View style={styles.flexRow}>
                            <Image
                                source={{ uri: state.country.flagUri }}
                                style={[styles.flag, flagRounded && styles.flagRounded, flagStyle]}
                            />
                            <Text style={styles.text}>
                                +{state.country.callingCode}
                            </Text>
                        </View> :
                        <Icon name="phone" style={styles.icon} {...iconProps} />
                    }
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder={state.exampleNumber || placeholder}
                    placeholderTextColor={state.exampleNumber ? theme.placeholder : theme.text}
                    {...inputProps}
                    ref={inputRef}
                    keyboardType="phone-pad"
                    value={state.phoneNumber}
                    maxLength={state.exampleNumber?.length}
                    editable={editable && !!state.country}
                    onChangeText={handleChange}
                    onBlur={() => {
                        const numberValue = formatter.getNumberValue();
                        const phoneNumberValid = numberValue && isValidPhoneNumber(numberValue);
                        setState({ focused: false, phoneNumberValid });
                        onBlur(numberValue);
                    }}
                />
            </View>
            <Modal
                visible={state.showCallingCodes}
                animationType="slide"
                style={{ backgroundColor: theme.background }}
            >
                <SafeAreaView style={styles.flexGrow}>
                    <CountrySelector
                        locale={locale}
                        theme={appearance}
                        flagRounded={flagRounded}
                        variant="callingCodes"
                        onSelected={(country: Country) => setState({
                            country,
                            phoneNumber: '',
                            showCallingCodes: false
                        })}
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
};
