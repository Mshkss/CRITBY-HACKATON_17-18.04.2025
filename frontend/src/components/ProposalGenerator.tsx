
import { useState, useRef } from "react";
import { CustomerRequest, Product, CommercialProposal } from "../types";
import { getProductsByIds, getProductById, products, getProductsByCategory } from "../data/products";
import { X, Plus, Send, Download, Printer } from "lucide-react";

interface ProposalGeneratorProps {
  request: CustomerRequest;
  onClose: () => void;
  onSendProposal: (proposal: CommercialProposal, emailComment: string) => void;
}

const ProposalGenerator = ({ request, onClose, onSendProposal }: ProposalGeneratorProps) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    getProductsByIds(request.products)
  );
  const [emailComment, setEmailComment] = useState("");
  const proposalRef = useRef<HTMLDivElement>(null);
  
  const addProduct = (product: Product) => {
    if (!selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };
  
  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };
  
  const calculateTotal = () => {
    return selectedProducts.reduce((sum, product) => sum + product.price, 0);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };
  
  const generateProposal = (): CommercialProposal => {
    return {
      requestId: request.id,
      customerName: request.fullName,
      products: selectedProducts,
      totalPrice: calculateTotal(),
      date: new Date().toISOString(),
      comment: emailComment
    };
  };
  
  const handleSendProposal = () => {
    const proposal = generateProposal();
    onSendProposal(proposal, emailComment);
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && proposalRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Коммерческое предложение</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 800px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { height: 60px; }
              .company-info { margin-bottom: 20px; font-size: 14px; }
              h1 { font-size: 24px; text-align: center; margin: 30px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #f5f5f5; }
              .total-row td { font-weight: bold; }
              .footer { margin-top: 30px; font-size: 14px; }
            </style>
          </head>
          <body>
            ${proposalRef.current.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  
  const productCategories = Array.from(
    new Set(products.map(product => product.category))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold">Формирование коммерческого предложения</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left Panel - Product Selection */}
          <div className="w-full md:w-1/3 lg:w-1/4 p-4 overflow-y-auto border-r border-gray-200">
            <h3 className="font-medium mb-4">Каталог продуктов</h3>
            
            <div className="space-y-4">
              {productCategories.map(category => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-500">{category}</h4>
                  {getProductsByCategory(category).map(product => (
                    <div 
                      key={product.id}
                      className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => addProduct(product)}
                    >
                      <div>
                        <div className="text-sm font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">{formatPrice(product.price)} ₽</div>
                      </div>
                      <Plus className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Panel - Proposal Preview */}
          <div className="w-full md:w-2/3 lg:w-3/4 p-4 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-medium">Предпросмотр коммерческого предложения</h3>
                <div className="flex space-x-2">
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4" />
                    <span>Печать</span>
                  </button>
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    onClick={handleSendProposal}
                  >
                    <Send className="h-4 w-4" />
                    <span>Отправить</span>
                  </button>
                </div>
              </div>
              
              <div ref={proposalRef} className="container mx-auto">
                <div className="header">
                  <div className="flex items-center justify-between mb-2">
                    <img 
                      src="/lovable-uploads/da78eba3-356c-4f2b-abec-94269e0bfe30.png" 
                      alt="АВАКС Лого" 
                      className="logo h-12" 
                    />
                    <div className="text-right text-sm">
                      <div>тел.: +7 (391) 286-61-09</div>
                      <div>e-mail: info@uav-siberia.com</div>
                    </div>
                  </div>
                  
                  <div className="company-info text-left text-sm">
                    <div>ООО НПП «АВАКС-ГеоСервис»</div>
                    <div>660079, г. Красноярск, ул. Электриков, 156/1</div>
                    <div>ОГРН: 1122468015999</div>
                    <div>ИНН: 2461217337</div>
                  </div>
                </div>
                
                <h1 className="text-center font-bold text-xl mb-6">Коммерческое предложение</h1>
                <p className="mb-4 text-center">о поставке беспилотных летательных аппаратов</p>
                
                <div className="mb-6">
                  <p><strong>Заказчик:</strong> {request.fullName}</p>
                  <p><strong>Контактная информация:</strong> {request.email}, {request.phoneNumber}</p>
                </div>
                
                <h2 className="text-lg font-medium mb-4 text-center">ПЕРЕЧЕНЬ ПРЕДЛАГАЕМЫХ ТОВАРОВ</h2>
                
                <table className="w-full border-collapse mb-6">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border py-2 px-4 text-left">Наименование</th>
                      <th className="border py-2 px-4 text-right">Цена за единицу товара, руб.</th>
                      <th className="border py-2 px-4 text-center">Кол-во, к-т.</th>
                      <th className="border py-2 px-4 text-right">Сумма с НДС*, руб.</th>
                      <th className="border py-2 px-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="border py-2 px-4">{product.name}</td>
                        <td className="border py-2 px-4 text-right">{formatPrice(product.price)}</td>
                        <td className="border py-2 px-4 text-center">1</td>
                        <td className="border py-2 px-4 text-right">{formatPrice(product.price)}</td>
                        <td className="border py-2 px-2 text-center">
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeProduct(product.id)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td className="border py-2 px-4" colSpan={3} align="right">ИТОГО*:</td>
                      <td className="border py-2 px-4 text-right">{formatPrice(calculateTotal())}</td>
                      <td className="border py-2 px-4"></td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="text-sm mb-4">
                  <p>* - Не облагается НДС на основании п. 1 ст. 145.1 НК РФ.</p>
                  <p>Цены действительны до 28.02.2026.</p>
                  <p>Обучение двух человек на учебно-тренировочной базе производителя (территориально - г. Красноярск) включено в стоимость.</p>
                  <p>Доставка не включена в стоимость.</p>
                </div>
                
                <div className="text-sm mb-6">
                  <p>БПЛА являются серийными и производятся полностью в России. На БПЛА имеется сертификат происхождения (СТ-1). Локализация производства на предприятии-изготовителе составляет более 75%. БАС входят в реестр МинПромТорга.</p>
                </div>
                
                <h3 className="font-medium mb-2">ГАРАНТИЯ, СРОКИ И УСЛОВИЯ ПОСТАВКИ</h3>
                <div className="text-sm mb-6">
                  <p>Срок гарантии на узлы и агрегаты: 12 месяцев</p>
                  <p>Срок поставки: 6 месяцев</p>
                </div>
                
                <div className="text-sm text-center mt-8 border-t pt-4">
                  <p>info@uav-siberia.com</p>
                  <p>www.uav-siberia.com</p>
                  <p>+7 (391) 286 61 09</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Комментарий к письму</h3>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Введите комментарий, который будет отправлен вместе с КП"
                value={emailComment}
                onChange={(e) => setEmailComment(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalGenerator;
