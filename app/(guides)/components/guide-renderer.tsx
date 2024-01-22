import { Fragment } from 'react';
import { Guide } from '../lib/types';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type GuideRendererProps = React.HTMLAttributes<'section'> & { guide: Guide };

export default function GuideRenderer({ guide, className }: GuideRendererProps) {
  return (
    <section className={cn('flex flex-col', className)}>
      <Typography as="h1" variant="title3">
        {guide.title}
      </Typography>

      <div className="mt-6">
        {guide.steps.map(({ title, description, videoUrl }, index) => (
          <Fragment key={index}>
            <Typography as="h2" variant="title4" className="[&:not(:first-child)]:mt-16">
              {title}
            </Typography>

            <Typography as="p" variant="paragraph" className="mb-4">
              {description}
            </Typography>

            <video src={videoUrl} controls className="rounded-xl" />
          </Fragment>
        ))}
      </div>
    </section>
  );
}
