
import { CustomerRequest, RequestStatus } from '../types';
import { getRandomProducts } from '../data/products';

const RUSSIAN_MALE_NAMES = [
  'Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артём', 'Илья',
  'Кирилл', 'Михаил', 'Никита', 'Матвей', 'Роман', 'Егор', 'Арсений', 'Иван',
  'Денис', 'Евгений', 'Даниил', 'Тимофей', 'Владислав', 'Игорь', 'Владимир', 'Павел',
  'Руслан', 'Марк', 'Константин', 'Тимур', 'Олег', 'Ярослав'
];

const RUSSIAN_FEMALE_NAMES = [
  'Анастасия', 'Мария', 'Анна', 'Виктория', 'Екатерина', 'Наталья', 'Марина', 'Полина',
  'Ольга', 'Александра', 'Дарья', 'Татьяна', 'Юлия', 'Елена', 'Алина', 'Ирина',
  'Кристина', 'Ксения', 'Валерия', 'Светлана', 'Вероника', 'Софья', 'София', 'Елизавета',
  'Ульяна', 'Диана', 'Яна', 'Алёна', 'Евгения', 'Оксана'
];

const RUSSIAN_SURNAMES = [
  'Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов',
  'Новиков', 'Фёдоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семёнов', 'Егоров',
  'Павлов', 'Козлов', 'Степанов', 'Николаев', 'Орлов', 'Андреев', 'Макаров', 'Никитин',
  'Захаров', 'Зайцев', 'Соловьёв', 'Борисов', 'Яковлев', 'Григорьев', 'Романов'
];

const COMPANY_DOMAINS = [
  'mail.ru', 'yandex.ru', 'gmail.com', 'rambler.ru', 'outlook.com',
  'company.ru', 'siberia.ru', 'roscosmos.ru', 'rosteh.ru', 'gazprom.ru',
  'transneft.ru', 'rosneft.ru', 'rosseti.ru', 'rzhd.ru', 'sberbank.ru'
];

const REQUEST_STATUSES: RequestStatus[] = ['Новая', 'В работе', 'Отправлено КП', 'Закрыто', 'Отменено'];

const COMMENTS = [
  '',
  'Запрос цены',
  'Нужна консультация специалиста',
  'Срочный заказ',
  'Требуется демонстрация',
  'Интересуют условия поставки',
  'Нужны технические характеристики',
  'Проработка индивидуального заказа',
  'Уточнение комплектации',
  'Запрос гарантийных условий'
];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomFullName = (): string => {
  const isMale = Math.random() > 0.5;
  
  const firstName = isMale 
    ? getRandomElement(RUSSIAN_MALE_NAMES) 
    : getRandomElement(RUSSIAN_FEMALE_NAMES);
  
  let surname = getRandomElement(RUSSIAN_SURNAMES);
  if (!isMale) {
    surname += 'а'; // Female surname form
  }
  
  const patronymic = isMale 
    ? getRandomElement(RUSSIAN_MALE_NAMES) + 'ович' 
    : getRandomElement(RUSSIAN_MALE_NAMES) + 'овна';
  
  return `${surname} ${firstName} ${patronymic}`;
};

const getRandomPhoneNumber = (): string => {
  const prefix = '7';
  const code = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  const number1 = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  const number2 = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  
  return `${prefix}${code}${number1}${number2}`;
};

const getRandomEmail = (fullName: string): string => {
  const [surname, firstName] = fullName.split(' ');
  const latinizedName = firstName.toLowerCase()
    .replace('а', 'a').replace('б', 'b').replace('в', 'v').replace('г', 'g')
    .replace('д', 'd').replace('е', 'e').replace('ё', 'e').replace('ж', 'zh')
    .replace('з', 'z').replace('и', 'i').replace('й', 'y').replace('к', 'k')
    .replace('л', 'l').replace('м', 'm').replace('н', 'n').replace('о', 'o')
    .replace('п', 'p').replace('р', 'r').replace('с', 's').replace('т', 't')
    .replace('у', 'u').replace('ф', 'f').replace('х', 'h').replace('ц', 'ts')
    .replace('ч', 'ch').replace('ш', 'sh').replace('щ', 'sch').replace('ъ', '')
    .replace('ы', 'y').replace('ь', '').replace('э', 'e').replace('ю', 'yu')
    .replace('я', 'ya');
  
  const domain = getRandomElement(COMPANY_DOMAINS);
  
  return `${latinizedName}@${domain}`;
};

const getRandomDate = (daysBack: number = 30): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(
    Math.floor(Math.random() * 12) + 8, // Between 8 AM and 8 PM
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60)
  );
  
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

export const generateRandomRequest = (): CustomerRequest => {
  const fullName = getRandomFullName();
  const randomProducts = getRandomProducts(Math.floor(Math.random() * 3) + 1);
  const productIds = randomProducts.map(p => p.id);
  
  return {
    id: `req-${Date.now()}`,
    fullName,
    phoneNumber: getRandomPhoneNumber(),
    email: getRandomEmail(fullName),
    products: productIds,
    timestamp: getRandomDate(),
    status: getRandomElement(REQUEST_STATUSES),
    comments: getRandomElement(COMMENTS)
  };
};

export const generateRandomRequests = (count: number = 10): CustomerRequest[] => {
  return Array.from({ length: count }, () => generateRandomRequest());
};
