import { Colors } from "./Colors";
import { LightTheme } from "./LightTheme";
import type { Palette, Theme } from "./types";
import { createTypography } from "./Typography";

export const DarkColors: Palette = {
    primary: Colors.white,
    onPrimary: Colors.black,
    tertiaryContainer: '#0e131c',
    onTertiaryContainer: '#b4b7af',
    error: '#ab2d25',
    onError: Colors.white,
    surface: '#0d0d08',
    onSurface: '#d6d8d3',
    onSurfaceVariant: '#8d8d93',
    outline: '#555555',
    outlineVariant: Colors.white,
};

export const DarkTheme: Theme = {
    ...LightTheme,
    schemeName: "dark",
    colors: DarkColors,
    typography: createTypography(DarkColors),
}