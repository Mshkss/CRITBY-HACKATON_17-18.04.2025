import { SurveyQuestion, SurveySection } from "@/types/survey";

export const surveySections: SurveySection[] = [
  {
    id: 1,
    title: "Тип и Основная Задача",
    description: "Укажите ваши основные потребности для подбора оптимальной конфигурации"
  },
  {
    id: 2,
    title: "Требования к Полету БПЛА",
    description: "Характеристики полета беспилотного летательного аппарата"
  },
  {
    id: 3, 
    title: "Требования к Данным и Полезной Нагрузке",
    description: "Определите тип получаемых данных и требования к оборудованию"
  },
  {
    id: 4,
    title: "Функции и Возможности",
    description: "Выберите необходимые функциональные возможности"
  },
  {
    id: 5,
    title: "Условия Эксплуатации",
    description: "Укажите предполагаемые условия работы оборудования"
  },
  {
    id: 6,
    title: "Компоненты и Прочее",
    description: "Дополнительные требования к комплектации"
  }
];

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: "equipment_type",
    text: "1.1. Какой основной тип оборудования вам нужен?",
    section: 1,
    options: [
      { id: "equipment_type_1", text: "Готовый к полету беспилотник (БПЛА)", value: "тип_бпла" },
      { id: "equipment_type_2", text: "Отдельный компонент для БПЛА", value: "тип_компонент" },
      { id: "equipment_type_3", text: "Программное обеспечение для БПЛА", value: "тип_по" }
    ]
  },
  {
    id: "task_type",
    text: "1.2. Для каких основных задач будет использоваться оборудование?",
    section: 1,
    multiple: true,
    options: [
      { id: "task_type_1", text: "Мониторинг территории/объектов", value: "задача_мониторинг" },
      { id: "task_type_2", text: "Аэрофотосъемка", value: "задача_аэрофотосъемка" },
      { id: "task_type_3", text: "Картография / Топография", value: "задача_картография,задача_топография" },
      { id: "task_type_4", text: "Геодезия / Кадастр / Межевание", value: "задача_геодезия,задача_кадастр,задача_межевание" },
      { id: "task_type_5", text: "Визуальная инспекция инфраструктуры", value: "задача_инспекция_визуальная" },
      { id: "task_type_6", text: "Тепловизионная инспекция", value: "задача_инспекция_тепловизионная,пн_тепловизор" },
      { id: "task_type_7", text: "Задачи в сельском хозяйстве", value: "задача_сельское_хозяйство,задача_сх_анализ_посевов" },
      { id: "task_type_8", text: "Задачи в строительстве", value: "задача_строительство,задача_стр_контроль_работ" },
      { id: "task_type_9", text: "Задачи в горном деле", value: "задача_горное_дело,задача_мониторинг_отвалов" },
      { id: "task_type_10", text: "Задачи в дорожном хозяйстве", value: "задача_дорожное_хозяйство,задача_дор_паспортизация" },
      { id: "task_type_11", text: "Поиск и спасение", value: "задача_поиск_спасение" },
      { id: "task_type_12", text: "Доставка грузов", value: "задача_доставка_груза" },
      { id: "task_type_13", text: "Видеосъемка (как основная цель)", value: "задача_видеосъемка" }
    ]
  },
  {
    id: "flight_duration",
    text: "2.1. Требуемая продолжительность непрерывного полета:",
    section: 2,
    skipLogic: {
      dependsOn: "equipment_type",
      showWhen: ["тип_бпла"]
    },
    options: [
      { id: "flight_duration_1", text: "До 30 минут", value: "полет_продолжительность_до_30мин" },
      { id: "flight_duration_2", text: "30 - 60 минут", value: "полет_продолжительность_30-60мин" },
      { id: "flight_duration_3", text: "1 - 3 часа", value: "полет_продолжительность_1-3ч" },
      { id: "flight_duration_4", text: "3 - 6 часов", value: "полет_продолжительность_3-6ч" },
      { id: "flight_duration_5", text: "Более 6 часов", value: "полет_продолжительность_более_6ч" }
    ]
  },
  {
    id: "flight_distance",
    text: "2.2. Максимальная дальность управления и передачи данных от оператора:",
    section: 2,
    skipLogic: {
      dependsOn: "equipment_type",
      showWhen: ["тип_бпла"]
    },
    options: [
      { id: "flight_distance_1", text: "До 2 км", value: "полет_дальность_до_2км" },
      { id: "flight_distance_2", text: "2 - 10 км", value: "полет_дальность_2-10км" },
      { id: "flight_distance_3", text: "10 - 30 км", value: "полет_дальность_10-30км" },
      { id: "flight_distance_4", text: "30 - 100 км", value: "полет_дальность_30-100км" },
      { id: "flight_distance_5", text: "Глобальная дальность (спутниковая связь)", value: "полет_дальность_спутниковая,связь_спутник_iridium" }
    ]
  },
  {
    id: "payload_capacity",
    text: "2.3. Требуемая грузоподъемность (для вашей аппаратуры):",
    section: 2,
    skipLogic: {
      dependsOn: "equipment_type",
      showWhen: ["тип_бпла"]
    },
    options: [
      { id: "payload_capacity_0", text: "Не требуется (используется встроенная нагрузка)", value: "" },
      { id: "payload_capacity_1", text: "До 1 кг", value: "грузоподъемность_до_1кг" },
      { id: "payload_capacity_2", text: "1 - 3 кг", value: "грузоподъемность_1-3кг" },
      { id: "payload_capacity_3", text: "3 - 5 кг", value: "грузоподъемность_3-5кг" },
      { id: "payload_capacity_4", text: "Более 5 кг", value: "грузоподъемность_более_5кг" }
    ]
  },
  {
    id: "vtol",
    text: "2.4. Нужен ли вертикальный взлет и посадка (VTOL)?",
    section: 2,
    skipLogic: {
      dependsOn: "equipment_type",
      showWhen: ["тип_бпла"]
    },
    options: [
      { id: "vtol_1", text: "Да", value: "бпла_вертикальный_взлет_посадка" },
      { id: "vtol_2", text: "Нет (самолетный тип)", value: "бпла_самолетный_тип" }
    ]
  },
  {
    id: "data_type",
    text: "3.1. Тип получаемых данных:",
    section: 3,
    multiple: true,
    options: [
      { id: "data_type_1", text: "Видео стандартного качества (для контроля)", value: "пн_видеокамера" },
      { id: "data_type_2", text: "Видео высокого качества (HD/4K)", value: "пн_видеокамера_hd,пн_видеокамера_4k" },
      { id: "data_type_3", text: "Фотографии высокого разрешения", value: "пн_фотоаппарат_высокое_разрешение" },
      { id: "data_type_4", text: "Тепловизионные изображения", value: "пн_тепловизор" },
      { id: "data_type_5", text: "Мультиспектральные изображения", value: "пн_мультиспектр" }
    ]
  },
  {
    id: "stabilization",
    text: "3.2. Требуется ли стабилизация полезной нагрузки (гиростабилизированная платформа)?",
    section: 3,
    options: [
      { id: "stabilization_1", text: "Да", value: "функция_стабилизация_полезной_нагрузки,тип_гсп" },
      { id: "stabilization_2", text: "Нет", value: "" }
    ]
  },
  {
    id: "real_time_video",
    text: "3.3. Нужна ли передача видео в реальном времени на пульт?",
    section: 3,
    options: [
      { id: "real_time_video_1", text: "Да", value: "связь_канал_видео_реальное_время,функция_передача_видео_на_пду" },
      { id: "real_time_video_2", text: "Нет, достаточно записи на борту", value: "функция_запись_видео_на_борт" }
    ]
  },
  {
    id: "heavy_data",
    text: "3.4. Нужна ли передача \"тяжелых\" данных (видео HQ, LiDAR) в реальном времени?",
    section: 3,
    options: [
      { id: "heavy_data_1", text: "Да", value: "связь_широкополосная" },
      { id: "heavy_data_2", text: "Нет", value: "" }
    ]
  },
  // Adding more sections would make this too long, so continuing with just a few key questions
  {
    id: "automation_level",
    text: "4.1. Уровень автоматизации:",
    section: 4,
    multiple: true,
    options: [
      { id: "automation_level_1", text: "Полет по заранее заданному маршруту", value: "функция_автоматический_маршрут" },
      { id: "automation_level_2", text: "Полностью автономная работа (взлет-маршрут-посадка)", value: "функция_полная_автономность" },
      { id: "automation_level_3", text: "Автоматический возврат при потере связи/низком заряде", value: "функция_автовозврат_при_потере_связи,функция_автовозврат_при_низком_акб" },
      { id: "automation_level_4", text: "Автоматическая посадка при потере связи/низком заряде", value: "функция_автопосадка_при_потере_связи,функция_автопосадка_при_низком_акб" },
      { id: "automation_level_5", text: "Система предотвращения столкновений", value: "функция_предотвращение_столкновений" }
    ]
  },
  {
    id: "quick_preparation",
    text: "4.2. Требуется ли быстрая подготовка к полету (<15 мин)?",
    section: 4,
    options: [
      { id: "quick_preparation_1", text: "Да", value: "функция_быстрая_подготовка" },
      { id: "quick_preparation_2", text: "Нет", value: "" }
    ]
  },
  {
    id: "temperature_mode",
    text: "5.1. Температурный режим:",
    section: 5,
    options: [
      { id: "temperature_mode_1", text: "Стандартный (-10°C до +40°C)", value: "условия_температура_стандарт" },
      { id: "temperature_mode_2", text: "Расширенный (например, от -40°C)", value: "условия_температура_расширенная" }
    ]
  },
  {
    id: "wind_speed",
    text: "5.2. Максимальная ожидаемая скорость ветра при эксплуатации:",
    section: 5,
    options: [
      { id: "wind_speed_1", text: "До 10 м/с", value: "условия_ветер_до_10мс" },
      { id: "wind_speed_2", text: "Более 10 м/с", value: "условия_ветер_более_10мс" }
    ]
  },
  {
    id: "additional_requirements",
    text: "6.1. Дополнительные требования к комплектации:",
    section: 6,
    options: [],  // Empty options since this will be a textarea
    required: false
  }
];
