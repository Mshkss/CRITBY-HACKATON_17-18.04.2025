
export interface TimingData {
  sessionStart: number;
  aiChatDuration?: number;
  questionTimings: {
    [questionId: string]: {
      startTime: number;
      endTime?: number;
      duration?: number;
    }
  };
  totalSurveyTime?: number;
}

export interface AnalyticsPayload {
  timingData: TimingData;
  responses: Record<string, any>;
  contactData: Record<string, any>;
  tags: string[];
}
