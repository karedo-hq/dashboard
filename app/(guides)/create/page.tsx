import { Typography } from '@/components/ui/typography';
import { CreateGuideForm } from './create-guide-form';

export default function CreateGuidePage() {
  return (
    <>
      <Typography variant="title4" as="h1">
        Create guide
      </Typography>
      <CreateGuideForm />
    </>
  );
}
