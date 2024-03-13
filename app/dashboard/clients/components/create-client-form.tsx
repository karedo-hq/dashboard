'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils/get-error-message';
import { cn } from '@/lib/utils/cn';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CreatableSelect } from '@/components/ui/creatable-select';
import { Typography } from '@/components/ui/typography';
import CreateClientStepper from './create-client-stepper';
import { LOCAL_COURTS_OPTIONS } from '../lib/consts/local-courts-options';
import { SCOPE_OF_DUTIES_OPTIONS } from '../lib/consts/scope-of-duties-options';
import { LIVING_ARRANGEMENT_LABELS } from '../lib/consts/living-arrangement-labels';
import { WEALTH_STATUS_LABELS } from '../lib/consts/wealth-status-labels';
import { TYPE_OF_GUARDIANSHIP_LABELS } from '../lib/consts/type-of-guardianship-labels';
import { PREV_GUARDIAN_TYPE_LABELS } from '../lib/consts/prev-guardian-type-labels';
import { CreateClientActionResult, createClientAction } from '../lib/actions/create-client';

const formSchema = z
  .object({
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
    localCourt: z.string().optional(),
    caseNumber: z
      .string()
      .max(40, 'Das Aktenzeichen darf nicht länger als 40 Zeichen sein.')
      .optional(),
    scopeOfDuties: z.array(z.string()),
    guardianshipStartedAt: z.date({
      required_error: 'Bitte gib einen gültigen Betreuungsbeginn für die Vormundschaft an.',
    }),
    livingArrangementType: z
      .enum(['inpatient', 'outpatientEquivalent', 'otherLivingArrangement'])
      .optional(),
    livingArrangementStartedAt: z.date().optional(),
    livingArrangementEndedAt: z.date().optional(),
    wealthStatus: z.enum(['indigent', 'notIndigent']).optional(),
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
    isGuardianshipTakenOver: z.enum(['true', 'false'], {
      required_error: 'Bitte gib an, ob die Vormundschaft übernommen wurde.',
    }),
    prevGuardianType: z.enum(['professionalGuardianship', 'voluntaryGuardianship']).optional(),
    prevGuardianshipStartedAt: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.livingArrangementType && !data.livingArrangementStartedAt) {
        return false;
      }
      return true;
    },
    {
      message: 'Bitte gib ein gültiges Datum für den Beginn der Wohnsituation an.',
      path: ['livingArrangementStartedAt'],
    },
  );

type CreateClientFormProps = {
  onSuccess?: (data: CreateClientActionResult['data']) => void;
};

type CreateClientFormValues = z.infer<typeof formSchema>;

export default function CreateClientForm(props: CreateClientFormProps) {
  const form = useForm<CreateClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      firstname: '',
      lastname: '',
      caseNumber: '',
      scopeOfDuties: [],
      isGuardianshipTakenOver: 'false',
    },
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit: SubmitHandler<CreateClientFormValues> = async ({
    isGuardianshipTakenOver,
    livingArrangementType,
    livingArrangementStartedAt,
    livingArrangementEndedAt,
    ...values
  }) => {
    try {
      const parsedIsGuardianshipTakenOver = isGuardianshipTakenOver === 'true' ? true : false;

      let livingArrangements;

      if (livingArrangementType && livingArrangementStartedAt) {
        livingArrangements = [
          {
            type: livingArrangementType,
            startedAt: livingArrangementStartedAt,
            endedAt: livingArrangementEndedAt,
          },
        ];
      }

      const res = await createClientAction({
        ...values,
        isGuardianshipTakenOver: parsedIsGuardianshipTakenOver,
        livingArrangements,
      });

      if (res.isError) {
        throw new Error(res.errorMessage);
      }

      if (res.isSuccess) {
        toast({
          variant: 'default',
          title: 'Betreuung erstellt',
          description: 'Betreuung wurde erfolgreich erstellt!',
        });
      }

      if (props.onSuccess) {
        props.onSuccess(res.data);
      }

      router.push('/dashboard/clients');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler beim Erstellen des Kunden',
        description: getErrorMessage(error),
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const isGuardianshipTakenOver = form.watch('isGuardianshipTakenOver') === 'true' ? true : false;
  const isError = Object.keys(form.formState.errors).length > 0 && form.formState.isSubmitted;

  console.log({ form });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-4">
        <CreateClientStepper
          stepsContent={[
            <fieldset key={0} className="flex flex-col space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Geboren am*</FormLabel>
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
            </fieldset>,
            <fieldset key={1} className="flex flex-col space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
            </fieldset>,
            <fieldset key={2} className="flex flex-col space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <FormField
                  control={form.control}
                  name="livingArrangementType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Wohnform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="bitte wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(LIVING_ARRANGEMENT_LABELS).map(([key, value]) => (
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
                  name="livingArrangementStartedAt"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>von</FormLabel>
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
                  name="livingArrangementEndedAt"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>bis</FormLabel>
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
              </div>
              <FormField
                control={form.control}
                name="wealthStatus"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Vermögensstatus</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="bitte wählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(WEALTH_STATUS_LABELS).map(([key, value]) => (
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
                        <FormLabel>
                          Seit wann ist die betreute Person in rechtlicher Betreuung?
                        </FormLabel>
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
                              disabled={(date) =>
                                date > new Date() || date < new Date('1900-01-01')
                              }
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
              {isError && (
                <Typography variant="small" color="error-500" className="font-medium">
                  Bitte fülle alle Pflichtfelder aus.
                </Typography>
              )}
            </fieldset>,
          ]}
          submitButton={
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="sm:min-w-40"
            >
              Betreuung hinzufügen
            </Button>
          }
        />
      </form>
    </Form>
  );
}
