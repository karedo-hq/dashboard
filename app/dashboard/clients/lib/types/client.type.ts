import { LivingArrangements } from './living-arragements.type';
import { TypeOfGuardianship } from './type-of-guardianship.type';
import { UserGender } from './user-gender.type';
import { WealthStatus } from './wealth-status.type';

export type Client = {
  _id: string;
  guardianId: string;
  gender: UserGender;
  title?: string;
  firstname: string;
  lastname: string;
  birthday: string;
  avatar?: string;
  localCourt?: string;
  courtRefNumber?: string;
  scopeOfDuties?: string[];
  guardianshipStartedAt: string;
  guardianshipEndedAt?: string;
  livingArrangement?: LivingArrangements;
  wealthStatus?: WealthStatus;
  typeOfGuardianship?: TypeOfGuardianship;
  isGuardianshipTakenOver: boolean;
  prevGuardianType?: string;
  prevGuardianshipStartedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  status: 'active' | 'inactive' | 'deleted';
};
