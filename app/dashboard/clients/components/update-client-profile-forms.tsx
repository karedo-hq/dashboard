'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
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
import { CalendarIcon, CheckIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils/get-error-message';
import { updateClientAction } from '../lib/actions/update-client';
import { CLIENT_MARITAL_STATUS_LABELS } from '../lib/consts/client-marital-status-labels';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { COUNTRIES_OPTIONS } from '@/lib/consts/countries-options';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';

type UpdateClientProfileProps = {
  client: Client;
};

// General info form.
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

type UpdateClientGeneralInfoFormValues = z.infer<typeof generalInfoFormSchema>;

export function UpdateClientGeneralInfoForm({ client }: UpdateClientProfileProps) {
  const form = useForm<UpdateClientGeneralInfoFormValues>({
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

  const handleSubmit: SubmitHandler<UpdateClientGeneralInfoFormValues> = async (values) => {
    try {
      const res = await updateClientAction(client._id, values);

      if (res.isError) {
        throw new Error(res.errorMessage);
      }

      if (res.isSuccess) {
        toast({
          variant: 'default',
          title: 'Kunde aktualisiert',
          description: 'Die allgemeinen Informationen des Kunden wurden aktualisiert.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler beim Aktualisieren des Kunden',
        description: getErrorMessage(error),
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Geboren am*</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full font-normal',
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
                    </PopoverTrigger>
                  </FormControl>
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
              <FormItem className="flex-1">
                <FormLabel>Gestorben am</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full font-normal',
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
                    </PopoverTrigger>
                  </FormControl>
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
            Speichern
          </Button>
        </footer>
      </form>
    </Form>
  );
}

// Extended info form.
const extendedInfoFormSchema = z.object({
  maritalStatus: z
    .enum([
      'single',
      'married',
      'widowed',
      'registeredPartnership',
      'livingSeparately',
      'divorced',
      'partnershipInDissolution',
    ])
    .optional(),
  maritalStatusStartedAt: z.date().optional(),
  numberOfChildren: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const number = parseInt(val, 10);
        return Number.isInteger(number) && number >= 0;
      },
      {
        message: 'Die Anzahl der Kinder muss eine nicht-negative Ganzzahl sein',
      },
    ),
  isSingleParent: z.enum(['true', 'false']).optional(),
  birthname: z.string().optional(),
  citizenship: z.string().optional(),
  countryOfBirth: z.string().optional(),
  cityOfBirth: z.string().optional(),
  additionalCitizenship: z.string().optional(),
  religion: z.enum(['protestant', 'catholic', 'other']).optional(),
  taxId: z.string().optional(),
});

type UpdateClientExtendedInfoFormValues = z.infer<typeof extendedInfoFormSchema>;

export function UpdateClientExtendedInfoForm({ client }: UpdateClientProfileProps) {
  const form = useForm<UpdateClientExtendedInfoFormValues>({
    resolver: zodResolver(extendedInfoFormSchema),
    defaultValues: {
      maritalStatus: client.maritalStatus,
      maritalStatusStartedAt:
        client.maritalStatusStartedAt && new Date(client.maritalStatusStartedAt),
      numberOfChildren: client.numberOfChildren ? client.numberOfChildren.toString() : '',
      isSingleParent:
        client.isSingleParent !== undefined
          ? (client.isSingleParent.toString() as 'true' | 'false')
          : undefined,
      birthname: client.birthname || '',
      citizenship: client.citizenship || '',
      additionalCitizenship: client.additionalCitizenship || '',
      countryOfBirth: client.countryOfBirth || '',
      cityOfBirth: client.cityOfBirth || '',
      religion: client.religion,
      taxId: client.taxId || '',
    },
  });
  const { toast } = useToast();

  const handleSubmit: SubmitHandler<UpdateClientExtendedInfoFormValues> = async ({
    numberOfChildren,
    isSingleParent,
    ...values
  }) => {
    const parsedNumberOfChildren = numberOfChildren ? parseInt(numberOfChildren, 10) : undefined;
    const parsedIsSingleParent = isSingleParent
      ? isSingleParent === 'true'
        ? true
        : false
      : undefined;

    try {
      const res = await updateClientAction(client._id, {
        ...values,
        numberOfChildren: parsedNumberOfChildren,
        isSingleParent: parsedIsSingleParent,
      });

      if (res.isError) {
        throw new Error(res.errorMessage);
      }

      if (res.isSuccess) {
        toast({
          variant: 'default',
          title: 'Kunde aktualisiert',
          description: 'Die erweiterten Personendaten des Kunden wurden aktualisiert.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler beim Aktualisieren des Kunden',
        description: getErrorMessage(error),
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Familienstand</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="bitte wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(CLIENT_MARITAL_STATUS_LABELS).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maritalStatusStartedAt"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Seit</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full font-normal',
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
                    </PopoverTrigger>
                  </FormControl>
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
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FormField
            control={form.control}
            name="numberOfChildren"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Anzahl Kinder</FormLabel>
                <FormControl>
                  <Input placeholder="Anzahl Kinder des Kunden" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isSingleParent"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Alleinerziehend</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormItem className="flex-1">
                      <FormControl>
                        <ToggleGroupItem value="true" className="w-full">
                          Ja
                        </ToggleGroupItem>
                      </FormControl>
                    </FormItem>
                    <FormItem className="flex-1">
                      <FormControl>
                        <ToggleGroupItem value="false" className="w-full">
                          Nein
                        </ToggleGroupItem>
                      </FormControl>
                    </FormItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="birthname"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Geburtsname</FormLabel>
              <FormControl>
                <Input placeholder="Geburtsname des Kunden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FormField
            control={form.control}
            name="citizenship"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Staatsangehörigkeit</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between font-normal',
                          !field.value && 'text-slate-500',
                        )}
                      >
                        {field.value
                          ? COUNTRIES_OPTIONS.find((country) => country.value === field.value)
                              ?.label
                          : 'bitte wählen'}
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Land suchen..." />
                      <CommandEmpty>Kein Land gefunden.</CommandEmpty>
                      <CommandGroup className="max-h-96 w-full overflow-scroll">
                        {COUNTRIES_OPTIONS.map((country) => (
                          <CommandItem
                            value={country.label}
                            key={country.value}
                            onSelect={() => form.setValue('citizenship', country.value)}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                country.value === field.value ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionalCitizenship"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Weitere Staatsangehörigkeit</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between font-normal',
                          !field.value && 'text-slate-500',
                        )}
                      >
                        {field.value
                          ? COUNTRIES_OPTIONS.find((country) => country.value === field.value)
                              ?.label
                          : 'bitte wählen'}
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Land suchen..." />
                      <CommandEmpty>Kein Land gefunden.</CommandEmpty>
                      <CommandGroup className="max-h-96 w-full overflow-scroll">
                        {COUNTRIES_OPTIONS.map((country) => (
                          <CommandItem
                            value={country.label}
                            key={country.value}
                            onSelect={() => form.setValue('additionalCitizenship', country.value)}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                country.value === field.value ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FormField
            control={form.control}
            name="countryOfBirth"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Geburtsland</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between font-normal',
                          !field.value && 'text-slate-500',
                        )}
                      >
                        {field.value
                          ? COUNTRIES_OPTIONS.find((country) => country.value === field.value)
                              ?.label
                          : 'bitte wählen'}
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Land suchen..." />
                      <CommandEmpty>Kein Land gefunden.</CommandEmpty>
                      <CommandGroup className="max-h-96 w-full overflow-scroll">
                        {COUNTRIES_OPTIONS.map((country) => (
                          <CommandItem
                            value={country.label}
                            key={country.value}
                            onSelect={() => form.setValue('countryOfBirth', country.value)}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                country.value === field.value ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cityOfBirth"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Geburtsort</FormLabel>
                <FormControl>
                  <Input placeholder="Geburtsort des Kunden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Religionszugehörigkeit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="bitte wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="protestant">Evangelisch</SelectItem>
                    <SelectItem value="catholic">Katholisch</SelectItem>
                    <SelectItem value="other">Andere</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Identifikations-Nr. / Steuer-ID</FormLabel>
                <FormControl>
                  <Input placeholder="Identifikationsnummer/ Steuer-ID des Kunden" {...field} />
                </FormControl>
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
            Speichern
          </Button>
        </footer>
      </form>
    </Form>
  );
}

// Contact form.
const contactFormSchema = z.object({
  street: z.string().optional(),
  streetNo: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  fax: z.string().optional(),
  isAlternativeAddressActive: z.enum(['true', 'false']).optional(),
  alternativeStreet: z.string().optional(),
  alternativeStreetNo: z.string().optional(),
  alternativePostalCode: z.string().optional(),
  alternativeCity: z.string().optional(),
});

type UpdateClientContactFormValues = z.infer<typeof contactFormSchema>;

export function UpdateClientContactForm({ client }: UpdateClientProfileProps) {
  const form = useForm<UpdateClientContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      street: client.street || '',
      streetNo: client.streetNo || '',
      postalCode: client.postalCode || '',
      city: client.city || '',
      phone: client.phone || '',
      mobile: client.mobile || '',
      email: client.email || '',
      fax: client.fax || '',
      isAlternativeAddressActive:
        client.isAlternativeAddressActive !== undefined
          ? (client.isAlternativeAddressActive.toString() as 'true' | 'false')
          : undefined,
      alternativeStreet: client.alternativeStreet || '',
      alternativeStreetNo: client.alternativeStreetNo || '',
      alternativePostalCode: client.alternativePostalCode || '',
      alternativeCity: client.alternativeCity || '',
    },
  });
  const { toast } = useToast();

  const handleSubmit: SubmitHandler<UpdateClientContactFormValues> = async ({
    isAlternativeAddressActive,
    ...values
  }) => {
    const parsedIsAlternativeAddressActive = isAlternativeAddressActive
      ? isAlternativeAddressActive === 'true'
        ? true
        : false
      : undefined;

    try {
      const res = await updateClientAction(client._id, {
        isAlternativeAddressActive: parsedIsAlternativeAddressActive,
        ...values,
      });

      if (res.isError) {
        throw new Error(res.errorMessage);
      }

      if (res.isSuccess) {
        toast({
          variant: 'default',
          title: 'Kunde aktualisiert',
          description: 'Die Kontaktdaten des Kunden wurden aktualisiert.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler beim Aktualisieren des Kunden',
        description: getErrorMessage(error),
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Straße</FormLabel>
                <FormControl>
                  <Input placeholder="Straße des Kunden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="streetNo"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nr.</FormLabel>
                <FormControl>
                  <Input placeholder="Hausnummer des Kunden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>PLZ</FormLabel>
                <FormControl>
                  <Input placeholder="PLZ des Kunden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Ort</FormLabel>
                <FormControl>
                  <Input placeholder="Ort des Kunden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input placeholder="Telefonnummer des Kunden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Mobil</FormLabel>
                <FormControl>
                  <Input placeholder="Mobilnummer des Kunden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input placeholder="E-Mail des Kunden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fax</FormLabel>
              <FormControl>
                <Input placeholder="Faxnummer des Kunden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAlternativeAddressActive"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Abweichende Postadresse</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormItem className="flex-1">
                    <FormControl>
                      <ToggleGroupItem value="true" className="w-full">
                        Ja
                      </ToggleGroupItem>
                    </FormControl>
                  </FormItem>
                  <FormItem className="flex-1">
                    <FormControl>
                      <ToggleGroupItem value="false" className="w-full">
                        Nein
                      </ToggleGroupItem>
                    </FormControl>
                  </FormItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('isAlternativeAddressActive') === 'true' && (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <FormField
                control={form.control}
                name="alternativeStreet"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Straße</FormLabel>
                    <FormControl>
                      <Input placeholder="Straße des Kunden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alternativeStreetNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Hausnummer</FormLabel>
                    <FormControl>
                      <Input placeholder="Hausnummer des Kunden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <FormField
                control={form.control}
                name="alternativePostalCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>PLZ</FormLabel>
                    <FormControl>
                      <Input placeholder="PLZ des Kunden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alternativeCity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Ort</FormLabel>
                    <FormControl>
                      <Input placeholder="Ort des Kunden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
        <footer className="flex items-center justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            className="sm:min-w-24"
          >
            Speichern
          </Button>
        </footer>
      </form>
    </Form>
  );
}
