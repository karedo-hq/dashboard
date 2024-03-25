import { ClientMaritalStatus } from '../types/client-marital-status.type';

export const CLIENT_MARITAL_STATUS_LABELS: Record<ClientMaritalStatus, string> = {
  single: 'Ledig',
  married: 'Verheiratet',
  widowed: 'Verwitwet',
  registeredPartnership: 'Lebenspartnerschaft',
  livingSeparately: 'Getrennt lebend',
  divorced: 'Geschieden',
  partnershipInDissolution: 'Lebensp. in Auflösung',
};
