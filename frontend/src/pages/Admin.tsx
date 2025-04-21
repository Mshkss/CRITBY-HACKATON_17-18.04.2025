
import { useState, useEffect } from "react";
import RequestList from "../components/RequestList";
import RequestDetail from "../components/RequestDetail";
import ProposalGenerator from "../components/ProposalGenerator";
import MessagePanel from "../components/MessagePanel";
import { CustomerRequest, CommercialProposal, Message } from "../types";
import { parseCSV, sampleCSV } from "../utils/csvUtils";
import { generateRandomRequests } from "../utils/randomGenerator";
import { toast } from "../hooks/use-toast";

const REQUEST_CHECK_INTERVAL = 300000; // 5 minutes in milliseconds
const REQUEST_EXPIRY_TIME = 3600000; // 1 hour in milliseconds

const Index = () => {
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(null);
  const [showProposalGenerator, setShowProposalGenerator] = useState(false);
  const [showMessagePanel, setShowMessagePanel] = useState(false);

  useEffect(() => {
    // Load sample data on initial mount
    const initialData = parseCSV(sampleCSV);
    setRequests(initialData);
  }, []);

  useEffect(() => {
    // Check for expired requests every 5 minutes
    const interval = setInterval(() => {
      setRequests(currentRequests => 
        currentRequests.map(request => {
          if (request.status === 'Новая') {
            const timeSinceLastUpdate = new Date().getTime() - new Date(request.lastUpdated || request.timestamp).getTime();
            if (timeSinceLastUpdate > REQUEST_EXPIRY_TIME) {
              return { ...request, status: 'Просрочено' };
            }
          }
          return request;
        })
      );
    }, REQUEST_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const handleSelectRequest = (request: CustomerRequest) => {
    setSelectedRequest(request);
  };

  const handleUpdateRequest = (updatedRequest: CustomerRequest) => {
    const newRequests = requests.map(req => 
      req.id === updatedRequest.id ? {
        ...updatedRequest,
        lastUpdated: new Date().toISOString()
      } : req
    );
    setRequests(newRequests);
    setSelectedRequest({
      ...updatedRequest,
      lastUpdated: new Date().toISOString()
    });
    
    toast({
      title: "Заявка обновлена",
      description: "Изменения успешно сохранены",
      variant: "default",
    });
  };

  const handleDeleteRequest = (requestId: string) => {
    setRequests(requests.filter(req => req.id !== requestId));
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(null);
    }
    
    toast({
      title: "Заявка удалена",
      description: "Заявка успешно удалена из системы",
      variant: "default",
    });
  };

  const handleGenerateRequests = (count: number = 5) => {
    const newRequests = generateRandomRequests(count);
    setRequests([...requests, ...newRequests]);
    
    toast({
      title: "Тестовые заявки созданы",
      description: `Добавлено ${newRequests.length} новых заявок`,
      variant: "default",
    });
  };

  const handleOpenProposalGenerator = (request: CustomerRequest) => {
    setSelectedRequest(request);
    setShowProposalGenerator(true);
    setShowMessagePanel(false);
  };

  const handleOpenMessagePanel = (request: CustomerRequest) => {
    setSelectedRequest(request);
    setShowMessagePanel(true);
    setShowProposalGenerator(false);
  };

  const handleSendMessage = (requestId: string, content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      requestId,
      content,
      timestamp: new Date().toISOString(),
      isFromManager: true
    };

    setRequests(currentRequests =>
      currentRequests.map(req =>
        req.id === requestId
          ? { ...req, messages: [...(req.messages || []), newMessage] }
          : req
      )
    );

    if (selectedRequest?.id === requestId) {
      setSelectedRequest(current => current ? {
        ...current,
        messages: [...(current.messages || []), newMessage]
      } : null);
    }

    toast({
      title: "Сообщение отправлено",
      description: "Сообщение успешно отправлено клиенту",
      variant: "default",
    });
  };

  const handleSendProposal = (proposal: CommercialProposal, emailComment: string) => {
    console.log("Sending proposal:", proposal);
    console.log("With comment:", emailComment);
    
    const updatedRequest = { 
      ...selectedRequest!, 
      status: "Отправлено КП" as const,
      comments: selectedRequest!.comments 
        ? `${selectedRequest!.comments}\n\nОтправлено КП: ${new Date().toLocaleString("ru-RU")}`
        : `Отправлено КП: ${new Date().toLocaleString("ru-RU")}`
    };
    
    handleUpdateRequest(updatedRequest);
    setShowProposalGenerator(false);
    
    toast({
      title: "Коммерческое предложение отправлено",
      description: `КП успешно отправлено на адрес ${selectedRequest!.email}`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="mx-auto w-full max-w-4xl">
            <RequestList 
              requests={requests} 
              onSelectRequest={handleSelectRequest}
              onGenerateRequests={handleGenerateRequests}
              onDeleteRequest={handleDeleteRequest}
            />
          </div>
          
          {selectedRequest && (
            <div className="w-full">
              <RequestDetail 
                request={selectedRequest} 
                onUpdateRequest={handleUpdateRequest}
                onOpenProposalGenerator={handleOpenProposalGenerator}
                onOpenMessagePanel={handleOpenMessagePanel}
                onDelete={() => selectedRequest && handleDeleteRequest(selectedRequest.id)}
              />
              
              {showMessagePanel && selectedRequest && (
                <MessagePanel
                  request={selectedRequest}
                  onClose={() => setShowMessagePanel(false)}
                  onSendMessage={(content) => handleSendMessage(selectedRequest.id, content)}
                />
              )}
            </div>
          )}
        </div>
      </main>
      
      {showProposalGenerator && selectedRequest && (
        <ProposalGenerator 
          request={selectedRequest}
          onClose={() => setShowProposalGenerator(false)}
          onSendProposal={handleSendProposal}
        />
      )}
    </div>
  );
};

export default Index;
