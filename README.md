# @jereztech/react-elements

[![NPM Version](https://img.shields.io/npm/v/@jereztech/react-elements.svg)](https://www.npmjs.com/package/@jereztech/react-elements)
[![GPL License](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

React Native component library that provides a set of highly customizable and easy-to-use UI components. This library provides utilities to manage theming (light/dark) in your application. It integrates smoothly with React’s native color scheme APIs (`useColorScheme`) so that components can respond automatically to system appearance changes, *even without explicitly wrapping your app* in a `ThemeProvider`.

## Getting Started

To install the package, run:

```bash
npm install @jereztech/react-elements
# or
yarn add @jereztech/react-elements
```

## ThemeProvider

**Usage**:
```tsx
import { ThemeProvider } from '@jereztech/react-elements';
import { LightTheme, DarkTheme } from './your-themes-path';

export default function RootLayout() {

    return (
        <ThemeProvider lightTheme={LightTheme} darkTheme={DarkTheme}>
            <Slot />
        </ThemeProvider>
    );

}
```

- `lightTheme` *(optional)*: The theme object representing Light Mode. Defaults to `LightTheme` if not provided.
- `darkTheme` *(optional)*: The theme object representing Dark Mode. Defaults to `DarkTheme` if not provided.
- `children`: The child components that will have access to the theme context.

### Important Note
Wrapping your app with `ThemeProvider` is **not mandatory**. All core library components already listen to React’s appearance change events via `useColorScheme` under the hood. The `ThemeProvider` exists if you want to override or customize these themes globally.

## Dynamic Hooks

### `useTheme(colorScheme?: ColorSchemeName)`

Returns a `Theme` object. If you pass a `colorScheme` argument (`"light"` or `"dark"`), it will force the returned theme to that scheme instead of using the globally provided one. This is useful when you want a specific component to always render in a certain color scheme, regardless of the device or global theme context settings.

- **Example**:
```tsx
import { View, Text } from 'react-native';
import { useTheme } from '@jereztech/react-elements';

const BlackCta = () => {
    // Force this CTA to always use the dark theme
    const theme = useTheme('dark');

    return (
        <View style={{ backgroundColor: theme.colors.background }}>
            <Button>Press me</Button>
        </View>
    );
};

export default BlackCta;
```

### `useStyles(colorScheme?: ColorSchemeName)`

A convenience hook that retrieves styles with dynamic `Theme`.

- **Example**:
```tsx
import { View, Text, StyleSheet } from 'react-native';
import { useStyles } from '@jereztech/react-elements';

const ThemedButton = () => {
    // Optionally override to "dark" to always have a dark-themed button
    const styles = useStyles('dark');

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Dark Mode Button</Text>
        </View>
    );
};

export default ThemedButton;
```

## Theme Type Definitions

Below are the core type definitions used by the library for describing a theme. You can customize or extend these for more detailed theming in your application.

```ts
/**
 * Material-based colors.
 * 
 * @see https://m3.material.io/styles/color/roles
 */
export type Palette = {
    primary: string;
    onPrimary: string;
    primaryContainer?: string;
    onPrimaryContainer?: string;
    secondary?: string;
    onSecondary?: string;
    secondaryContainer?: string;
    onSecondaryContainer?: string;
    tertiary?: string;
    onTertiary?: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    error: string;
    onError: string;
    errorContainer?: string;
    onErrorContainer?: string;
    surface: string;
    surfaceContainer?: string;
    onSurface: string;
    onSurfaceVariant?: string;
    inverseSurface?: string;
    inverseOnSurface?: string;
    inversePrimary?: string;
    outline: string;
    outlineVariant?: string;
}

export type TypographyScale = 'small' | 'medium' | 'large';

export type Typography = {
    fontFamily: string;
    display?: {
        [scale in TypographyScale]: TextStyle;
    };
    headline?: {
        [scale in TypographyScale]: TextStyle;
    };
    title?: {
        [scale in TypographyScale]: TextStyle;
    };
    label: {
        [scale in TypographyScale]: TextStyle;
    };
    body: {
        [scale in TypographyScale]: TextStyle;
    };
}

export type Theme = {
    schemeName: ColorSchemeName;
    roundness: number;
    boldness: number;
    spacing: number;
    breakpoints: {
        small: number;
        medium: number;
    },
    colors: Palette;
    typography: Typography;
    mixin: (factor: number) => number;
}
```

- `Palette`: Contains color properties for different UI elements (primary, surface, etc.).
- `Typography`: Contains fonts, sizes, and weights for text rendering.
- `Theme`: The main interface that combines color palette, typography, layout metrics, and other design tokens.

## Components

### [Autocomplete](./src/components/autocomplete/Autocomplete.md)
A generic autocomplete component that fetches and displays suggestions dynamically as the user types. It supports custom rendering of suggestion items, theming, and style overrides.

### [CountrySelector](./src/components/country-selector/CountrySelector.md)
A specialized autocomplete component for selecting countries. It allows filtering by ISO country codes, supports locale-based translations, and offers customizable display options for country flags and text.

### [LanguageSwitcher](./src/components/language-switcher/LanguageSwitcher.md)
An autocomplete component for switching languages. It supports two variants—native and localized—to display languages in their native or localized forms. Customizable flag display and list styling options are provided.

### [PhoneInput](./src/components/phone-input/PhoneInput.md)
A phone number input component that integrates with Google's libphonenumber library to format and validate phone numbers according to international standards. It supports customizable styles and callback functions for handling phone number validation on blur.

## License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

Copyright (C) 2025 [Jerez Tech](https://jereztech.com)