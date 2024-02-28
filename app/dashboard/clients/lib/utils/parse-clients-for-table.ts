import { Client } from '../types/client.type';

export type ParsedClientForTable = Client & {
  fullname: string;
};

export function parseClientsForTable(clients: Client[]): ParsedClientForTable[] {
  return clients.map((client) => ({
    ...client,
    fullname: `${client.firstname} ${client.lastname}`,
  }));
}
