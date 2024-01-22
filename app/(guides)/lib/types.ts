export type GuideStep = {
  title: string;
  description: string;
  videoUrl: string;
};

export type Guide = {
  title: string;
  steps: GuideStep[];
};
