"use client";
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Send, Radio, History, Book, Zap, Key } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"

// Morse code dictionary
const morseCodeDict = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
}

// Reverse morse code dictionary
const reverseMorseCodeDict = Object.fromEntries(Object.entries(morseCodeDict).map(([key, value]) => [value, key]))

// Function to convert text to Morse code
const textToMorse = (text) => {
  return text.toUpperCase().split('').map(char => morseCodeDict[char] || char).join(' ');
}

// Function to convert Morse code to text
const morseToText = (morse) => {
  return morse.split(' ').map(code => reverseMorseCodeDict[code] || code).join('');
}

// Simple encryption function (XOR with key)
const encrypt = (text, key) => {
  return text
    .split('')
    .map(
    (char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  )
    .join('');
}

// Decryption function (same as encryption due to XOR properties)
const decrypt = encrypt

// Simulated hardware connection
const simulateHardwareConnection = (callback) => {
  const messages = [
    "HELLO WORLD",
    "SOS",
    "THIS IS A TEST",
    "MORSE CODE IS FUN"
  ]
  
  setInterval(() => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    callback(textToMorse(randomMessage))
  }, 5000)
}

export function EncryptedMorseCodeAppComponent() {
  const [receivedMessage, setReceivedMessage] = useState("")
  const [decodedMessage, setDecodedMessage] = useState("")
  const [inputMessage, setInputMessage] = useState("")
  const [sentMessages, setSentMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [history, setHistory] = useState([])
  const [encryptionKey, setEncryptionKey] = useState("SECRET")
  const [showDecrypted, setShowDecrypted] = useState(false)

  useEffect(() => {
    // Simulate connecting to hardware
    setTimeout(() => setIsConnected(true), 2000)

    // Simulate receiving messages from hardware
    simulateHardwareConnection((message) => {
      setReceivedMessage(message)
      const decoded = morseToText(message)
      const encrypted = encrypt(decoded, encryptionKey)
      setDecodedMessage(encrypted)
      setHistory(
        prev => [...prev, { timestamp: new Date(), message: decoded, encryptedMessage: encrypted, type: 'received' }]
      )
    })
  }, [encryptionKey])

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return
    const morseMessage = textToMorse(inputMessage)
    const encrypted = encrypt(inputMessage, encryptionKey)
    setSentMessages(prev => [...prev, morseMessage])
    setHistory(
      prev => [...prev, { timestamp: new Date(), message: inputMessage, encryptedMessage: encrypted, type: 'sent' }]
    )
    setInputMessage("")
    // Here you would typically send the Morse code to your hardware
    console.log("Sending to hardware:", morseMessage)
  }

  return (
    (<div
      className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-white">Encrypted Morse Code Encoder/Decoder</CardTitle>
          <CardDescription className="text-center text-white">
            Receive and send encrypted Morse code messages with real-time history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                <span className="text-sm text-white">{isConnected ? 'Connected' : 'Connecting...'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="encryption-key" className="text-white">Encryption Key:</Label>
              <Input
                id="encryption-key"
                type="password"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                className="bg-white border-gray-600 text-black" />
              <Button
                className="text-white bg-gray-800 hover:text-gray-800"
                variant="outline"
                size="sm"
                onClick={() => setShowDecrypted(!showDecrypted)}>
                <Key className="w-4 h-4 mr-2" />
                {showDecrypted ? 'Hide' : 'Show'} Decrypted
              </Button>
            </div>
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
                        <p className="font-mono text-yellow-400">{receivedMessage}</p>
                      </div>
                      <div className="p-2 bg-gray-700 rounded-md">
                        <p className="text-green-400">
                          Decoded: {showDecrypted ? decrypt(decodedMessage, encryptionKey) : decodedMessage}
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
                          className="bg-gray-700 border-gray-600 text-white border-white"  />
                        <Button className="bg-gray-600" onClick={handleSendMessage} disabled={!isConnected}>
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Sent Messages (Morse):</h3>
                        <ScrollArea className="h-[200px] w-full rounded-md border border-white p-4">
                          <ul className="space-y-2">
                            {sentMessages.map((msg, index) => (
                              <li key={index} className="font-mono text-blue-400">{msg}</li>
                            ))}
                          </ul>
                        </ScrollArea>
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
                            className={`p-2 rounded-md ${item.type === 'sent' ? 'bg-blue-900' : 'bg-green-900'}`}>
                            <span className="text-xs text-gray-400">{item.timestamp.toLocaleTimeString()}</span>
                            <p
                              className={`font-mono ${item.type === 'sent' ? 'text-blue-300' : 'text-green-300'}`}>
                              {item.type === 'sent' ? 'Sent: ' : 'Received: '}
                              {showDecrypted ? item.message : item.encryptedMessage}
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
    </div>)
  );
}