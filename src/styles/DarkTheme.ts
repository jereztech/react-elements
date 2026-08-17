import { Colors } from "./Colors";
import { LightTheme } from "./LightTheme";
import type { Palette, Theme } from "./types";
import { createTypography } from "./Typography";

export const DarkColors: Palette = {
    primary: Colors.primary400,
    onPrimary: Colors.gray950,
    primaryContainer: Colors.primary900,
    onPrimaryContainer: Colors.primary100,
    secondary: Colors.gray300,
    onSecondary: Colors.gray950,
    secondaryContainer: Colors.gray800,
    onSecondaryContainer: Colors.gray100,
    tertiary: Colors.gray400,
    onTertiary: Colors.gray950,
    tertiaryContainer: Colors.gray900,
    onTertiaryContainer: Colors.gray100,
    error: Colors.error400,
    onError: Colors.gray950,
    errorContainer: Colors.error900,
    onErrorContainer: Colors.error100,
    surface: Colors.gray950,
    surfaceContainer: Colors.gray900,
    onSurface: Colors.gray100,
    onSurfaceVariant: Colors.gray400,
    inverseSurface: Colors.gray100,
    inverseOnSurface: Colors.gray900,
    inversePrimary: Colors.primary700,
    outline: Colors.gray700,
    outlineVariant: Colors.gray800,
    backdrop: Colors.gray950
};

export const DarkTheme: Theme = {
    ...LightTheme,
    schemeName: "dark",
    colors: DarkColors,
    typography: createTypography(DarkColors),
}