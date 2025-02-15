import React, { useEffect, useRef } from 'react';
import {
    ColorSchemeName,
    FlatList,
    FlatListProps,
    StyleProp,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { IconProps } from 'react-native-vector-icons/Icon';
import { Subject, from, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { useMutableState } from '../../hooks';
import { useStyles, useTheme } from '../../styles';
import { isEmpty } from '../../utils';

export interface AutocompleteItem<T> {
    item: T;
    index: number;
}

export interface AutocompleteComponentProps<T> {
    /**
     * the user's preferred color scheme (e.g. Dark Mode)
     */
    theme?: ColorSchemeName;
    /**
     * Placeholder text for the TextInput.
     */
    placeholder?: string;
    /**
     * Overrides the Autocomplete style.
     */
    autocompleteStyle?: StyleProp<ViewStyle>;
    /**
     * Overrides the TextInput container style.
     */
    inputContainerStyle?: StyleProp<ViewStyle>;
    /**
     * Overrides the TextInput props.
     */
    inputProps?: Partial<TextInputProps>;
    /**
     * Overrides the FlatList props.
     */
    listProps?: Partial<FlatListProps<T>>;
    /**
     * Overrides the Icon props.
     */
    iconProps?: Partial<IconProps>;
}

interface AutocompleteProps<T> extends AutocompleteComponentProps<T> {
    /**
     * Function to fetch items given a search filter.
     */
    fetchItems: (filter?: string) => Promise<T[]>;
    /**
     * Render function for each item.
     */
    renderItem: (item: AutocompleteItem<T>) => React.ReactElement;
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
    filteredItems: Array<T>;
    items: Array<T>;
}

export default function Autocomplete<T>({
    theme: appearance,
    fetchItems,
    renderItem,
    debounceTime: timeframe = 300,
    onSelected,
    placeholder = 'Type to search...',
    autocompleteStyle,
    inputContainerStyle,
    inputProps,
    iconProps,
    listProps,
}: AutocompleteProps<T>) {

    const styles = useStyles(appearance);
    const theme = useTheme(appearance);

    const [state, setState] = useMutableState<AutocompleteState<T>>({
        filter: '',
        items: [],
        filteredItems: []
    });

    const input$ = useRef(new Subject<string>()).current;

    useEffect(() => {
        // For better user experience, do an initial load to display it in the component.
        fetchItems()
            .then(items => setState({ items, filteredItems: items }))
            .catch(console.error);
    }, [fetchItems]);

    useEffect(() => {
        const subscription = input$.pipe(
            debounceTime(timeframe),
            distinctUntilChanged(),
            switchMap(filter => isEmpty(filter) ?
                of([...state.items]) :
                from(fetchItems(filter.trim())).pipe(catchError(error => {
                    console.error('Error fetching filtered items:', error);
                    return of([]);
                }))
            )
        ).subscribe(filteredItems => setState({ filteredItems }));
        return () => {
            subscription.unsubscribe();
        };
    }, [timeframe, fetchItems, input$]);

    const handleClear = () => {
        const filter = '';
        setState({ filter, filteredItems: [...state.items] });
        input$.next(filter);
    };

    return (
        <View style={[styles.container, autocompleteStyle]}>
            <View style={[styles.inputContainer, inputContainerStyle]}>
                <Icon name="search" style={styles.icon} {...iconProps} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={theme.text}
                    autoCapitalize='none'
                    autoCorrect={false}
                    autoFocus
                    {...inputProps}
                    value={state.filter}
                    onChangeText={(filter: string) => {
                        setState({ filter });
                        input$.next(filter);
                    }}
                />
                {!!state.filter.length && (
                    <TouchableOpacity onPress={handleClear}>
                        <Icon name="close" style={styles.icon} {...iconProps} />
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.list}
                {...listProps}
                data={state.filteredItems}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        key={`item-${index}`}
                        onPress={() => {
                            onSelected && onSelected({ item, index });
                            handleClear();
                        }}
                    >
                        {renderItem({ item, index })}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
