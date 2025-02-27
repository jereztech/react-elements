import { StyleSheet } from "react-native";
import type { Theme } from "./types";

export const BORDER_WIDTH = 1;
export const ICON_SIZE = 24;

export const createStyles = ({ colors, typography, roundness, spacing }: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing
    },
    disabled: {
        opacity: 0.7
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    justified: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: colors.outline,
        borderWidth: BORDER_WIDTH,
        borderRadius: roundness,
        padding: 5,
        height: 54,
        backgroundColor: colors.tertiaryContainer
    },
    inputText: {
        flex: 1,
        paddingLeft: 10,
        fontSize: typography.title.small.fontSize,
        color: colors.onTertiaryContainer,
    },
    inputIcon: {
        marginHorizontal: spacing,
        fontSize: typography.title.large.fontSize,
        color: colors.outline,
    },
    error: {
        borderColor: colors.error,
        color: colors.error,
    },
    focused: {
        borderColor: colors.onTertiaryContainer,
    },
    text: {
        ...typography.body.medium,
    },
    list: {
        marginTop: spacing,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing - 4,
        paddingVertical: spacing
    },
    flag: {
        width: 32,
        height: 20,
        marginHorizontal: spacing,
        resizeMode: 'cover',
        borderColor: colors.outline,
        borderWidth: BORDER_WIDTH,
        borderRadius: roundness,
    },
    flagRounded: {
        width: 30,
        height: 30,
        borderRadius: 35,
    },
});