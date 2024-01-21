export type CreateGuideResponse = {
  message: string;
  guide: Guide | null;
};

export type GuideStep = {
  title: string;
  description: string;
  videoUrl: string;
};

export type Guide = {
  title: string;
  steps: GuideStep[];
};
