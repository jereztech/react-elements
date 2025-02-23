import { Colors } from "./Colors";
import type { Palette, Theme } from "./types";
import { createTypography } from "./Typography";

export const LightColors: Palette = {
    primary: Colors.black,
    onPrimary: Colors.white,
    tertiaryContainer: '#f1ecf3',
    onTertiaryContainer: '#4b4850',
    error: '#ab2d25',
    onError: Colors.white,
    surface: '#f2f2f7',
    onSurface: '#29272c',
    onSurfaceVariant: '#85858b',
    outline: '#aaaaaa',
    outlineVariant: Colors.black,
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
