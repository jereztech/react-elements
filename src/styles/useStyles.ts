import { useMemo } from "react";
import { ColorSchemeName } from "react-native";
import { createStyles } from "./Styles";
import useTheme from "./useTheme";

/**
 * This dynamic hook was created with the hope of being able to change the styles of an individual component without changing the entire context. 
 * Ex: light button on a dark CTA in a light style context.
 * 
 * @param colorScheme 
 */
export default function useStyles(colorScheme?: ColorSchemeName) {
    const theme = useTheme(colorScheme);
    return useMemo(() => createStyles(theme), [theme]);
}