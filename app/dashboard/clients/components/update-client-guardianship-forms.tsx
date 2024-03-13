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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils/get-error-message';
import { updateClientAction } from '../lib/actions/update-client';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CreatableSelect } from '@/components/ui/creatable-select';
import { LOCAL_COURTS_OPTIONS } from '../lib/consts/local-courts-options';
import { Textarea } from '@/components/ui/textarea';
import { TYPE_OF_GUARDIANSHIP_LABELS } from '../lib/consts/type-of-guardianship-labels';
import { PREV_GUARDIAN_TYPE_LABELS } from '../lib/consts/prev-guardian-type-labels';
import { SCOPE_OF_DUTIES_OPTIONS } from '../lib/consts/scope-of-duties-options';

type UpdateClientProfileProps = {
  client: Client;
};

// Main guardianship info form.
const mainGuardianshipInfoFormSchema = z.object({
  localCourt: z.string().optional(),
  caseNumber: z.string().optional(),
  guardianshipStartedAt: z.date({
    required_error: 'Bitte gib einen gültigen Betreuungsbeginn für die Vormundschaft an.',
  }),
  typeOfGuardianship: z
    .enum([
      'professionalGuardianship',
      'voluntaryGuardianship',
      'supplementaryGuardianship',
      'estateCustodianship',
      'contactCustodianship',
      'proceedingsGuardianship',
      'proceduralAssistant',
      'executorOfAWill',
      'guardianship',
      'healthcareProxy',
    ])
    .optional(),
  reasonOfGuardianship: z.string().optional(),
  isGuardianshipTakenOver: z.enum(['true', 'false'], {
    required_error: 'Bitte gib an, ob die Vormundschaft übernommen wurde.',
  }),
  prevGuardianType: z.enum(['professionalGuardianship', 'voluntaryGuardianship']).optional(),
  prevGuardianshipStartedAt: z.date().optional(),
  guardianshipEndedAt: z.date().optional(),
  reasonOfEndingGuardianship: z.string().optional(),
});

type MainGuardianshipInfoFormValues = z.infer<typeof mainGuardianshipInfoFormSchema>;

export function UpdateClientMainGuardianshipInfoForm({ client }: UpdateClientProfileProps) {
  const form = useForm<MainGuardianshipInfoFormValues>({
    resolver: zodResolver(mainGuardianshipInfoFormSchema),
    defaultValues: {
      localCourt: client.localCourt || '',
      caseNumber: client.caseNumber || '',
      guardianshipStartedAt: new Date(client.guardianshipStartedAt),
      reasonOfGuardianship: client.reasonOfGuardianship || '',
      typeOfGuardianship: client.typeOfGuardianship,
      isGuardianshipTakenOver: client.isGuardianshipTakenOver ? 'true' : 'false',
      prevGuardianshipStartedAt:
        client.prevGuardianshipStartedAt && new Date(client.prevGuardianshipStartedAt),
      prevGuardianType: client.prevGuardianType,
      guardianshipEndedAt: client.guardianshipEndedAt && new Date(client.guardianshipEndedAt),
      reasonOfEndingGuardianship: client.reasonOfEndingGuardianship || '',
    },
  });
  const { toast } = useToast();

  const handleSubmit: SubmitHandler<MainGuardianshipInfoFormValues> = async ({
    isGuardianshipTakenOver,
    ...values
  }) => {
    try {
      const parsedIsGuardianshipTakenOver = isGuardianshipTakenOver === 'true' ? true : false;

      const res = await updateClientAction(client._id, {
        ...values,
        isGuardianshipTakenOver: parsedIsGuardianshipTakenOver,
      });

      if (res.isError) {
        throw new Error(res.errorMessage);
      }

      if (res.isSuccess) {
        toast({
          variant: 'default',
          title: 'Kunde aktualisiert',
          description: 'Die Betreuungsinformationen wurden erfolgreich aktualisiert.',
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
  const isGuardianshipTakenOver = form.watch('isGuardianshipTakenOver') === 'true' ? true : false;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="localCourt"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Amtsgericht</FormLabel>
                <CreatableSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={LOCAL_COURTS_OPTIONS}
                  placeholder="bitte wählen"
                  closeMenuOnSelect
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caseNumber"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Aktenzeichen d. Gerichts</FormLabel>
                <FormControl>
                  <Input placeholder="Az." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="guardianshipStartedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Betreuungsbeginn*</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
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
          name="reasonOfGuardianship"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Grund der Betreuung</FormLabel>
              <FormControl>
                <Textarea placeholder="Grund der Betreuung" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="typeOfGuardianship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Art der Betreuung</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="bitte wählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(TYPE_OF_GUARDIANSHIP_LABELS).map(([key, value]) => (
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
          name="isGuardianshipTakenOver"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hast du die Betreuung von jemand anderem übernommen?*</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  className="w-fit"
                >
                  <FormItem>
                    <FormControl>
                      <ToggleGroupItem value="true" className="w-24">
                        Ja
                      </ToggleGroupItem>
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <ToggleGroupItem value="false" className="w-24">
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
        {isGuardianshipTakenOver && (
          <>
            <FormField
              control={form.control}
              name="prevGuardianType"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Von wem hast du die Betreuung übernommen?</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      className="w-fit"
                    >
                      <FormItem>
                        <FormControl>
                          <ToggleGroupItem value="professionalGuardianship" className="w-32">
                            {PREV_GUARDIAN_TYPE_LABELS.professionalGuardianship}
                          </ToggleGroupItem>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <ToggleGroupItem value="voluntaryGuardianship" className="w-32">
                            {PREV_GUARDIAN_TYPE_LABELS.voluntaryGuardianship}
                          </ToggleGroupItem>
                        </FormControl>
                      </FormItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prevGuardianshipStartedAt"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Seit wann ist die betreute Person in rechtlicher Betreuung?</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
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
                    <PopoverContent className="p-0" align="start">
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
          </>
        )}
        <FormField
          control={form.control}
          name="guardianshipEndedAt"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Betreuungsende</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
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
                <PopoverContent className="p-0" align="start">
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
          name="reasonOfEndingGuardianship"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Grund für das Ende der Betreuung</FormLabel>
              <FormControl>
                <Textarea placeholder="Grund für das Ende der Betreuung" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

// Scope of duties info form.
const scopeOfDutiesFormSchema = z.object({
  scopeOfDuties: z.array(z.string()),
});

type ScopeOfDutiesFormValues = z.infer<typeof scopeOfDutiesFormSchema>;

export function UpdateClientScopeOfDutiesForm({ client }: UpdateClientProfileProps) {
  const form = useForm<ScopeOfDutiesFormValues>({
    resolver: zodResolver(scopeOfDutiesFormSchema),
    defaultValues: {
      scopeOfDuties: client.scopeOfDuties,
    },
  });
  const { toast } = useToast();

  const handleSubmit: SubmitHandler<ScopeOfDutiesFormValues> = async (values) => {
    console.log(values);
    try {
      const res = await updateClientAction(client._id, values);

      if (res.isError) {
        throw new Error(res.errorMessage);
      }

      if (res.isSuccess) {
        toast({
          variant: 'default',
          title: 'Kunde aktualisiert',
          description: 'Die Aufgabenbereiche des Kunden wurden aktualisiert.',
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
        <FormField
          control={form.control}
          name="scopeOfDuties"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Aufgabenkreise</FormLabel>
              <CreatableSelect
                value={field.value}
                onValueChange={field.onChange}
                options={SCOPE_OF_DUTIES_OPTIONS}
                isMulti
                placeholder="bitte wählen"
              />
              <FormMessage />
            </FormItem>
          )}
        />
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
