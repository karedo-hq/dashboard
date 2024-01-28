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
import { createGuide } from '../lib/actions';
import { MAX_GUIDE_VIDEO_SIZE } from '../lib/constants';

type CreateGuideFormValues = {
  file?: FileList;
};

export function CreateGuideForm() {
  const form = useForm<CreateGuideFormValues>();
  const [guide, setGuide] = useState<Guide>();
  const { toast } = useToast();

  const handleSubmit = async (values: CreateGuideFormValues) => {
    if (guide) {
      setGuide(undefined);
    }

    if (!values.file) {
      return;
    }

    const file = values.file[0];

    if (file.size > MAX_GUIDE_VIDEO_SIZE) {
      toast({
        title: 'File too large',
        description: 'Please choose a file smaller than 10MB.',
        variant: 'destructive',
      });
      return;
    }

    const signatureResponse = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentType: file.type }),
    });

    if (signatureResponse.ok) {
      const { url, fields } = await signatureResponse.json();

      const formData = new FormData();

      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', file);

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const videoKey = fields.key;

        const createGuideResponse = await createGuide(videoKey);

        if (createGuideResponse.errorMessage) {
          toast({
            title: 'Error creating guide',
            description: createGuideResponse.errorMessage,
            variant: 'destructive',
          });
        } else {
          setGuide(createGuideResponse.data);

          toast({
            title: 'Guide created',
            description: '🎉 Your guide has been created successfully.',
          });
        }
      } else {
        console.error('S3 Upload Error:', uploadResponse);
        toast({
          title: 'Error creating guide',
          description: 'We were unable to create your guide. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Error creating guide',
        description: 'Failed to get pre-signed URL. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col space-y-8 md:w-96 mx-auto"
      >
        <FormItem>
          <FormLabel htmlFor="file">Video recording</FormLabel>

          <Input {...form.register('file')} type="file" name="file" accept="video/mp4" />
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
