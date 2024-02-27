'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Typography } from '@/components/ui/typography';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import CreateClientStepper from './create-client-stepper';
import { LOCAL_COURTS_LABELS } from '../lib/consts/local-courts-labels';
import { MultiSelect } from '@/components/ui/multi-select';

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
});

type CreateClientFormValues = z.infer<typeof formSchema>;

export default function CreateClientForm() {
  const form = useForm<CreateClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      firstname: '',
      lastname: '',
      caseNumber: '',
      scopeOfDuties: [],
    },
  });
  const { toast } = useToast();

  const handleSubmit: SubmitHandler<CreateClientFormValues> = async (values) => {
    try {
      // await registerAction(dto);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler bei der Registrierung',
        description: getErrorMessage(error),
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-4">
        <CreateClientStepper
          stepsContent={[
            <fieldset key={0} className="flex flex-col space-y-4">
              <Typography as="legend" variant="title5">
                Personal information
              </Typography>
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
                    <FormLabel>Date of birth</FormLabel>
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
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                    <MultiSelect
                      selected={field.value}
                      onValueChange={field.onChange}
                      options={[
                        {
                          value: 'next.js',
                          label: 'Next.js',
                        },
                        {
                          value: 'sveltekit',
                          label: 'SvelteKit',
                        },
                        {
                          value: 'nuxt.js',
                          label: 'Nuxt.js',
                        },
                        {
                          value: 'remix',
                          label: 'Remix',
                        },
                        {
                          value: 'astro',
                          label: 'Astro',
                        },
                        {
                          value: 'wordpress',
                          label: 'WordPress',
                        },
                        {
                          value: 'express.js',
                          label: 'Express.js',
                        },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>,
          ]}
          submitButton={
            <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
              Create client
            </Button>
          }
        />
      </form>
    </Form>
  );
}
