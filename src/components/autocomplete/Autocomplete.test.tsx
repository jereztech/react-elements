import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import Autocomplete, { AutocompleteItem } from './Autocomplete';

const sampleItems = ['apple', 'banana', 'cherry'];

const fetchItemsMock = jest.fn((filter?: string) => {
    if (!filter) {
        return Promise.resolve(sampleItems);
    }
    const filtered = sampleItems.filter(item =>
        item.toLowerCase().includes(filter.toLowerCase().trim())
    );
    return Promise.resolve(filtered);
});

const onSelectedMock = jest.fn();

// The Pressable wrapping each row already owns `item-<index>`, so rows use a distinct testID.
const renderItem = ({ item, index }: AutocompleteItem<string>) => (
    <Text testID={`label-${index}`}>{item}</Text>
);

const renderAutocomplete = () => render(
    <Autocomplete<string>
        fetchItems={fetchItemsMock}
        onSelected={onSelectedMock}
        renderItem={renderItem}
    />
);

const advanceDebounce = async () => {
    await act(async () => {
        jest.advanceTimersByTime(300);
    });
};

describe('Autocomplete Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('should perform an initial fetch on mount and render items', async () => {
        const { queryByTestId } = renderAutocomplete();

        await waitFor(() => expect(fetchItemsMock).toHaveBeenCalledWith());

        sampleItems.forEach((_, index) => {
            expect(queryByTestId(`label-${index}`)).toBeTruthy();
        });
    });

    it('should call fetchItems when input text changes after debounce time', async () => {
        const { getByPlaceholderText } = renderAutocomplete();

        fireEvent.changeText(getByPlaceholderText('Type to search...'), 'app');
        await advanceDebounce();

        await waitFor(() => expect(fetchItemsMock).toHaveBeenCalledWith('app'));
    });

    it('should clear input and reset filtered items when an item is selected', async () => {
        const { getByPlaceholderText, getByTestId, queryByTestId } = renderAutocomplete();

        const input = getByPlaceholderText('Type to search...');
        fireEvent.changeText(input, 'ban');
        await advanceDebounce();

        await waitFor(() => expect(getByTestId('label-0')).toHaveTextContent('banana'));

        fireEvent.press(getByTestId('item-0'));

        expect(input.props.value).toBe('');
        await waitFor(() => expect(queryByTestId('label-2')).toBeTruthy());
    });

    it('should call onSelected when a list item is pressed', async () => {
        const { getByTestId } = renderAutocomplete();

        await waitFor(() => expect(getByTestId('label-0')).toBeTruthy());

        fireEvent.press(getByTestId('item-0'));

        await waitFor(() =>
            expect(onSelectedMock).toHaveBeenCalledWith({ item: 'apple', index: 0 })
        );
    });
});
