'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createGuide } from '@/(guides)/lib/actions';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Guide } from '../lib/types';
import GuideRenderer from '../components/guide-renderer';

type CreateGuideFormValues = {
  file?: FileList;
};

export function CreateGuideForm() {
  const form = useForm<CreateGuideFormValues>();
  const [guide, setGuide] = useState<Guide>();

  const onSubmit = async (values: CreateGuideFormValues) => {
    if (guide) {
      setGuide(undefined);
    }

    if (values.file) {
      const formData = new FormData();
      formData.append('file', values.file[0]);
      const res = await createGuide(formData);
      setGuide(res);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8 w-96 mx-auto">
        <FormItem>
          <FormLabel htmlFor="file">Video recording</FormLabel>

          <Input {...form.register('file')} type="file" name="file" accept="video/mp4" />
        </FormItem>

        <Button variant="default" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Create'}
        </Button>
      </form>
      {guide && <GuideRenderer {...guide} />}
    </Form>
  );
}
