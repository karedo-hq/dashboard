import { Fragment } from 'react';
import { Guide } from '../lib/types';
import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { estimateGuideReadingTime } from '../lib/utils';

type GuideRendererProps = React.HTMLAttributes<'section'> & { guide: Guide };

export default function GuideRenderer({ guide, className }: GuideRendererProps) {
  return (
    <section className={cn('flex flex-col max-w-xl mx-auto', className)}>
      <Typography as="h1" variant="title3">
        {guide.title}
      </Typography>

      <div className="flex space-x-2 flex-1 items-center mt-4">
        <Badge variant="outline">{guide.steps.length} steps</Badge>

        <div className="w-px h-4 bg-slate-200 mx-2" />

        <Badge variant="outline">{estimateGuideReadingTime(guide)} min read</Badge>
      </div>

      <div className="mt-6">
        {guide.steps.map(({ title, description, videoUrl }, index) => (
          <Fragment key={index}>
            <Typography as="h2" variant="title4" className="[&:not(:first-child)]:mt-16">
              {title}
            </Typography>

            <Typography as="p" variant="paragraph" className="mb-4">
              {description}
            </Typography>

            <video src={videoUrl} controls className="rounded-xl" muted />
          </Fragment>
        ))}
      </div>
    </section>
  );
}
