const SEQ_NUMBERS = '01234567890123456789';
const STRONG_PASSWORD_PATTERN = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!#$%&()*+,\-./;<>?@[\]_{|}~\\])\S{8,20}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
const PERSON_NAME_PATTERN = /^[a-zÀ-ƒ]{2,}(?:[\s'-][a-zÀ-ƒ]+)*$/i;
const ORGANIZATION_NAME_PATTERN = /^[a-zÀ-ƒ0-9]{2,}(?:[\s&./'-][a-zÀ-ƒ0-9]+)*\.?$/i;
const IMAGE_URI_PATTERN = /\.(png|jpg|jpeg|bmp|gif)$/i;

export const isEmpty = (string?: string) => !string || string.trim().length === 0;

export const isNotEmpty = (string?: string) => !isEmpty(string);

export const validateUrl = (url?: string) => !!url && /^https:\/\/\S+$/.test(url);

export const validateImageUri = (uri?: string) => validateUrl(uri) && IMAGE_URI_PATTERN.test(uri!);

export const validatePersonName = (name?: string) => isNotEmpty(name) && PERSON_NAME_PATTERN.test(name!);

export const validateOrganizationName = (organizationName?: string) =>
    isNotEmpty(organizationName) && ORGANIZATION_NAME_PATTERN.test(organizationName!);

export const validatePassword = (password?: string, pattern: RegExp = STRONG_PASSWORD_PATTERN) =>
    isNotEmpty(password) && pattern.test(password!);

export const validateEmail = (email?: string, pattern: RegExp = EMAIL_PATTERN) =>
    isNotEmpty(email) && pattern.test(email!);

export const validateOtp = (verificationCode?: string) => isNotEmpty(verificationCode) && /^\d{6}$/.test(verificationCode!);

export const isNotSequencedOrRepeated = (string?: string) => isNotEmpty(string)
    && !SEQ_NUMBERS.includes(string!)
    && !/^(.+)\1+$/.test(string!);

export const allBlanks = (strings: string[] = []) => strings.every(item => isEmpty(item));

export const allNotBlank = (strings: string[] = []) => strings.every(item => isNotEmpty(item));

export const anyBlanks = (strings: string[] = []) => strings.some(item => isEmpty(item));

export const isNumber = (value?: string) => isNotEmpty(value) && !isNaN(Number(value));

export const isCountryIso = (countryCode?: string) => !!countryCode && /^[A-Z]{2}$/.test(countryCode);
