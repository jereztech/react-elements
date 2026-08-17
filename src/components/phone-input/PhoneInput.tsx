import parsePhoneNumberFromString, {
    AsYouType,
    CountryCode,
    getExampleNumber,
    isPossiblePhoneNumber,
    isValidPhoneNumber,
    PhoneNumber
} from 'libphonenumber-js';

import examples from 'libphonenumber-js/mobile/examples';
import { ComponentType, PropsWithChildren, ReactNode, useEffect, useRef } from 'react';
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

import { useMutableState } from '../../hooks';
import { useStyles, useTheme } from '../../styles';
import { DEFAULT_COUNTRY, DEFAULT_LOCALE } from '../../utils';
import CountrySelector, { Country } from '../country-selector/CountrySelector';
import { CloseIcon, PhoneIcon } from '../icons';
import { toCountry } from './PhoneInput.utils';

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
     * The CountryCode preselected on mount, until the user picks another one.
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
    /**
     * Render prop to replace the default input container with a custom component.
     * Receives all internal state and handlers needed to build the phone input UI.
     */
    renderInput?: (props: RenderPhoneInputProps) => ReactNode;
}

export interface RenderPhoneInputProps {
    /** The formatted display value (e.g. "(555) 123-4567") */
    value: string;
    /** Effective placeholder — example number when country is set, otherwise `placeholder` prop */
    placeholder: string;
    /** True only when a country has been selected */
    editable: boolean;
    /** Max character length derived from the country's example number */
    maxLength?: number;
    /** Currently selected country, or null */
    country: Country | null;
    /** False when the entered number fails E.164 validation on blur */
    isValid: boolean;
    isFocused: boolean;
    onChangeText: (text: string) => void;
    onBlur: (e: any) => void;
    /** Opens the country selector modal */
    onFlagPress: () => void;
    /** Clears the selected country and phone number */
    onClear: () => void;
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
    defaultCountry,
    locale = DEFAULT_LOCALE,
    placeholder = 'Phone Number',
    editable = true,
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
    renderInput,
    ...inputProps
}: PhoneInputProps) {

    const styles = useStyles(appearance);
    const theme = useTheme(appearance);

    const formatterRef = useRef<AsYouType>(new AsYouType(defaultCountry ?? DEFAULT_COUNTRY));
    const countryTouchedRef = useRef(false);

    const [state, setState] = useMutableState<PhoneInputState>({
        country: null,
        displayValue: '',
        phoneNumberValid: true,
        showCallingCodes: false,
        exampleNumber: null,
        focused: false,
    });

    useEffect(() => {
        if (isPossiblePhoneNumber(value)) {
            const phoneNumber = parsePhoneNumberFromString(value);
            if (phoneNumber) {
                const countryCode = phoneNumber.country || defaultCountry || DEFAULT_COUNTRY;
                setState({
                    country: toCountry(countryCode, phoneNumber.countryCallingCode),
                    displayValue: phoneNumber.formatNational()
                });
            }
            return;
        }
        if (defaultCountry && !countryTouchedRef.current) {
            setState({ country: toCountry(defaultCountry) });
        }
    }, [value, defaultCountry, setState]);

    useEffect(() => {
        if (state.country) {
            const countryCode = state.country.code;
            const exampleNumber = getExampleNumber(countryCode, examples);
            setState({ exampleNumber: exampleNumber?.formatNational() ?? null });
            formatterRef.current = new AsYouType(countryCode);
        }
    }, [state.country, setState]);

    const handleAsYouType = (input: string) => {
        formatterRef.current.reset();
        // Workaround for an AsYouType quirk: deleting the closing parenthesis with
        // backspace makes the formatter re-insert it, so drop one more character.
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
        const phoneNumberValid = !e164Number || isValidPhoneNumber(e164Number);
        setState({ focused: false, phoneNumberValid });
        onBlur?.(e);
    }

    const handleSelectCountry = (country: Country) => {
        countryTouchedRef.current = true;
        setState({ country, showCallingCodes: false });
    }

    const handleClear = () => {
        const displayValue = '';
        countryTouchedRef.current = true;
        setState({
            country: null,
            exampleNumber: null,
            displayValue,
            phoneNumberValid: true,
            focused: false
        });
        onChangeValue?.(undefined);
        onChangeText?.(displayValue);
    }

    const CountrySelectorContainer = CountrySelectorWrapper || SafeAreaView;

    const countrySelectorModal = (
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
                    onSelected={handleSelectCountry}
                />
            </CountrySelectorContainer>
        </Modal>
    );

    if (renderInput) {
        return (
            <>
                {renderInput({
                    value: state.displayValue,
                    placeholder: state.exampleNumber || placeholder,
                    editable: editable && !!state.country,
                    maxLength: state.exampleNumber?.length,
                    country: state.country,
                    isValid: state.phoneNumberValid,
                    isFocused: state.focused,
                    onChangeText: handleAsYouType,
                    onBlur: handleBlur,
                    onFlagPress: () => setState({ showCallingCodes: true }),
                    onClear: handleClear,
                })}
                {countrySelectorModal}
            </>
        );
    }

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
                    style={styles.touchableOpacity}
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
                        <PhoneIcon style={styles.inputIcon} />
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
                    keyboardType="phone-pad"
                    value={state.displayValue}
                    maxLength={state.exampleNumber?.length}
                    editable={editable && !!state.country}
                    onChangeText={handleAsYouType}
                    onBlur={handleBlur}
                />
                {!!state.country && (
                    <TouchableOpacity testID="clear-button" style={styles.touchableOpacity} onPress={handleClear}>
                        <CloseIcon style={styles.inputIcon} />
                    </TouchableOpacity>
                )}
            </View>
            {countrySelectorModal}
        </View>
    );
}
