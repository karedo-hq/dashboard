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

type UpdateClientResidenceProps = {
  client: Client;
};

const formSchema = z.object({});

type FormValues = z.infer<typeof formSchema>;

export function UpdateClientResidenceForm({ client }: UpdateClientResidenceProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const { toast } = useToast();

  const handleSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const res = await updateClientAction(client._id, values);

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
