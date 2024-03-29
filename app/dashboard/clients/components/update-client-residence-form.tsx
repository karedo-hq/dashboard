'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, TrashIcon } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { cn } from '@/lib/utils/cn';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { Typography } from '@/components/ui/typography';
import { LIVING_ARRANGEMENT_LABELS } from '../lib/consts/living-arrangement-labels';
import { Client } from '../lib/types/client.type';
import { LivingArrangement, LivingArrangementType } from '../lib/types/living-arrangements.type';
import { updateClient } from '../lib/actions/update-client';
import { getErrorMessage } from '@/lib/utils/get-error-message';
import { formatDate } from '@/lib/utils/format-date';

type UpdateClientResidenceFormProps = {
  client: Client;
};

const livingArrangementSchema = z.object({
  type: z.enum(['inpatient', 'outpatientEquivalent', 'otherLivingArrangement']),
  startedAt: z.date().optional(),
  endedAt: z.date().optional(),
});

const formSchema = z.object({
  livingArrangements: z.array(livingArrangementSchema),
});

type FormValues = z.infer<typeof formSchema>;

export function UpdateClientResidenceForm({ client }: UpdateClientResidenceFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      livingArrangements: client.livingArrangements.map((arrangement) => ({
        type: arrangement.type,
        startedAt: new Date(arrangement.startedAt),
        endedAt: arrangement.endedAt ? new Date(arrangement.endedAt) : undefined,
      })),
    },
  });

  const { toast } = useToast();

  const handleAddLivingArrangement = () => {
    const lastArrangement = form.getValues().livingArrangements[0];
    const newArrangement = { type: lastArrangement.type };
    form.setValue('livingArrangements', [newArrangement, ...form.getValues().livingArrangements]);
  };

  const handleDeleteLivingArrangement = (index: number) => {
    const isOnlyItem = form.getValues().livingArrangements.length === 1;
    if (isOnlyItem) {
      throw new Error('Es muss mindestens ein Aufenthalt vorhanden sein.');
    }
    const currentLivingArrangements = form.getValues().livingArrangements;
    const updatedLivingArrangements = currentLivingArrangements.filter((_, i) => i !== index);
    form.setValue('livingArrangements', updatedLivingArrangements);
  };

  const handleSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    const livingArrangements = values.livingArrangements as LivingArrangement[];

    try {
      const res = await updateClient(client._id, {
        livingArrangements,
      });

      if (res.isError) {
        throw new Error(res.errorMessage);
      }

      if (res.isSuccess) {
        toast({
          variant: 'default',
          title: 'Aufenthalt aktualisiert',
          description: 'Die Aufenthaltsdaten wurden erfolgreich aktualisiert.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler beim Aktualisieren der Aufenthaltsdaten',
        description: getErrorMessage(error),
      });
    }
  };

  const handleArrangementTypeChange = (index: number, value: LivingArrangementType) => {
    const currentLivingArrangements = form.getValues().livingArrangements;
    const updatedLivingArrangements = currentLivingArrangements.map((arrangement, i) =>
      i === index ? { ...arrangement, type: value } : arrangement,
    );
    form.setValue('livingArrangements', updatedLivingArrangements);
  };

  const handleArrangementStartedAtChange = (index: number, value?: Date) => {
    if (!value) return;
    const currentLivingArrangements = form.getValues().livingArrangements;
    const updatedLivingArrangements = currentLivingArrangements.map((arrangement, i) =>
      i === index ? { ...arrangement, startedAt: value } : arrangement,
    );
    form.setValue('livingArrangements', updatedLivingArrangements);
  };

  const handleArrangementEndedAtChange = (index: number, value?: Date) => {
    const currentLivingArrangements = form.getValues().livingArrangements;
    const updatedLivingArrangements = currentLivingArrangements.map((arrangement, i) =>
      i === index ? { ...arrangement, endedAt: value } : arrangement,
    );
    form.setValue('livingArrangements', updatedLivingArrangements);
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="livingArrangements"
          render={({ field }) => {
            const withIdArrangements = field.value.map((arrangement, index) => ({
              ...arrangement,
              _id: index,
            }));
            const [firstArrangement, ...restArrangements] = withIdArrangements;

            return (
              <FormItem className="space-y-4">
                <header className="flex items-center justify-between">
                  <Typography as="h2" variant="title5">
                    Aktueller Aufenthalt
                  </Typography>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleAddLivingArrangement}
                    className="self-end hover:no-underline"
                    type="button"
                  >
                    + geänderter Aufenthalt
                  </Button>
                </header>
                <fieldset className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <FormItem className="flex-1">
                    <FormLabel>Wohnform*</FormLabel>
                    <Select
                      value={firstArrangement.type}
                      onValueChange={(value: LivingArrangementType) =>
                        handleArrangementTypeChange(firstArrangement._id, value)
                      }
                    >
                      <SelectTrigger className="text-start">
                        <SelectValue placeholder="bitte wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LIVING_ARRANGEMENT_LABELS).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                  <FormItem className="flex-1">
                    <FormLabel>Seit*</FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !firstArrangement.startedAt && 'text-muted-foreground',
                            )}
                          >
                            {firstArrangement.startedAt ? (
                              formatDate(firstArrangement.startedAt)
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
                          selected={firstArrangement.startedAt}
                          onSelect={(date) =>
                            handleArrangementStartedAtChange(firstArrangement._id, date)
                          }
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          classNames={{
                            caption: 'flex p-2',
                            caption_label: 'hidden',
                            vhidden: 'hidden',
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                </fieldset>
                <Typography as="h2" variant="title5">
                  Vergangene Aufenthalte
                </Typography>
                <Typography variant="small" color="slate-500">
                  Bitte trage auch vergangene Aufenthalte ein, wenn sich die Wohnform ändert, damit
                  wir die Vergütung korrekt für dich berechnen können.
                </Typography>
                {restArrangements.map((arrangement) => (
                  <fieldset
                    key={arrangement._id}
                    className="flex flex-col gap-4 sm:flex-row sm:items-end"
                  >
                    <FormItem className="flex-1">
                      <FormLabel>Wohnform*</FormLabel>
                      <Select
                        value={arrangement.type}
                        onValueChange={(value: LivingArrangementType) =>
                          handleArrangementTypeChange(arrangement._id, value)
                        }
                      >
                        <SelectTrigger className="text-start">
                          <SelectValue placeholder="bitte wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(LIVING_ARRANGEMENT_LABELS).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                    <FormItem className="flex-1">
                      <FormLabel>von*</FormLabel>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !arrangement.startedAt && 'text-muted-foreground',
                              )}
                            >
                              {arrangement.startedAt ? (
                                formatDate(arrangement.startedAt)
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
                            selected={arrangement.startedAt}
                            onSelect={(date) =>
                              handleArrangementStartedAtChange(arrangement._id, date)
                            }
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            classNames={{
                              caption: 'flex p-2',
                              caption_label: 'hidden',
                              vhidden: 'hidden',
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                    <FormItem className="flex-1">
                      <FormLabel>bis*</FormLabel>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !arrangement.endedAt && 'text-muted-foreground',
                              )}
                            >
                              {arrangement.endedAt ? (
                                formatDate(arrangement.endedAt)
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
                            selected={arrangement.endedAt}
                            onSelect={(date) =>
                              handleArrangementEndedAtChange(arrangement._id, date)
                            }
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            classNames={{
                              caption: 'flex p-2',
                              caption_label: 'hidden',
                              vhidden: 'hidden',
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDeleteLivingArrangement(arrangement._id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </fieldset>
                ))}
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <footer className="mt-4 flex items-center justify-end">
          <Button
            type="submit"
            className="sm:min-w-24"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Speichern
          </Button>
        </footer>
      </form>
    </Form>
  );
}
