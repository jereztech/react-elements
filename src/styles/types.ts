import { ColorSchemeName, TextStyle } from 'react-native';

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