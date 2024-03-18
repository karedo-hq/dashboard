import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientDetailsHeader from '@/dashboard/clients/components/clients-details-header';
import { findClientAction } from '@/dashboard/clients/lib/actions/find-client';
import {
  UpdateClientGeneralInfoForm,
  UpdateClientExtendedInfoForm,
  UpdateClientContactForm,
} from '@/dashboard/clients/components/update-client-profile-forms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UpdateClientHealthInfoForm } from '../../components/update-client-health-info-form';
import {
  UpdateClientMainGuardianshipInfoForm,
  UpdateClientScopeOfDutiesForm,
} from '../../components/update-client-guardianship-forms';
import { UpdateClientResidenceForm } from '../../components/update-client-residence-form';

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
        <TabsList className="mb-4 w-full justify-start overflow-x-scroll sm:justify-center">
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
        <TabsContent value="guardianship" className="m-auto flex max-w-2xl flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Informationen zur Betreuung</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateClientMainGuardianshipInfoForm client={client} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Aufgabenkreise</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateClientScopeOfDutiesForm client={client} />
            </CardContent>
          </Card>
        </TabsContent>
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
        <TabsContent value="residence" className="m-auto flex max-w-2xl flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Aufenthalt</CardTitle>
              <CardDescription>
                Nur vollständige Einträge werden gespeichert. Bitte fülle alle Pflichtfelder für
                jede Wohnform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateClientResidenceForm client={client} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wealth" className="m-auto flex max-w-2xl flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Vermögen</CardTitle>
            </CardHeader>
            <CardContent>TODO.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
