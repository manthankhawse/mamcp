"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Send, Radio, History, Book, Zap, Key } from "lucide-react";


export function EncryptedMorseCodeAppComponent() {
  const [receivedMessage, setReceivedMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [key, setKey] = useState("")
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [decrypted, setDecrypted] = useState(false);

  const showErrorToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  function generateShifts(secret) {
    return secret.toLowerCase().split('').map(char => char.charCodeAt(0) - 'a'.charCodeAt(0));
}

function decrypt(text, secret) {
    const shifts = generateShifts(secret).map(shift => 26 - shift);
    const result = [];
    const charCodeA = 'A'.charCodeAt(0);
    const charCodea = 'a'.charCodeAt(0);
    let shiftIndex = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const shift = shifts[shiftIndex % shifts.length];

        if (char >= 'A' && char <= 'Z') {
            result.push(String.fromCharCode(((char.charCodeAt(0) - charCodeA + shift) % 26) + charCodeA));
            shiftIndex++;
        } else if (char >= 'a' && char <= 'z') {
            result.push(String.fromCharCode(((char.charCodeAt(0) - charCodea + shift) % 26) + charCodea));
            shiftIndex++;
        } else {
            result.push(char); 
        }
    }

    return result.join('');
}

const decryptMessages = () => {
  if (key !== "SECRET") {
    showErrorToast("Incorrect key! Please try again.");
    return;
  }

  if(decrypted){
    showErrorToast("Messages already decrypted");
    return;
  }

  const newHistory = history.map((obj) => ({
    ...obj,
    message: decrypt(obj.message, key),
  }));

  setHistory(newHistory);
  setReceivedMessage(newHistory[0]?.message || "");
  setDecrypted(true);
};
  

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/recieve?sender=0');
        const result = await response.json();
        if (result.success) {
          const fetchedHistory = result.data.map((msg) => ({
            timestamp: new Date(msg.createdAt),
            message: msg.message,
            type: 'received',
          }));

          setHistory(fetchedHistory);

          if (fetchedHistory.length > 0) {
            setReceivedMessage(fetchedHistory[0].message);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    try {
      const response = await fetch(`/api/send?message=${encodeURIComponent(inputMessage)}&sender=1`);

      if (!response.ok) {
        console.error('Failed to send message');
        return;
      }

      console.log(`Message sent: ${inputMessage}`);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-800 border-gray-700">
      {showToast && (
          <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-md flex items-center space-x-2">
            <AlertCircle />
            <span>{toastMessage}</span>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-white">
            Encrypted Morse Code Encoder/Decoder
          </CardTitle>
          <CardDescription className="text-center text-white">
            Receive and send encrypted Morse code messages with real-time history
          </CardDescription>
        </CardHeader>
        <div className='flex gap-4 px-4 py-2'>
        <Input
                          type="text"
                          value={key}
                          onChange={(e) => setKey(e.target.value)}
                          placeholder="Enter message to send"
                          className="bg-gray-700 border-gray-600 text-white border-white"
                        />
          <Button className="text-gray-600 bg-white text-semibold" onClick={decryptMessages}>
            <Key/>
            Decrypt
          </Button>
        </div>
        <CardContent>
          <div className="space-y-6">
            <Tabs defaultValue="receive" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800 text-white">
                <TabsTrigger value="receive">Receive</TabsTrigger>
                <TabsTrigger value="send">Send</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="receive">
                <Card className="bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Radio className="mr-2" />
                      Received Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-700 rounded-md">
                        <p className="text-green-400">
                          Decoded: {receivedMessage}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="send">
                <Card className="bg-gray-800 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Send className="mr-2" />
                      Send Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Enter message to send"
                          className="bg-gray-700 border-gray-600 text-white border-white"
                        />
                        <Button className="bg-gray-600" onClick={handleSendMessage}>
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history">
                <Card className="text-white bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <History className="mr-2" />
                      Message History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] w-full rounded-md border border-white p-4">
                      <ul className="space-y-2">
                        {history.map((item, index) => (
                          <li
                            key={index}
                            className={`p-2 rounded-md ${item.type === 'sent' ? 'bg-blue-900' : 'bg-green-900'}`}
                          >
                            <span className="text-xs text-gray-400">
                              {item.timestamp.toLocaleTimeString()}
                            </span>
                            <p
                              className={`font-mono ${
                                item.type === 'sent' ? 'text-blue-300' : 'text-green-300'
                              }`}
                            >
                              {item.type === 'sent' ? 'Sent: ' : 'Received: '}
                              {item.message}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
