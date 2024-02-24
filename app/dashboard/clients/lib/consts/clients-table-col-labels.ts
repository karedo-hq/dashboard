import { ClientTableColKey } from '../types/clients-table-col-keys';

export const CLIENTS_TABLE_COL_LABELS: Record<ClientTableColKey, string> = {
  fullname: 'Betreute Person',
  guardianshipStartedAt: 'Betreuungsbeginn',
  guardianshipEndedAt: 'Betreuungsende',
  livingArrangement: 'Aufenthalt',
  wealthStatus: 'Vermögensstatus',
  status: 'Status',
};
