import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientDetailsHeader from '../../components/clients-details-header';
import { findClientAction } from '../../lib/actions/find-client';
import {
  ClientGeneralInfoCard,
  ClientExtendedInfoCard,
} from '../../components/client-profile-cards';

type ClientDetailsPageProps = {
  params: {
    id: string;
  };
};

export default async function ClientDetailsPage(props: ClientDetailsPageProps) {
  const { id } = props.params;

  const { data, isError, errorMessage } = await findClientAction(id);

  if (isError) {
    return <div>Error: {errorMessage}</div>;
  }

  const client = data;

  return (
    <section className="flex flex-col">
      <ClientDetailsHeader client={client} />
      <Tabs defaultValue="profile" className="p-8 pt-0">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="profile">Persönlich</TabsTrigger>
          <TabsTrigger value="guardianship">Betreuung</TabsTrigger>
          <TabsTrigger value="health">Gesundheit</TabsTrigger>
          <TabsTrigger value="residence">Aufenthalt</TabsTrigger>
          <TabsTrigger value="wealth">Vermögen</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ClientGeneralInfoCard client={client} />
          <ClientExtendedInfoCard client={client} />
        </TabsContent>
        <TabsContent value="guardianship">Make changes to your account here.</TabsContent>
        <TabsContent value="health">Make changes to your account here.</TabsContent>
        <TabsContent value="residence">Make changes to your account here.</TabsContent>
        <TabsContent value="wealth">Make changes to your account here.</TabsContent>
      </Tabs>
    </section>
  );
}
