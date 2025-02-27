import { Colors } from "./Colors";
import type { Palette, Theme } from "./types";
import { createTypography } from "./Typography";

export const LightColors: Palette = {
    primary: Colors.black,
    onPrimary: Colors.white,
    primaryContainer: '#00000080',
    onPrimaryContainer: '#ffffff80',
    secondary: '#5d5d70',
    onSecondary: Colors.white,
    secondaryContainer: '#e1e0f7',
    onSecondaryContainer: '#444557',
    tertiary: '#1f4e4e',
    onTertiary: '#71f7f9',
    tertiaryContainer: '#f6f8fa',
    onTertiaryContainer: '#4b4850',
    error: '#ab2d25',
    onError: Colors.white,
    errorContainer: '#f9dbd7',
    onErrorContainer: '#743029',
    surface: '#f2f2f7',
    surfaceContainer: '#f1ecf3',
    onSurface: '#1d1b20',
    onSurfaceVariant: '#85858b',
    inverseSurface: '#312f35',
    inverseOnSurface: '#f4eff6',
    inversePrimary: Colors.teal,
    outline: '#aaaaaa',
    outlineVariant: '#cac4cf',
};

export const LightTheme: Theme = {
    schemeName: "light",
    roundness: 2,
    boldness: 400,
    spacing: 12,
    breakpoints: {
        small: 360,
        medium: 768
    },
    colors: LightColors,
    typography: createTypography(LightColors),
    mixin: (factor: number) => factor * 8,
};
