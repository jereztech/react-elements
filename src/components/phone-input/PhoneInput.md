# PhoneInput Component

The `PhoneInput` component provides a user-friendly interface for entering and validating phone numbers. It leverages Google's libphonenumber library to format and validate phone numbers according to the international (ISO) standard. This ensures that the phone numbers entered are correctly formatted and valid.

## Overview

The `PhoneInput` component allows you to:
- Specify a fallback country code.
- Set a locale for country translations.
- Customize the appearance of the input field and flag icons.
- Validate and format phone numbers automatically on blur (when the input loses focus).

## Usage Example

Below is an example of how to integrate the `PhoneInput` component into your application:

```tsx
import React from 'react';
import PhoneInput from '@jereztech/react-elements';

export default function App() {
  return (
    <PhoneInput
      locale={locale}
      onBlur={console.log}
    />
  );
}
```

## Props

The following table outlines the props available for the `PhoneInput` component:

| Field                 | Type                                  | Default | Description                                                                                                                  |
|-----------------------|---------------------------------------|---------|------------------------------------------------------------------------------------------------------------------------------|
| `theme`               | `ColorSchemeName`                     | `'light'`  | The user's preferred color scheme (e.g. Dark Mode).                                                                         |
| `defaultCountry`      | `CountryCode`                         | `'US'`  | The fallback CountryCode used when no country is selected.                                                                  |
| `locale`              | `string`                              | `'en-US'`  | Locale for country translations.                                                                                           |
| `placeholder`         | `string`                              | `'Phone Number'`  | Placeholder text for the TextInput.                                                                                        |
| `editable`            | `boolean`                             | `'true'`  | If false, disables the TextInput.                                                                                          |
| `iconProps`           | `Partial<IconProps>`                  | _None_  | Optional props to customize the Icon.                                                                                      |
| `flagRounded`         | `boolean`                             | `'false'`  | If true, displays the country flags in a circular shape.                                                                   |
| `flagStyle`           | `StyleProp<ImageStyle>`               | _None_  | Overrides the default style for the flag image.                                                                            |
| `onBlur`              | `Function => void` | _None_  | Callback triggered when the input loses focus. The function receives the formatted phone number (or `undefined` if invalid). |
| `inputContainerStyle` | `StyleProp<ViewStyle>`                | _None_  | Overrides the container style for the TextInput.                                                                           |
| `inputProps`          | `Partial<TextInputProps>`             | _None_  | Overrides the default props for the TextInput.                                                                             |

## Demo

<div style="display: flex; justify-content: space-between; align-items: center;">
  <img src="../../assets/images/demo/phone-light.png" style="width: 48%;"/>
  <img src="../../assets/images/demo/phone-dark.png" style="width: 48%;"/>
</div>

## License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](../../../LICENSE) file for details.

Copyright (C) 2025 [Jerez Tech](https://jereztech.com)