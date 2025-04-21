import { useState, useEffect } from "react";
import { CustomerRequest, RequestStatus } from "../types";
import { Search, Filter, RefreshCw, Trash2 } from "lucide-react";
import { products, getProductById } from "../data/products";

interface RequestListProps {
  requests: CustomerRequest[];
  onSelectRequest: (request: CustomerRequest) => void;
  onGenerateRequests: (count: number) => void;
  onDeleteRequest: (id: string) => void;
}

const RequestList = ({ requests, onSelectRequest, onGenerateRequests, onDeleteRequest }: RequestListProps) => {
  const [filteredRequests, setFilteredRequests] = useState<CustomerRequest[]>(requests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "">("");

  useEffect(() => {
    let result = [...requests];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (req) =>
          req.fullName.toLowerCase().includes(term) ||
          req.email.toLowerCase().includes(term) ||
          req.phoneNumber.includes(term)
      );
    }
    
    if (statusFilter) {
      result = result.filter((req) => req.status === statusFilter);
    }
    
    setFilteredRequests(result);
  }, [requests, searchTerm, statusFilter]);

  const getProductsString = (productIds: string[]) => {
    return productIds.map(id => {
      const product = getProductById(id);
      return product ? product.name : id;
    }).join(', ');
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
      case "Просрочено":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Список заявок</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по имени, email, телефону"
                className="w-full md:w-64 pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as RequestStatus | "")}
              >
                <option value="">Все статусы</option>
                <option value="Новая">Новая</option>
                <option value="В работе">В работе</option>
                <option value="Отправлено КП">Отправлено КП</option>
                <option value="Закрыто">Закрыто</option>
                <option value="Отменено">Отменено</option>
                <option value="Просрочено">Просрочено</option>
              </select>
              <Filter className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <button
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => onGenerateRequests(5)}
            >
              <RefreshCw className="h-4 w-4" />
              <span>+5 заявок</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ФИО</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Контакты</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товары</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата заявки</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr 
                  key={request.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelectRequest(request)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.fullName}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{request.phoneNumber}</div>
                    <div className="text-sm text-gray-500">{request.email}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                      {getProductsString(request.products)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(request.timestamp)}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRequest(request.id);
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {requests.length === 0 
                    ? "Нет доступных заявок. Используйте кнопку 'Генерировать заявки' для создания тестовых данных." 
                    : "Нет заявок, соответствующих заданным критериям поиска."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestList;
