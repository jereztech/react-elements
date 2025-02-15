
const SEQ_NUMBERS = '0123456789012345789';
const STRONG_PASSWORD_PATTERN = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!#$%&()*+-./;<>?@[\]_{|}~\\])(?=\S+).{8,20}/;
const EMAIL_PATTERN = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export const validateUrl = (url: string) => url.startsWith('https://') && /(?=\S+).{3,}/.test(url);

export const validateImageUri = (uri: string) => validateUrl(uri) && /^.*\.(png|jpg|jpeg|bmp|gif)$/.test(uri);

export const validatePersonName = (name: string) => isNotEmpty(name) && /^([a-zÀ-ƒ]+\s?[a-zÀ-ƒ]+)+$/i.test(name);

export const validateOrganizationName = (organizationName: string) => isNotEmpty(organizationName)
    && /^([a-zÀ-ƒ]+\s?[a-zÀ-ƒ]+)+(\s?([a-zA-Z]+(\/|\.){0,1})+)*$/i.test(organizationName);

export const validatePassword = (password: string, pattern: RegExp = STRONG_PASSWORD_PATTERN) =>
    isNotEmpty(password) && pattern.test(password);

export const validateEmail = (email: string, pattern: RegExp = EMAIL_PATTERN) =>
    isNotEmpty(email) && pattern.test(email);

export const validateOtp = (verificationCode: string) => isNotSequencedOrRepeated(verificationCode)
    && /^(?=[0-9]).{6}$/.test(verificationCode);

export const isNotSequencedOrRepeated = (string: string) => !isEmpty(string)
    && !SEQ_NUMBERS.includes(string) && !/^(.*)\1+$/.test(string);

export const isEmpty = (string: string) => !string || string.trim().length === 0;

export const isNotEmpty = (string: string) => !isEmpty(string);

export const allBlanks = (strings: string[]) => strings.every(item => isEmpty(item));

export const allNotBlank = (strings: string[]) => strings.every(item => isNotEmpty(item));

export const anyBlanks = (strings: string[]) => strings.some(item => isEmpty(item));

export const isNumber = (value: string) => !isEmpty(value) && !isNaN(+value);

export const isCountryIso = (countryCode: string) => countryCode && /^(?=[A-Z]).{2}$/.test(countryCode);
