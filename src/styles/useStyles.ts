import { useMemo } from "react";
import { ColorSchemeName } from "react-native";
import { createStyles } from "./styles";
import useTheme from "./useTheme";

export default function useStyles(colorScheme?: ColorSchemeName) {
    const theme = useTheme(colorScheme);
    return useMemo(() => createStyles(theme), [theme]);
}