'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Client } from '@/dashboard/clients/lib/types/client.type';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Typography } from '@/components/ui/typography';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils/get-error-message';
import { updateClientAction } from '../lib/actions/update-client';

type EditClientProfileCardProps = {
  client: Client;
};

const generalInfoFormSchema = z.object({
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Bitte wähle einen Titel',
  }),
  title: z.string().optional(),
  firstname: z
    .string()
    .min(2, 'Dein Vorname muss mindestens 2 Zeichen lang sein.')
    .max(45, 'Dein Vorname darf nicht länger als 45 Zeichen sein.'),
  lastname: z
    .string()
    .min(2, 'Dein Nachname muss mindestens 2 Zeichen lang sein.')
    .max(45, 'Dein Nachname darf nicht länger als 45 Zeichen sein.'),
  birthday: z.date({
    required_error: 'Bitte gib ein gültiges Geburtsdatum ein.',
  }),
  deathday: z.date().optional(),
});

type EditClientGeneralInfoFormValues = z.infer<typeof generalInfoFormSchema>;

export function EditClientGeneralInfoCard({ client }: EditClientProfileCardProps) {
  const form = useForm<EditClientGeneralInfoFormValues>({
    resolver: zodResolver(generalInfoFormSchema),
    defaultValues: {
      gender: client.gender,
      title: client.title,
      firstname: client.firstname,
      lastname: client.lastname,
      birthday: new Date(client.birthday),
      deathday: client.deathday && new Date(client.deathday),
    },
  });
  const { toast } = useToast();

  const handleSubmit: SubmitHandler<EditClientGeneralInfoFormValues> = async (values) => {
    try {
      const res = await updateClientAction(client._id, values);

      if (res.isError) {
        throw res.error;
      }

      if (res.isSuccess) {
        toast({
          variant: 'default',
          title: 'Client updated',
          description: "Client's general information has been updated.",
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating client',
        description: getErrorMessage(error),
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allgemeine Informationen</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Anrede*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="bitte wählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Herr</SelectItem>
                        <SelectItem value="female">Frau</SelectItem>
                        <SelectItem value="other">Andere</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Titel</FormLabel>
                    <FormControl>
                      <Input placeholder="Titel des Kunden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vorname*</FormLabel>
                  <FormControl>
                    <Input placeholder="Vorname des Kunden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nachname*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nachname des Kunden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel>Geboren am*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <Typography variant="small" color="slate-500">
                                TT.MM.JJJJ
                              </Typography>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          captionLayout="dropdown"
                          fromDate={new Date('1900-01-01')}
                          toDate={new Date()}
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          classNames={{
                            caption: 'flex p-2',
                            caption_label: 'hidden',
                            vhidden: 'hidden',
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deathday"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel>Gestorben am</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <Typography variant="small" color="slate-500">
                                TT.MM.JJJJ
                              </Typography>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          captionLayout="dropdown"
                          fromDate={form.watch('birthday') || new Date('1900-01-01')}
                          toDate={new Date()}
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          classNames={{
                            caption: 'flex p-2',
                            caption_label: 'hidden',
                            vhidden: 'hidden',
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <footer className="flex items-center justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="sm:min-w-24"
              >
                Save
              </Button>
            </footer>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
