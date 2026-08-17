export const unmaskNumber = (value: string) => value.replace(/\D/g, '');

/**
 * Mask a phone number by keeping the first 3 digits, the last 2 digits,
 * and replacing everything in-between with asterisks.
 *
 * @example "7861234567" => "786*****67"
 */
export function maskPhoneNumber(phone: string) {
    const digits = unmaskNumber(phone);

    if (digits.length <= 5) {
        return digits;
    }

    return digits.slice(0, 3) + '*'.repeat(digits.length - 5) + digits.slice(-2);
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
        return local.slice(0, 1) + '*'.repeat(local.length - 1) + '@' + domain;
    }

    return local.slice(0, 1) + '*'.repeat(local.length - 2) + local.slice(-1) + '@' + domain;
}

/**
 * Removes accents (diacritics) from a string.
 */
export function stripAccents(input: string) {
    return input.normalize('NFD').replace(/\p{M}/gu, '');
}

/**
 * Normalizes a locale to the `language` or `language-COUNTRY` form.
 *
 * @example "pt_br" => "pt-BR", "zh_Hans" => "zh"
 */
export function normalizeLocale(locale: string) {
    const [language, countryCode] = locale.replace('_', '-').split('-');
    return /^[a-zA-Z]{2}$/.test(countryCode ?? '') ? `${language}-${countryCode.toUpperCase()}` : language;
}
