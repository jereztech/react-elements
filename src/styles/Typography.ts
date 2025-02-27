import type { Palette, Typography } from './types';

const fontFamily = 'Roboto, sans-serif, Arial';

export const createTypography = (colors: Palette): Typography => ({
    fontFamily,

    display: {
        small: {
            fontFamily,
            fontSize: 36,
            fontWeight: 400,
            letterSpacing: 0,
            lineHeight: 44,
            color: colors.onSurface
        },
        medium: {
            fontFamily,
            fontSize: 45,
            fontWeight: 400,
            letterSpacing: 0,
            lineHeight: 52,
            color: colors.onSurface
        },
        large: {
            fontFamily,
            fontSize: 57,
            fontWeight: 400,
            letterSpacing: 0,
            lineHeight: 64,
            color: colors.onSurface
        }
    },

    headline: {
        small: {
            fontFamily,
            fontSize: 24,
            fontWeight: 400,
            letterSpacing: 0,
            lineHeight: 32,
            color: colors.onSurface
        },
        medium: {
            fontFamily,
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: 0,
            lineHeight: 36,
            color: colors.onSurface
        },
        large: {
            fontFamily,
            fontSize: 32,
            fontWeight: 400,
            letterSpacing: 0,
            lineHeight: 40,
            color: colors.onSurface
        }
    },

    title: {
        small: {
            fontFamily,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 0.1,
            lineHeight: 20,
            color: colors.onSurface
        },
        medium: {
            fontFamily,
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: 0.15,
            lineHeight: 24,
            color: colors.onSurface
        },
        large: {
            fontFamily,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: 0,
            lineHeight: 28,
            color: colors.onSurface
        }
    },

    body: {
        small: {
            fontFamily,
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: 0.4,
            lineHeight: 16,
            color: colors.onSurface
        },
        medium: {
            fontFamily,
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: 0.25,
            lineHeight: 20,
            color: colors.onSurface
        },
        large: {
            fontFamily,
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: 0.15,
            lineHeight: 24,
            color: colors.onSurface
        }
    },

    label: {
        small: {
            fontFamily,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 0.5,
            lineHeight: 16,
            color: colors.onSurface
        },
        medium: {
            fontFamily,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 0.5,
            lineHeight: 16,
            color: colors.onSurface
        },
        large: {
            fontFamily,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: 0.1,
            lineHeight: 20,
            color: colors.onSurface
        }
    },

});