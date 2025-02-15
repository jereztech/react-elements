export default interface Theme {
    accent: string;
    background: string;
    error: string;
    outline: string;
    placeholder: string;
    text: string;
    input: string;
};

export const lightTheme: Theme = {
    accent: '#000',
    background: '#fff',
    error: '#b3261e',
    outline: '#aaa',
    placeholder: '#ccc',
    text: '#49454f',
    input: '#f2f2f2'
};

export const darkTheme: Theme = {
    accent: '#fff',
    background: '#1b1b1d',
    error: '#b3261e',
    outline: '#888888',
    placeholder: '#aaa',
    text: '#e3e3e3',
    input: '#090a10'
};