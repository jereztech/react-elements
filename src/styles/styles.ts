import { StyleSheet } from "react-native";
import type { Theme } from "./types";

export const BORDER_WIDTH = 1;
export const ICON_SIZE = 20;

export const createStyles = ({ colors, typography, roundness, spacing }: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing,
        backgroundColor: 'transparent',
    },
    disabled: {
        opacity: 0.4
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
        paddingHorizontal: 12,
        paddingVertical: 8,
        height: 44,
        backgroundColor: colors.surface,
    },
    inputText: {
        flex: 1,
        paddingLeft: 8,
        fontSize: typography.body.medium.fontSize,
        color: colors.onSurface,
        outlineWidth: 0,
        outlineColor: 'transparent',
    },
    inputIcon: {
        marginHorizontal: 4,
        fontSize: ICON_SIZE,
        color: colors.onSurfaceVariant,
    },
    error: {
        borderColor: colors.error,
        borderWidth: BORDER_WIDTH,
    },
    focused: {
        borderColor: colors.primary,
        borderWidth: BORDER_WIDTH,
    },
    text: {
        ...typography.body.medium,
        color: colors.onSurface,
    },
    list: {
        marginTop: spacing,
        backgroundColor: 'transparent',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: BORDER_WIDTH,
        borderBottomColor: colors.outlineVariant,
    },
    flag: {
        width: 32,
        height: 20,
        marginHorizontal: 8,
        resizeMode: 'cover',
        borderColor: colors.outlineVariant,
        borderWidth: 0.5,
        borderRadius: 4,
    },
    flagRounded: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    touchableOpacity: {
        outlineWidth: 0,
        outlineColor: 'transparent',
    },
    currencyCode: {
        minWidth: 44,
        marginHorizontal: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: colors.surfaceContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },
    currencyCodeText: {
        ...typography.body.medium,
        fontWeight: '700',
        color: colors.onSurfaceVariant,
    },
});
