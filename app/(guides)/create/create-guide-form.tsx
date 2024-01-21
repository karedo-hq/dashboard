'use client';

import { createGuide } from '@/(guides)/lib/actions';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { CreateGuideResponse } from '../lib/types';
import GuideRenderer from '../components/guide-renderer';
import { Button } from '@/components/ui/button';
import { typographyVariants } from '@/components/ui/typography';

const initialState: CreateGuideResponse = {
  message: '',
  guide: null,
};

export function CreateGuideForm() {
  const [state, formAction] = useFormState(createGuide, initialState);
  const { pending } = useFormStatus();

  console.log({ pending });

  return (
    <form action={formAction} className="flex flex-col">
      <label htmlFor="file" className={typographyVariants({ variant: 'paragraph' })}>
        Video:
      </label>
      <input type="file" id="file" name="file" required />
      <Button type="submit" variant="default" disabled={pending}>
        {pending ? 'Creating...' : 'Create'}
      </Button>
      <p aria-live="polite" role="status">
        {state?.message}
      </p>

      {state?.guide && <GuideRenderer {...state.guide} />}
    </form>
  );
}
