import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
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

const ThemeContext = createContext<ThemeContextProps>({
    currentTheme: LightTheme,
    getAppearance: () => LightTheme
});

export const useThemeContext = () => useContext(ThemeContext);

export default function ThemeProvider({ lightTheme = LightTheme, darkTheme = DarkTheme, children }: ThemeProviderProps) {

    const getAppearance = (colorScheme?: ColorSchemeName): Theme => colorScheme === 'dark' ? darkTheme : lightTheme;

    const colorScheme = useColorScheme();

    const [currentTheme, setCurrentTheme] = useState<Theme>(() => getAppearance(colorScheme));

    useEffect(() => {
        if (colorScheme !== currentTheme.schemeName) {
            setCurrentTheme(() => getAppearance(colorScheme));
        }
    }, [colorScheme]);

    return (
        <ThemeContext.Provider value={{ currentTheme, getAppearance }}>
            {children}
        </ThemeContext.Provider>
    );

}