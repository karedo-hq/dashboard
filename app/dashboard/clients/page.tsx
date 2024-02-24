import { Typography } from '@/components/ui/typography';
import { ClientsTable } from './components/clients-table';
import { clientsCols } from './components/clients-table-cols';
import { findAllClientsAction } from './lib/actions/find-all-clients';
import { parseClientsForTable } from './lib/utils/parse-clients-for-table';

export default async function ClientsPage() {
  const clientsRes = await findAllClientsAction({ limit: 9999999 });

  if (clientsRes.isError || !clientsRes.data) {
    return <section className="flex flex-col space-y-4 p-8">{clientsRes.error?.message}</section>;
  }

  const clients = clientsRes.data;

  return (
    <section className="flex flex-col space-y-4 p-8">
      <Typography as="h1" variant="title3">
        Betreuungen
      </Typography>
      <ClientsTable columns={clientsCols} data={parseClientsForTable(clients)} />
    </section>
  );
}
