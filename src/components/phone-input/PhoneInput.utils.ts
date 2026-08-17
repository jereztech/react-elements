import { CountryCallingCode, CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { FLAGS_URI } from '../../utils';
import { Country } from '../country-selector/CountrySelector';

export function toCountry(countryCode: CountryCode, callingCode?: CountryCallingCode): Country {
    return {
        code: countryCode,
        name: countryCode,
        callingCode: callingCode ?? getCountryCallingCode(countryCode),
        flagUri: `${FLAGS_URI}/${countryCode.toLowerCase()}.png`
    };
}
