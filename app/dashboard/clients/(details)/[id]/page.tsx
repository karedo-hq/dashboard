import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientDetailsHeader from '@/dashboard/clients/components/clients-details-header';
import { findClientAction } from '@/dashboard/clients/lib/actions/find-client';
import {
  UpdateClientGeneralInfoForm,
  UpdateClientExtendedInfoForm,
  UpdateClientContactForm,
} from '@/dashboard/clients/components/update-client-profile-forms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdateClientHealthInfoForm } from '../../components/update-client-health-info-form';

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
        <TabsContent value="profile" className="m-auto flex max-w-2xl flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Allgemeine Informationen</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateClientGeneralInfoForm client={client} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Erweiterte Personendaten</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateClientExtendedInfoForm client={client} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Kontaktinformationen</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateClientContactForm client={client} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="guardianship">Make changes to your account here.</TabsContent>
        <TabsContent value="health" className="m-auto flex max-w-2xl flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Gesundheit Informationen</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateClientHealthInfoForm client={client} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="residence">Make changes to your account here.</TabsContent>
        <TabsContent value="wealth">Make changes to your account here.</TabsContent>
      </Tabs>
    </section>
  );
}
