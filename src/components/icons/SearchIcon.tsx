import { StyleProp, Text, TextStyle } from "react-native";

interface SearchIconProps {
    style: StyleProp<TextStyle>;
}

export function SearchIcon({ style }: SearchIconProps) {
    return <Text style={style}>🔍</Text>;
}
