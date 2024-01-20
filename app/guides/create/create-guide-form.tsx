'use client';

import { createGuide } from '@/guides/lib/actions';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { CreateGuideResponse } from '../lib/types';
import GuideRenderer from '../components/guide-renderer';

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
      <label htmlFor="file">Video:</label>
      <input type="file" id="file" name="file" required />
      <button type="submit" aria-disabled={pending}>
        {pending ? 'Creating...' : 'Create'}
      </button>
      <p aria-live="polite" role="status">
        {state?.message}
      </p>

      {state?.guide && <GuideRenderer {...state.guide} />}
    </form>
  );
}
