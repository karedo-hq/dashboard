import { CreatableSelectOption } from '@/components/ui/creatable-select';
import { COUNTRIES_DATA } from './countries-data';

export const COUNTRIES_OPTIONS: CreatableSelectOption[] = COUNTRIES_DATA.map((country) => ({
  value: country.iso2,
  label: `${country.emoji} ${country.translations.de || country.name}`,
}));
