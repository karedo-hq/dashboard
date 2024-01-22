'use client';

import { createGuide } from '@/(guides)/lib/actions';
import { useForm } from 'react-hook-form';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Guide } from '../lib/types';
import GuideRenderer from '../components/guide-renderer';

type CreateGuideFormValues = {
  file?: FileList;
};

export function CreateGuideForm() {
  const form = useForm<CreateGuideFormValues>();
  const [guide, setGuide] = useState<Guide>();

  const onSubmit = async (values: CreateGuideFormValues) => {
    console.log(values);
    if (values.file) {
      const formData = new FormData();
      formData.append('file', values.file[0]);
      const res = await createGuide(formData);

      setGuide(res);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8 w-96 mx-auto">
        <FormItem>
          <FormLabel htmlFor="file">Video recording</FormLabel>

          <Input {...form.register('file')} type="file" name="file" />
        </FormItem>

        <Button variant="default">Create</Button>
      </form>
      {guide && <GuideRenderer {...guide} />}
    </Form>
  );
}
