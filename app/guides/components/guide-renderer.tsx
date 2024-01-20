import { Fragment } from 'react';
import { Guide } from '../lib/types';

export default function GuideRenderer({ title, steps }: Guide) {
  return (
    <section>
      <h1>{title}</h1>

      {steps.map(({ title, description, videoUrl }, index) => (
        <Fragment key={index}>
          <h2>{title}</h2>
          <p>{description}</p>

          <video src={videoUrl} controls />
        </Fragment>
      ))}
    </section>
  );
}
