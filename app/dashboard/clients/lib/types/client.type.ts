import { ClientCareLevel } from './client-care-level.type';
import { ClientLevelOfDisability } from './client-level-of-disability.type';
import { ClientMaritalStatus } from './client-marital-status.type';
import { ClientReligion } from './client-religion.types';
import { ClientStatus } from './client-status.type';
import { LivingArrangement } from './living-arrangements.type';
import { PrevGuardianType } from './prev-guardian-type.types';
import { TypeOfGuardianship } from './type-of-guardianship.type';
import { UserGender } from './user-gender.type';
import { WealthStatus } from './wealth-status.type';

export type Client = {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  // General info:
  status: ClientStatus;
  gender: UserGender;
  title?: string;
  firstname: string;
  lastname: string;
  birthday: Date;
  deathday?: Date;
  avatar?: string;
  // Extended info:
  maritalStatus?: ClientMaritalStatus;
  maritalStatusStartedAt?: Date;
  numberOfChildren?: number;
  isSingleParent?: boolean;
  birthname?: string;
  citizenship?: string;
  countryOfBirth?: string;
  cityOfBirth?: string;
  additionalCitizenship?: string;
  religion?: ClientReligion;
  taxId?: string;
  // Contact info:
  street?: string;
  streetNo?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  fax?: string;
  isAlternativeAddressActive?: boolean;
  alternativeStreet?: string;
  alternativeStreetNo?: string;
  alternativePostalCode?: string;
  alternativeCity?: string;
  // Guardianship info:
  guardianId: string;
  localCourt?: string;
  caseNumber?: string;
  scopeOfDuties?: string[];
  guardianshipStartedAt: Date;
  reasonOfGuardianship?: string;
  guardianshipEndedAt?: Date;
  wealthStatus?: WealthStatus;
  typeOfGuardianship?: TypeOfGuardianship;
  isGuardianshipTakenOver: boolean;
  prevGuardianType?: PrevGuardianType;
  prevGuardianshipStartedAt?: Date;
  reasonOfEndingGuardianship?: string;
  // Health info:
  diagnosis?: string;
  levelOfDisability?: ClientLevelOfDisability;
  disabilityRecognizedAt?: Date;
  severeDisabilityMark?: string;
  careLevel?: ClientCareLevel;
  careLevelRecognizedAt?: Date;
  isLivingWillAvailable?: boolean;
  contentOfLivingWill?: string;
  // Residence info:
  livingArrangements: LivingArrangement[];
};
