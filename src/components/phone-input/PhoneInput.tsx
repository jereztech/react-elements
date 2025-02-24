import { AsYouType, CountryCode, E164Number, getExampleNumber, isValidPhoneNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { ComponentType, PropsWithChildren, useEffect, useRef, useState } from 'react';
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
import { DEFAULT_COUNTRY, DEFAULT_LOCALE } from '../../utils';
import CountrySelector, { Country } from '../country-selector/CountrySelector';

interface CountrySelectorWrapperProps extends PropsWithChildren {
    /**
     * Callback to close the Modal.
     */
    onDismiss?: () => void;
}

interface PhoneInputProps extends TextInputProps {
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
     * An optional wrapper component to render inside the Modal for the CountrySelector. 
     * Defaults to SafeAreaView.    
     */
    CountrySelectorWrapper?: ComponentType<CountrySelectorWrapperProps>;
    /**
     * Validates and returns the phone number in international format when loses focus.
     */
    onValidate: (phoneNumber: E164Number | undefined) => void;
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
    onValidate,
    ...inputProps
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
        inputProps?.onChangeText && inputProps.onChangeText(phoneNumber);
    }

    const handleBlur = (e: any) => {
        const numberValue = formatter.getNumberValue();
        const phoneNumberValid = numberValue && isValidPhoneNumber(numberValue);
        setState({ focused: false, phoneNumberValid });
        onValidate(numberValue);
        inputProps?.onBlur && inputProps.onBlur(e);
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
                    style={[styles.inputText, inputProps?.style]}
                    ref={inputRef}
                    keyboardType="phone-pad"
                    value={state.phoneNumber}
                    maxLength={state.exampleNumber?.length}
                    editable={editable && !!state.country}
                    onChangeText={handleChange}
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
                        onSelected={(country: Country) => setState({
                            country,
                            phoneNumber: '',
                            showCallingCodes: false
                        })}
                    />
                </CountrySelectorContainer>
            </Modal>
        </View>
    );
};
