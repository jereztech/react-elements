import type { Config } from 'jest';

const config: Config = {
    preset: 'react-native',
    collectCoverage: true,
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                babelConfig: true
            }
        ]
    },
    testMatch: ['**/*.test.{ts,tsx}'],
    transformIgnorePatterns: [
        'node_modules/(?!(@react-native|react-native|react-native-vector-icons))'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
