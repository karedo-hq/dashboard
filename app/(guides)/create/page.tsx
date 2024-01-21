import { CreateGuideForm } from './create-guide-form';

export default function CreateGuidePage() {
  return (
    <main className="flex min-h-screen flex-col p-16">
      <h1 className="font-bold text-lg">Create guide</h1>
      <CreateGuideForm />
    </main>
  );
}
