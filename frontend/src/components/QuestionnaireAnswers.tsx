
import React from 'react';
import { QuestionnaireAnswers as IQuestionnaireAnswers } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { ClipboardList } from "lucide-react";

interface QuestionnaireAnswersProps {
  answers?: IQuestionnaireAnswers;
}

const QuestionnaireAnswers: React.FC<QuestionnaireAnswersProps> = ({ answers }) => {
  if (!answers) {
    return (
      <div className="text-gray-500 italic">
        Нет ответов на опросник
      </div>
    );
  }

  const renderList = (items: string[]) => {
    return items.map((item, index) => (
      <li key={index} className="ml-4">• {item}</li>
    ));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ClipboardList className="h-4 w-4" />
          Ответы на опросник
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ответы на опросник</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80vh] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="font-semibold mb-2">Раздел 1: Тип и Основная Задача</h3>
              <p><span className="font-medium">Тип оборудования:</span> {answers.equipmentType}</p>
              <div>
                <p className="font-medium">Основные задачи:</p>
                <ul className="mt-1">{renderList(answers.mainTasks)}</ul>
              </div>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Раздел 2: Требования к Полету БПЛА</h3>
              <p><span className="font-medium">Продолжительность полета:</span> {answers.flightDuration}</p>
              <p><span className="font-medium">Дальность управления:</span> {answers.controlRange}</p>
              <p><span className="font-medium">Грузоподъемность:</span> {answers.payload}</p>
              <p><span className="font-medium">VTOL:</span> {answers.vtol ? 'Да' : 'Нет'}</p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Раздел 3: Требования к Данным</h3>
              <div>
                <p className="font-medium">Типы данных:</p>
                <ul className="mt-1">{renderList(answers.dataTypes)}</ul>
              </div>
              <p><span className="font-medium">Стабилизация:</span> {answers.stabilization ? 'Да' : 'Нет'}</p>
              <p><span className="font-medium">Передача видео в реальном времени:</span> {answers.realtimeVideo ? 'Да' : 'Нет'}</p>
              <p><span className="font-medium">Передача тяжелых данных в реальном времени:</span> {answers.realtimeHeavyData ? 'Да' : 'Нет'}</p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Раздел 4: Функции и Возможности</h3>
              <div>
                <p className="font-medium">Автоматизация:</p>
                <ul className="mt-1">{renderList(answers.automation)}</ul>
              </div>
              <p><span className="font-medium">Быстрая подготовка:</span> {answers.quickPreparation ? 'Да' : 'Нет'}</p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Раздел 5: Условия Эксплуатации</h3>
              <p><span className="font-medium">Температурный режим:</span> {answers.temperatureMode}</p>
              <p><span className="font-medium">Скорость ветра:</span> {answers.windSpeed}</p>
              <p><span className="font-medium">Ночные полеты:</span> {answers.nightFlights ? 'Да' : 'Нет'}</p>
              <p><span className="font-medium">Работа без инфраструктуры:</span> {answers.noInfrastructure ? 'Да' : 'Нет'}</p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Раздел 6: Компоненты и Прочее</h3>
              <div>
                <p className="font-medium">Компоненты:</p>
                <ul className="mt-1">{renderList(answers.components)}</ul>
              </div>
              <div>
                <p className="font-medium">Требования к ПДУ:</p>
                <ul className="mt-1">{renderList(answers.remoteControlFeatures)}</ul>
              </div>
              <div>
                <p className="font-medium">Комплектация:</p>
                <ul className="mt-1">{renderList(answers.equipment)}</ul>
              </div>
              <p><span className="font-medium">Страна производства:</span> {answers.countryOfOrigin}</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionnaireAnswers;
