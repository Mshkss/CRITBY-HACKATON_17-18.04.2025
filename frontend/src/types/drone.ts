
export interface DroneEstimatedPrice {
  min: number;
  max: number;
}

export interface DroneConfiguration {
  scenario: string;
  model: string;
  category: string;
  flightTime: number;
  range: number;
  payloadType: string;
  battery: string;
  description: string;
  estimatedPrice: DroneEstimatedPrice;
  isCustom: boolean;
}

export interface ScenarioOption {
  id: string;
  title: string;
  description: string;
  defaultConfiguration: Partial<DroneConfiguration>;
}
