import { useMemo } from "react";
import { ColorSchemeName } from "react-native";
import { createStyles } from "./styles";
import useTheme from "./useTheme";

/**
 * Returns the shared stylesheet built from the active theme,
 * or from the theme for `colorScheme` when given.
 */
export default function useStyles(colorScheme?: ColorSchemeName) {
    const theme = useTheme(colorScheme);
    return useMemo(() => createStyles(theme), [theme]);
}
