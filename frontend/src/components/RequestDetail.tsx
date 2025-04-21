import { useState } from "react";
import { CustomerRequest, RequestStatus, Product } from "../types";
import { getProductById, getProductsByIds } from "../data/products";
import { Edit, Check, X, Send, ReceiptText, PenSquare, MessageSquare, Trash2 } from "lucide-react";
import QuestionnaireAnswers from './QuestionnaireAnswers';

interface RequestDetailProps {
  request: CustomerRequest | null;
  onUpdateRequest: (updatedRequest: CustomerRequest) => void;
  onOpenProposalGenerator: (request: CustomerRequest) => void;
  onOpenMessagePanel: (request: CustomerRequest) => void;
  onDelete: () => void;
}

const RequestDetail = ({ 
  request, 
  onUpdateRequest, 
  onOpenProposalGenerator,
  onOpenMessagePanel,
  onDelete
}: RequestDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRequest, setEditedRequest] = useState<CustomerRequest | null>(request);
  
  if (!request) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Выберите заявку для просмотра деталей</p>
      </div>
    );
  }
  
  if (!editedRequest) {
    setEditedRequest(request);
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedRequest({ ...editedRequest, [name]: value });
  };

  const handleSave = () => {
    if (editedRequest) {
      onUpdateRequest(editedRequest);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedRequest(request);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "Новая":
        return "bg-blue-100 text-blue-800";
      case "В работе":
        return "bg-yellow-100 text-yellow-800";
      case "Отправлено КП":
        return "bg-green-100 text-green-800";
      case "Закрыто":
        return "bg-gray-100 text-gray-800";
      case "Отменено":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getProductsList = (productIds: string[]): Product[] => {
    return productIds
      .map(id => getProductById(id))
      .filter((product): product is Product => product !== undefined);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Детали заявки</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                className="inline-flex items-center px-2.5 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                onClick={handleSave}
              >
                <Check className="h-4 w-4 mr-1" />
                <span>Сохранить</span>
              </button>
              <button
                className="inline-flex items-center px-2.5 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-1" />
                <span>Отменить</span>
              </button>
            </>
          ) : request && (
            <>
              <button
                className="inline-flex items-center px-2.5 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                <span>Редактировать</span>
              </button>
              <QuestionnaireAnswers answers={request.questionnaireAnswers} />
              <button
                className="inline-flex items-center px-2.5 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                onClick={() => onOpenProposalGenerator(request)}
              >
                <ReceiptText className="h-4 w-4 mr-1" />
                <span>КП</span>
              </button>
              <button
                className="inline-flex items-center px-2.5 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                onClick={() => onOpenMessagePanel(request)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>Сообщения</span>
              </button>
              <button
                className="inline-flex items-center px-2.5 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span>Удалить</span>
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700">Информация о клиенте</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">ФИО</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={editedRequest.fullName}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1">{request.fullName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Телефон</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={editedRequest.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1">{request.phoneNumber}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedRequest.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1">{request.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Дата обращения</label>
              <p className="mt-1">{formatDate(request.timestamp)}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Статус</label>
              {isEditing ? (
                <select
                  name="status"
                  value={editedRequest.status}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Новая">Новая</option>
                  <option value="В работе">В работе</option>
                  <option value="Отправлено КП">Отправлено КП</option>
                  <option value="Закрыто">Закрыто</option>
                  <option value="Отменено">Отменено</option>
                </select>
              ) : (
                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700">Интересующие продукты</h3>
            
            <div className="space-y-2">
              {getProductsList(request.products).map((product) => (
                <div 
                  key={product.id} 
                  className="p-3 border border-gray-200 rounded-md"
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-500">Комментарии</label>
              {isEditing ? (
                <textarea
                  name="comments"
                  value={editedRequest.comments}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="mt-1 p-3 bg-gray-50 rounded-md min-h-[100px]">
                  {request.comments || "Нет комментариев"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
