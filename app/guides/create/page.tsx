import { Typography } from '@/components/ui/typography';
import { CreateGuideForm } from './create-guide-form';

export default function CreateGuidePage() {
  return (
    <>
      <Typography variant="title3" as="h1" className="mb-4">
        Create guide
      </Typography>

      <CreateGuideForm />
    </>
  );
}
