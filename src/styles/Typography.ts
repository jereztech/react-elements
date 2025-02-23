import type { Palette, Typography } from './types';

const fontFamily = 'Roboto, sans-serif, Arial';

export const createTypography = (colors: Palette): Typography => ({
    fontFamily,

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

    body: {
        small: {
            fontFamily,
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: 0.4,
            lineHeight: 16,
            color: colors.onSurfaceVariant
        },
        medium: {
            fontFamily,
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: 0.25,
            lineHeight: 20,
            color: colors.onSurfaceVariant
        },
        large: {
            fontFamily,
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: 0.15,
            lineHeight: 24,
            color: colors.onSurfaceVariant
        }
    },
});