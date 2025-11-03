import { StyleProp, Text, TextStyle } from "react-native";

interface PhoneIconProps {
    style: StyleProp<TextStyle>;
}

export function PhoneIcon({ style }: PhoneIconProps) {
    return <Text style={style}>📞</Text>;
}
