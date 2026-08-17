import { ColorSchemeName } from "react-native";
import { useThemeContext } from "./ThemeProvider";
import type { Theme } from "./types";

/**
 * Returns the active theme, or the theme for `colorScheme` when given.
 * Useful to pin a single component to a scheme (e.g. a dark CTA inside a light screen).
 */
export default function useTheme(colorScheme?: ColorSchemeName): Theme {
    const { currentTheme, getAppearance } = useThemeContext();
    return colorScheme ? getAppearance(colorScheme) : currentTheme;
}
