export interface Sector {
  id: string;
  angle: number;
  startAngle: number;
  endAngle: number;
  color: string;
  x: number;
  y: number;
  rotation: number;
}

export type LearningStage = 'explore' | 'discover' | 'derive' | 'apply';

export interface Measurement {
  width: number;
  height: number;
}

export interface FormData {
  timestamp: string;
  stage: LearningStage;
  sectorCount: number;
  screenshot?: string;
  measurements?: Measurement;
  answers?: Record<string, string>;
  photo?: string;
  diameter?: number;
  calculatedArea?: number;
}







