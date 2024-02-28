import { CreatableSelectOption } from '@/components/ui/creatable-select';

export const SCOPE_OF_DUTIES_OPTIONS: CreatableSelectOption[] = [
  { value: 'financialMatters', label: 'Vermögensangelegenheiten' },
  { value: 'healthcare', label: 'Gesundheitsfürsorge' },
  { value: 'housingMatters', label: 'Wohnungsangelegenheiten' },
  { value: 'determinationOfResidence', label: 'Aufenthaltsbestimmung' },
  { value: 'handlingAndOpeningMail', label: 'Anhalten und Öffnen der Post' },
  {
    value: 'decisionsOnTelecommunications',
    label: 'Entscheidung über Telekommunikation und elektronische Kommunikation',
  },
  { value: 'representationToAuthorities', label: 'Vertretung gegenüber Behörden' },
  { value: 'accommodationOfTheWard', label: 'Unterbringung des Betreuten' },
  { value: 'deprivationOfLibertyMeasures', label: 'Freiheitsentziehende Maßnahmen' },
  {
    value: 'determiningUsualResidenceAbroad',
    label: 'Bestimmung des gewöhnlichen Aufenthalt im Ausland',
  },
  { value: 'determiningContact', label: 'Bestimmung des Umgangs' },
];
