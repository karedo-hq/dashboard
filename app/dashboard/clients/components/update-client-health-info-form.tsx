'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/lib/hooks/use-toast';
import { getErrorMessage } from '@/lib/utils/get-error-message';
import { updateClientAction } from '../lib/actions/update-client';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Textarea } from '@/components/ui/textarea';

type UpdateClientHealthInfoProps = {
  client: Client;
};

const formSchema = z.object({
  diagnosis: z.string().optional(),
  levelOfDisability: z
    .enum([
      'level0',
      'level10',
      'level20',
      'level30',
      'level40',
      'level50',
      'level60',
      'level70',
      'level80',
      'level90',
      'level100',
    ])
    .optional(),
  disabilityRecognizedAt: z.date().optional(),
  severeDisabilityMark: z.string().optional(),
  careLevel: z.enum(['level1', 'level2', 'level3', 'level4', 'level5']).optional(),
  careLevelRecognizedAt: z.date().optional(),
  isLivingWillAvailable: z.enum(['true', 'false']).optional(),
  contentOfLivingWill: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function UpdateClientHealthInfoForm({ client }: UpdateClientHealthInfoProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnosis: client.diagnosis || '',
      levelOfDisability: client.levelOfDisability,
      disabilityRecognizedAt:
        client.disabilityRecognizedAt && new Date(client.disabilityRecognizedAt),
      severeDisabilityMark: client.severeDisabilityMark || '',
      careLevel: client.careLevel,
      careLevelRecognizedAt: client.careLevelRecognizedAt && new Date(client.careLevelRecognizedAt),
      isLivingWillAvailable:
        client.isLivingWillAvailable !== undefined
          ? (client.isLivingWillAvailable.toString() as 'true' | 'false')
          : undefined,
      contentOfLivingWill: client.contentOfLivingWill || '',
    },
  });
  const { toast } = useToast();

  const handleSubmit: SubmitHandler<FormValues> = async ({ isLivingWillAvailable, ...values }) => {
    const parsedIsSingleParent = isLivingWillAvailable
      ? isLivingWillAvailable === 'true'
        ? true
        : false
      : undefined;

    try {
      const res = await updateClientAction(client._id, {
        ...values,
        isLivingWillAvailable: parsedIsSingleParent,
      });

      if (res.isError) {
        throw new Error(res.errorMessage);
      }

      if (res.isSuccess) {
        toast({
          variant: 'default',
          title: 'Gesungheitsinformationen aktualisiert',
          description: 'Die Gesundheitsinformationen des Klienten wurden erfolgreich aktualisiert.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fehler beim Aktualisieren der Gesundheitsinformationen',
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
          name="diagnosis"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Diagnosen</FormLabel>
              <FormControl>
                <Textarea placeholder="Diagnosen des Kunden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="levelOfDisability"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Grad d. Behinderung</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="bitte wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="level0">0</SelectItem>
                    <SelectItem value="level10">10</SelectItem>
                    <SelectItem value="level20">20</SelectItem>
                    <SelectItem value="level30">30</SelectItem>
                    <SelectItem value="level40">40</SelectItem>
                    <SelectItem value="level50">50</SelectItem>
                    <SelectItem value="level60">60</SelectItem>
                    <SelectItem value="level70">70</SelectItem>
                    <SelectItem value="level80">80</SelectItem>
                    <SelectItem value="level90">90</SelectItem>
                    <SelectItem value="level100">100</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="disabilityRecognizedAt"
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
        <FormField
          control={form.control}
          name="severeDisabilityMark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schwerbehinderung / Merkzeichen</FormLabel>
              <FormControl>
                <Input placeholder="Schwerbehinderung / Merkzeichen des Kunden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="careLevel"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Pflegegrad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="bitte wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="level1">Pflegegrad 1</SelectItem>
                    <SelectItem value="level2">Pflegegrad 2</SelectItem>
                    <SelectItem value="level3">Pflegegrad 3</SelectItem>
                    <SelectItem value="level4">Pflegegrad 4</SelectItem>
                    <SelectItem value="level5">Pflegegrad 5</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="careLevelRecognizedAt"
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

        <FormField
          control={form.control}
          name="isLivingWillAvailable"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patientenverfügung vorhanden</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  className="justify-start"
                >
                  <FormItem>
                    <FormControl>
                      <ToggleGroupItem value="true" className="min-w-32">
                        Ja
                      </ToggleGroupItem>
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <ToggleGroupItem value="false" className="min-w-32">
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
        <FormField
          control={form.control}
          name="contentOfLivingWill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inhalt der Patientenverfügung</FormLabel>
              <FormControl>
                <Textarea placeholder="Inhalt der Patientenverfügung" {...field} />
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
