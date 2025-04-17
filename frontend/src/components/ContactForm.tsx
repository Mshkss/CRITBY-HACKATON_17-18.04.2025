
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ContactFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  additionalInfo: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    additionalInfo: '',
  });

  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Отправляем данные формы
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Успешно отправлено:", result);
        toast({ title: "Успех", description: "Данные успешно отправлены!" });
        onSubmit(formData); // Вызываем onSubmit для родительского компонента
      } else {
        console.error("Ошибка сервера:", await response.text());
        toast({ title: "Ошибка", description: "Не удалось отправить данные." });
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      toast({ title: "Ошибка сети", description: "Проверьте подключение к интернету." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-medium">
        Отправить заявку:
      </h2>
      <p className="text-gray-600">
        Заполните свои контактные данные
      </p>
      
      <div className="w-full h-px bg-gray-200 my-4" />
      
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          ФИО
        </label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Телефон
        </label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
          Дополнительная информация
        </label>
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          className="w-full min-h-[100px]"
        />
      </div>
      
      <div className="w-full h-px bg-gray-200 my-4" />
      
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">
          Отправить
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
