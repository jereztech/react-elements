import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import Autocomplete, { AutocompleteItem } from './Autocomplete';

const sampleItems = ['apple', 'banana', 'cherry'];

describe('Autocomplete Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

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

    const renderItem = ({ item, index }: AutocompleteItem<string>) => (
        <Text testID={`item-${index}`}>{item}</Text>
    );

    it('should perform an initial fetch on mount and render items', async () => {
        const { queryByTestId } = render(
            <Autocomplete<string>
                fetchItems={fetchItemsMock}
                onSelected={onSelectedMock}
                renderItem={renderItem}
            />
        );

        await waitFor(() => expect(fetchItemsMock).toHaveBeenCalledWith(undefined));

        sampleItems.forEach((_, index) => {
            expect(queryByTestId(`item-${index}`)).toBeTruthy();
        });
    });

    it('should call fetchItems when input text changes after debounce time', async () => {
        const { getByPlaceholderText } = render(
            <Autocomplete<string>
                fetchItems={fetchItemsMock}
                onSelected={onSelectedMock}
                renderItem={renderItem}
            />
        );

        const input = getByPlaceholderText('Type to search...');
        fireEvent.changeText(input, 'app');
        jest.advanceTimersByTime(300);

        await waitFor(() => expect(fetchItemsMock).toHaveBeenCalledWith('app'));
    });

    it('should clear input and reset filtered items when an item is selected', async () => {
        const { getByPlaceholderText, getByTestId } = render(
            <Autocomplete<string>
                fetchItems={fetchItemsMock}
                onSelected={onSelectedMock}
                renderItem={renderItem}
            />
        );

        const input = getByPlaceholderText('Type to search...');
        fireEvent.changeText(input, 'ban');
        jest.advanceTimersByTime(300);

        await waitFor(() => expect(fetchItemsMock).toHaveBeenCalledWith('ban'));

        const firstItemTouchable = getByTestId('item-0');
        fireEvent.press(firstItemTouchable);

        await waitFor(() =>
            expect(onSelectedMock).toHaveBeenCalledWith({ item: expect.any(String), index: 0 })
        );

        expect(input.props.value).toBe('');
    });

    it('should call onSelected when a list item is pressed', async () => {
        const { getByTestId } = render(
            <Autocomplete<string>
                fetchItems={fetchItemsMock}
                onSelected={onSelectedMock}
                renderItem={renderItem}
            />
        );

        await waitFor(() => expect(fetchItemsMock).toHaveBeenCalled());

        const listItemTouchable = getByTestId('item-0');
        fireEvent.press(listItemTouchable);

        await waitFor(() =>
            expect(onSelectedMock).toHaveBeenCalledWith({ item: expect.any(String), index: 0 })
        );
    });
});
