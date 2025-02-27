import { useCallback } from "react";
import { ColorSchemeName } from "react-native";
import { useThemeContext } from "./ThemeProvider";
import type { Theme } from "./types";

/**
 * This dynamic hook was created with the hope of being able to change the styles of an individual component without changing the entire context. 
 * Ex: light button on a dark CTA in a light style context or to force 'light' if 'dark' is not supported.
 * 
 * @param colorScheme 
 */
export default function useTheme(colorScheme?: ColorSchemeName): Theme {

    const { currentTheme, getAppearance } = useThemeContext();

    const getTheme = useCallback(() => {
        return !!colorScheme ? getAppearance(colorScheme) : currentTheme;
    }, [colorScheme, currentTheme]);

    return getTheme();
}