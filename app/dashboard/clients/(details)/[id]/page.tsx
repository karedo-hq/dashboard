import { findClientAction } from '../../lib/actions/find-client';

type ClientDetailsPageProps = {
  params: {
    id: string;
  };
};

export default async function ClientDetailsPage(props: ClientDetailsPageProps) {
  const { id } = props.params;

  const { isError, error, data } = await findClientAction(id);

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return <div>Client details for ID: {JSON.stringify(data)}</div>;
}
