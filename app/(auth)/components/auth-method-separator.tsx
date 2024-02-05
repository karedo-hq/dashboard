import { Typography } from '@/components/ui/typography';

export default function AuthMethodSeparator() {
  return (
    <div className="my-4 flex items-center justify-center space-x-2">
      <div className="h-px flex-grow bg-gray-200" />
      <Typography variant="small" className="text-gray-400">
        oder
      </Typography>
      <div className="h-px flex-grow bg-gray-200" />
    </div>
  );
}
