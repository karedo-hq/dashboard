'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
import { useToast } from '@/lib/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils/get-error-message';
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
import CreateClientStepper from './create-client-stepper';
import { LOCAL_COURTS_LABELS } from '../lib/consts/local-courts-labels';
import { SCOPE_OF_DUTIES_OPTIONS } from '../lib/consts/scope-of-duties-options';
import { LIVING_ARRANGEMENT_LABELS } from '../lib/consts/living-arrangement-labels';
import { WEALTH_STATUS_LABELS } from '../lib/consts/wealth-status-labels';
import { TYPE_OF_GUARDIANSHIP_LABELS } from '../lib/consts/type-of-guardianship-labels';
import { PREV_GUARDIAN_TYPE_LABELS } from '../lib/consts/prev-guardian-type-labels';
import { CreateClientActionResult, createClientAction } from '../lib/actions/create-client';
import { useRouter } from 'next/navigation';
import { CreatableSelect } from '@/components/ui/creatable-select';
import { Typography } from '@/components/ui/typography';

const formSchema = z.object({
  gender: z.enum(['male', 'female', 'other']),
  title: z.string().optional(),
  firstname: z
    .string()
    .min(2, 'Der Vorname muss mindestens 2 Zeichen lang sein')
    .max(45, 'Der Vorname muss weniger als 45 Zeichen lang sein')
    .regex(new RegExp('^[a-zA-Z\\s]+$'), 'Keine Sonderzeichen erlaubt!'),
  lastname: z
    .string()
    .min(2, 'Der Nachname muss mindestens 2 Zeichen lang sein')
    .max(45, 'Der Nachname muss weniger als 45 Zeichen lang sein')
    .regex(new RegExp('^[a-zA-Z\\s]+$'), 'Keine Sonderzeichen erlaubt!'),
  birthday: z.date(),
  localCourt: z.string().optional(),
  caseNumber: z.string().optional(),
  scopeOfDuties: z.array(z.string()),
  guardianshipStartedAt: z.date(),
  livingArrangement: z
    .enum(['inpatient', 'outpatientEquivalent', 'otherLivingArrangement'])
    .optional(),
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
  isGuardianshipTakenOver: z.enum(['true', 'false']),
  prevGuardianType: z.enum(['professionalGuardianship', 'voluntaryGuardianship']).optional(),
  prevGuardianshipStartedAt: z.date().optional(),
});

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
    ...values
  }) => {
    try {
      const parsedIsGuardianshipTakenOver = isGuardianshipTakenOver === 'true' ? true : false;

      const res = await createClientAction({
        ...values,
        isGuardianshipTakenOver: parsedIsGuardianshipTakenOver,
      });

      if (res.isError) {
        throw res.error;
      }

      if (res.isSuccess) {
        toast({
          variant: 'default',
          title: 'Client created',
          description: 'Client has been successfully created',
        });
      }

      if (props.onSuccess) {
        props.onSuccess(res.data);
      }

      router.push('/dashboard/clients');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error creating client',
        description: getErrorMessage(error),
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const isGuardianshipTakenOver = form.watch('isGuardianshipTakenOver') === 'true' ? true : false;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-4">
        <CreateClientStepper
          stepsContent={[
            <fieldset key={0} className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Saludation*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client saludation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Mr.</SelectItem>
                          <SelectItem value="female">Mrs.</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
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
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Client's title" {...field} />
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
                    <FormLabel>Firstname*</FormLabel>
                    <FormControl>
                      <Input placeholder="Client's firstname" {...field} />
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
                    <FormLabel>Lastname*</FormLabel>
                    <FormControl>
                      <Input placeholder="Client's lastname" {...field} />
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
                    <FormLabel>Date of birth*</FormLabel>
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
                                Pick a date
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
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="localCourt"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Local court</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a local court" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(LOCAL_COURTS_LABELS).map(([key, value]) => (
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
                  name="caseNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Case number</FormLabel>
                      <FormControl>
                        <Input placeholder="Case number..." {...field} />
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
                    <FormLabel>Scope of duties</FormLabel>
                    <CreatableSelect
                      onValueChange={field.onChange}
                      options={SCOPE_OF_DUTIES_OPTIONS}
                      isMulti
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
                    <FormLabel>Guardianship start date*</FormLabel>
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
                                Pick a date
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
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="livingArrangement"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Living arrangement</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a living arrangement" />
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
                  name="wealthStatus"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Wealth status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a wealth status" />
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
              </div>
              <FormField
                control={form.control}
                name="typeOfGuardianship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of guardianship</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type of guardianship" />
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
              {/* @todo - parse this field value to boolean on submit */}
              <FormField
                control={form.control}
                name="isGuardianshipTakenOver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is guardianship taken over?*</FormLabel>
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
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="prevGuardianType"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>From whom did you take over guardianship?</FormLabel>
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
                        <FormLabel>Previous guardianship start date</FormLabel>
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
                                    Pick a date
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
                </div>
              )}
            </fieldset>,
          ]}
          submitButton={
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              className="min-w-40"
            >
              Create client
            </Button>
          }
        />
      </form>
    </Form>
  );
}
