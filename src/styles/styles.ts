import { StyleSheet } from 'react-native';
import Theme from './themes';

const margin = 12;
const roundness = 4;
const fontSize = 16;
const borderWidth = 1;

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        margin,
        flex: 1,
        backgroundColor: theme.background
    },
    flexGrow: {
        flex: 1,
        backgroundColor: theme.background
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: theme.outline,
        borderWidth,
        borderRadius: roundness,
        backgroundColor: theme.input,
        padding: 8,
        height: 50,
    },
    input: {
        color: theme.text,
        fontSize,
        paddingLeft: 10,
        flex: 1,
    },
    error: {
        borderColor: theme.error,
        color: theme.error,
    },
    focused: {
        borderColor: theme.accent,
    },
    icon: {
        marginHorizontal: margin,
        color: theme.text,
        fontSize: 20,
    },
    text: {
        color: theme.text,
        fontSize,
    },
    list: {
        marginTop: margin,
        backgroundColor: theme.background
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: margin
    },
    flag: {
        width: 32,
        height: 20,
        marginRight: margin,
        resizeMode: 'cover',
        borderColor: theme.outline,
        borderWidth,
        borderRadius: 2,
    },
    flagRounded: {
        width: 30,
        height: 30,
        borderRadius: fontSize,
    },
});
