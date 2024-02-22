import { findAllClientsAction } from './lib/actions/find-all-clients';

export default async function ClientsPage() {
  const clientsRes = await findAllClientsAction();

  if (clientsRes.isError || !clientsRes.data) {
    return <div>Something went wrong</div>;
  }

  const clients = clientsRes.data;

  return (
    <section>
      {clients.map((client) => (
        <div key={client._id}>{client.firstname}</div>
      ))}
    </section>
  );
}
