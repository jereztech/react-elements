import { LightColors, LightTheme } from "./LightTheme";
import type { Palette, Theme } from "./types";
import { createTypography } from "./Typography";

export const DarkColors: Palette = {
    ...LightColors,
    secondaryContainer: '#1d1f06',
    onSecondaryContainer: '#bbbaa6',
    tertiaryContainer: '#0e130c',
    onTertiaryContainer: '#b4b7af',
    surface: '#141314',
    surfaceContainer: '#211f21',
    onSurface: '#e3e3e3',
    onSurfaceVariant: '#454558',
    inverseSurface: '#e6e1e5',
    inverseOnSurface: '#313033',
    outline: '#938f99',
    outlineVariant: '#49454f',
};

export const DarkTheme: Theme = {
    ...LightTheme,
    schemeName: "dark",
    colors: DarkColors,
    typography: createTypography(DarkColors),
}