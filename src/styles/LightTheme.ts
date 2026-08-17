import { Colors } from "./Colors";
import type { Palette, Theme } from "./types";
import { createTypography } from "./Typography";

export const LightColors: Palette = {
    primary: Colors.primary700,
    onPrimary: Colors.white,
    primaryContainer: Colors.primary50,
    onPrimaryContainer: Colors.primary900,
    secondary: Colors.gray700,
    onSecondary: Colors.white,
    secondaryContainer: Colors.gray100,
    onSecondaryContainer: Colors.gray900,
    tertiary: Colors.gray600,
    onTertiary: Colors.white,
    tertiaryContainer: Colors.white,
    onTertiaryContainer: Colors.gray900,
    error: Colors.error700,
    onError: Colors.white,
    errorContainer: Colors.error50,
    onErrorContainer: Colors.error900,
    surface: Colors.white,
    surfaceContainer: Colors.gray50,
    onSurface: Colors.gray900,
    onSurfaceVariant: Colors.gray500,
    inverseSurface: Colors.gray900,
    inverseOnSurface: Colors.gray50,
    inversePrimary: Colors.primary400,
    outline: Colors.gray300,
    outlineVariant: Colors.gray200,
    backdrop: Colors.gray950
};

export const LightTheme: Theme = {
    schemeName: "light",
    roundness: 8,
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
