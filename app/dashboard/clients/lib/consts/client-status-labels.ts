import { ClientStatus } from '../types/client-status.type';

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: 'Aktiv',
  inactive: 'Inaktiv',
  deleted: 'Gelösscht',
};
