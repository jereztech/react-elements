import { ReactElement, useEffect, useRef } from 'react';
import {
    ColorSchemeName,
    ColorValue,
    FlatList,
    FlatListProps,
    Pressable,
    StyleProp,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

import { Subject, from, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { useMutableState } from '../../hooks';
import { useStyles, useTheme } from '../../styles';
import { isEmpty } from '../../utils';

export type AutocompleteItem<T> = {
    item: T;
    index: number;
}

export interface AutocompleteInputProps<T> extends TextInputProps {
    /**
     * The user's preferred color scheme ("light" | "dark").
     */
    theme?: ColorSchemeName;
    /**
     * Overrides the Autocomplete container style.
     */
    autocompleteStyle?: StyleProp<ViewStyle>;
    /**
     * Overrides the input row container style (the box wrapping the icons + TextInput).
     */
    inputContainerStyle?: StyleProp<ViewStyle>;
    /**
     * Overrides the TextInput text style.
     */
    inputStyle?: StyleProp<TextStyle>;
    /**
     * Overrides the placeholder text color.
     */
    placeholderTextColor?: ColorValue;
    /**
     * Optional element rendered on the left side of the input.
     */
    leftIcon?: ReactElement | null;
    /**
     * Optional element rendered on the right side of the input when there is text.
     * Pressing it clears the filter.
     */
    rightIcon?: ReactElement | null;
    /**
     * Overrides the FlatList props.
     */
    listProps?: Partial<FlatListProps<T>>;
    /**
     * Overrides the FlatList style.
     */
    listStyle?: StyleProp<ViewStyle>;
    /**
     * Allows the host component to render its own TextInput.
     */
    renderInput?: (props: TextInputProps) => ReactElement;
}

interface AutocompleteProps<T> extends AutocompleteInputProps<T> {
    /**
     * Function to fetch items given a search filter.
     * Memoize it, otherwise the initial load runs on every render.
     */
    fetchItems: (filter?: string) => Promise<T[]>;
    /**
     * Render function for each item.
     */
    renderItem: (item: AutocompleteItem<T>) => ReactElement;
    /**
     * Optional debounce time (in milliseconds) for user input.
     */
    debounceTime?: number;
    /**
     * Callback when an item is selected.
     */
    onSelected: (selectedItem: AutocompleteItem<T>) => void;
}

type AutocompleteState<T> = {
    filter: string;
    filteredItems: T[];
}

const DEFAULT_DEBOUNCE_TIME = 300;

export default function Autocomplete<T>({
    theme: appearance,
    fetchItems,
    renderItem,
    debounceTime: timeframe = DEFAULT_DEBOUNCE_TIME,
    onSelected,
    placeholder = 'Type to search...',
    placeholderTextColor,
    autocompleteStyle,
    inputContainerStyle,
    inputStyle,
    leftIcon = null,
    rightIcon = null,
    listProps,
    listStyle,
    renderInput,
    ...inputProps
}: AutocompleteProps<T>) {

    const styles = useStyles(appearance);
    const theme = useTheme(appearance);

    const [state, setState] = useMutableState<AutocompleteState<T>>({
        filter: '',
        filteredItems: []
    });

    const input$ = useRef(new Subject<string>()).current;
    const itemsRef = useRef<T[]>([]);

    useEffect(() => {
        let cancelled = false;
        fetchItems()
            .then(items => {
                if (cancelled) return;
                itemsRef.current = items;
                setState({ filteredItems: items });
            })
            .catch(error => console.error('Error fetching items:', error));
        return () => {
            cancelled = true;
        };
    }, [fetchItems, setState]);

    useEffect(() => {
        const subscription = input$.pipe(
            debounceTime(timeframe),
            distinctUntilChanged(),
            switchMap(filter => isEmpty(filter) ?
                of(itemsRef.current) :
                from(fetchItems(filter.trim())).pipe(catchError(error => {
                    console.error('Error fetching filtered items:', error);
                    return of<T[]>([]);
                }))
            )
        ).subscribe(filteredItems => setState({ filteredItems }));
        return () => {
            subscription.unsubscribe();
        };
    }, [timeframe, fetchItems, input$, setState]);

    const handleClear = () => {
        const filter = '';
        setState({ filter, filteredItems: itemsRef.current });
        input$.next(filter);
    };

    const textInputProps: TextInputProps = {
        placeholder,
        placeholderTextColor: placeholderTextColor ?? theme.colors.onSurfaceVariant,
        autoCapitalize: 'none',
        autoCorrect: false,
        autoFocus: true,
        ...inputProps,
        style: [styles.inputText, inputStyle, inputProps.style],
        value: state.filter,
        onChangeText: (filter: string) => {
            setState({ filter });
            input$.next(filter);
            inputProps.onChangeText?.(filter);
        },
    };

    return (
        <View style={[styles.container, autocompleteStyle]}>
            <View style={[styles.inputContainer, inputContainerStyle]}>
                {leftIcon}
                {renderInput ? renderInput(textInputProps) : <TextInput {...textInputProps} />}
                {!!state.filter.length && rightIcon && (
                    <Pressable testID="clear-button" onPress={handleClear}>
                        {rightIcon}
                    </Pressable>
                )}
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                {...listProps}
                data={state.filteredItems}
                style={[styles.list, listStyle, listProps?.style]}
                renderItem={({ item, index }) => (
                    <Pressable
                        testID={`item-${index}`}
                        onPress={() => {
                            onSelected?.({ item, index });
                            handleClear();
                        }}
                    >
                        {renderItem({ item, index })}
                    </Pressable>
                )}
            />
        </View>
    );
}
