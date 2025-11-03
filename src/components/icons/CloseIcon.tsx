import { StyleProp, Text, TextStyle } from "react-native";

interface CloseIconProps {
    style: StyleProp<TextStyle>;
}

export function CloseIcon({ style }: CloseIconProps) {
    return <Text style={style}>✕</Text>;
}
