export type ProductCategory = 'БПЛА' | 'Авионика' | 'Системы связи' | 'Полезная нагрузка' | 'Двигатели и механизмы' | 'Системы анализа и ПО';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
}

export type RequestStatus = 'Новая' | 'В работе' | 'Отправлено КП' | 'Закрыто' | 'Отменено' | 'Просрочено';

export type EquipmentType = 'Готовый к полету беспилотник (БПЛА)' | 'Отдельный компонент для БПЛА' | 'Программное обеспечение для БПЛА';

export interface QuestionnaireAnswers {
  equipmentType: EquipmentType;
  mainTasks: string[];
  flightDuration: string;
  controlRange: string;
  payload: string;
  vtol: boolean;
  dataTypes: string[];
  stabilization: boolean;
  realtimeVideo: boolean;
  realtimeHeavyData: boolean;
  automation: string[];
  quickPreparation: boolean;
  temperatureMode: string;
  windSpeed: string;
  nightFlights: boolean;
  noInfrastructure: boolean;
  components: string[];
  remoteControlFeatures: string[];
  equipment: string[];
  countryOfOrigin: string;
}

export interface Message {
  id: string;
  requestId: string;
  content: string;
  timestamp: string;
  isFromManager: boolean;
}

export interface CustomerRequest {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  products: string[];
  timestamp: string;
  status: RequestStatus;
  comments: string;
  lastUpdated?: string;
  messages?: Message[];
  questionnaireAnswers?: QuestionnaireAnswers;
}

export interface CommercialProposal {
  requestId: string;
  customerName: string;
  products: Product[];
  totalPrice: number;
  date: string;
  comment: string;
}
