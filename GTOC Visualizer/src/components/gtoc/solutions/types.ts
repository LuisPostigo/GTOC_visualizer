export type Vec3 = [number, number, number];

export type SamplePt = {
  t: number;
  p: Vec3;
  v?: Vec3;
  bodyId?: number;
  flag?: number;
};

export type Solution = {
  id: string;
  name: string;
  color: string;
  samples: SamplePt[];
};
