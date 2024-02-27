import { TypeOfGuardianship } from '../types/type-of-guardianship.type';

export const TYPE_OF_GUARDIANSHIP_LABELS: Record<TypeOfGuardianship, string> = {
  professionalGuardianship: 'Berufliche Betreuung',
  voluntaryGuardianship: 'Ehrenamtliche Betreuung',
  supplementaryGuardianship: 'Ergänzungspflegschaft',
  estateCustodianship: 'Nachlasspflegschaft',
  contactCustodianship: 'Umgangspflegschaft',
  proceedingsGuardianship: 'Verfahrenspflegschaft',
  proceduralAssistant: 'Verfahrensbeistand',
  executorOfAWill: 'Testamentscollstreckung',
  guardianship: 'Vormundschaft',
  healthcareProxy: 'Vorsorgevollmacht',
};
