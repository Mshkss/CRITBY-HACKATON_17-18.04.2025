
import React, { useState } from 'react';
import { CustomerRequest } from '../types/index';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, X } from 'lucide-react';

interface MessagePanelProps {
  request: CustomerRequest;
  onClose: () => void;
  onSendMessage: (content: string) => void;
}

const MessagePanel: React.FC<MessagePanelProps> = ({ request, onClose, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Переписка с клиентом
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {request.messages?.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromManager ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.isFromManager
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
            ))}
            
            {(!request.messages || request.messages.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                Нет сообщений
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Textarea
          placeholder="Введите сообщение..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend}>
          <Send className="h-4 w-4 mr-2" />
          Отправить
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MessagePanel;
