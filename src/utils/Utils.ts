
// Useful for unmasking phone or identification numbers.
export const unmaskNumber = (value: string) => value?.replace(/\D/g, '');

/**
 * Mask a phone number by keeping the first 3 digits, the last 2 digits, 
 * and replacing everything in-between with asterisks.
 *
 * @example "7861234567" => "786***4567"
 */
export function maskPhoneNumber(phone: string) {
    const digits = phone.replace(/\D/g, '');

    if (digits.length <= 5) {
        return digits;
    }

    const firstPart = digits.slice(0, 3);
    const lastPart = digits.slice(-2);
    const middleLength = digits.length - 5;
    const masked = '*'.repeat(middleLength);

    return firstPart + masked + lastPart;
}

/**
 * Mask an email by keeping the first and last character of the local part (before the '@'), 
 * masking the middle characters. The domain remains unchanged.
 *
 * @example "alex@email.com" => "a**x@email.com"
 */
export function maskEmail(email: string) {
    const [local, domain] = email.split('@');
    if (!domain) {
        return email;
    }

    if (local.length <= 2) {
        const first = local.slice(0, 1);
        const restLen = local.length - 1;
        const masked = '*'.repeat(restLen);
        return first + masked + '@' + domain;
    } else {
        const first = local.slice(0, 1);
        const last = local.slice(-1);
        const middleLen = local.length - 2;
        const masked = '*'.repeat(middleLen);
        return first + masked + last + '@' + domain;
    }
}

/**
 * Removes accents (diacritics) from a string.
 */
export function stripAccents(input: string) {
    return input.normalize('NFD').replace(/\p{M}/gu, '');
}

export function normalizeLocale(locale: string) {
    const [language, countryCode] = locale.replace('_', '-').split('-');
    return /^(?=[a-zA-Z]).{2}$/.test(countryCode) ? `${language}-${countryCode.toUpperCase()}` : language;
}
