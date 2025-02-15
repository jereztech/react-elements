import { useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { darkTheme, lightTheme, Theme } from "./themes";

const getAppearance = (colorScheme?: ColorSchemeName): Theme => colorScheme === 'dark' ? darkTheme : lightTheme;

export default function useTheme(colorScheme?: ColorSchemeName) {

    const [theme, setTheme] = useState<Theme>(() => getAppearance(colorScheme));

    useEffect(() => {
        const appearance$ = Appearance
            .addChangeListener(({ colorScheme }) => setTheme(getAppearance(colorScheme)));
        return () => appearance$.remove();
    }, []);

    return theme;
}