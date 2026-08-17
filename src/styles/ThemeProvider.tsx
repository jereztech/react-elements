import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import { DarkTheme } from "./DarkTheme";
import { LightTheme } from "./LightTheme";
import type { Theme } from "./types";

interface ThemeProviderProps extends PropsWithChildren {
    lightTheme?: Theme;
    darkTheme?: Theme;
}

type ThemeContextProps = {
    currentTheme: Theme;
    getAppearance: (colorScheme?: ColorSchemeName) => Theme;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

const getDefaultAppearance = (colorScheme?: ColorSchemeName): Theme =>
    colorScheme === 'dark' ? DarkTheme : LightTheme;

/**
 * Falls back to the built-in themes driven by the system color scheme
 * when the tree is not wrapped in a `ThemeProvider`.
 */
export const useThemeContext = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    const colorScheme = useColorScheme();
    return context ?? {
        currentTheme: getDefaultAppearance(colorScheme),
        getAppearance: getDefaultAppearance
    };
};

export default function ThemeProvider({ lightTheme = LightTheme, darkTheme = DarkTheme, children }: ThemeProviderProps) {

    const colorScheme = useColorScheme();

    const getAppearance = useCallback(
        (scheme?: ColorSchemeName): Theme => scheme === 'dark' ? darkTheme : lightTheme,
        [lightTheme, darkTheme]
    );

    const value = useMemo(
        () => ({ currentTheme: getAppearance(colorScheme), getAppearance }),
        [colorScheme, getAppearance]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );

}
