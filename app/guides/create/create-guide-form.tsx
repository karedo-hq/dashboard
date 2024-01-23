'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Guide } from '../lib/types';
import GuideRenderer from '../components/guide-renderer';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import FramedArrowIcon from '@/components/icons/framed-arrow-icon';
import { useToast } from '@/lib/hooks/use-toast';

type CreateGuideFormValues = {
  file?: FileList;
};

export function CreateGuideForm() {
  const form = useForm<CreateGuideFormValues>();
  const [guide, setGuide] = useState<Guide>();
  const { toast } = useToast();

  const onSubmit = async (values: CreateGuideFormValues) => {
    if (guide) {
      setGuide(undefined);
    }

    if (values.file) {
      const formData = new FormData();
      formData.append('file', values.file[0]);

      try {
        const res = await fetch('/api/guides', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          toast({
            title: 'Error creating guide',
            description: 'We were unable to create your guide. Please try again.',
            variant: 'destructive',
          });
        } else {
          const createdGuide = await res.json();

          setGuide(createdGuide);
          toast({
            title: 'Guide created',
            description: '🎉 Your guide has been created successfully.',
          });
        }
      } catch (error) {
        toast({
          title: 'Error creating guide',
          description: 'We were unable to create your guide. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 md:w-96 mx-auto"
      >
        <FormItem>
          <FormLabel htmlFor="file">Video recording</FormLabel>

          <Input {...form.register('file')} type="file" name="file" accept="video" />
        </FormItem>

        <Button variant="default" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Create'}
        </Button>
        {guide && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FramedArrowIcon size={16} className="mr-2" />
                Open preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] md:min-w-[70vw] overflow-hidden overflow-y-scroll">
              <GuideRenderer guide={guide} />
            </DialogContent>
          </Dialog>
        )}
      </form>
    </Form>
  );
}