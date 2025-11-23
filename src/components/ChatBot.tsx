import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Send, User, Bot, X, Minimize2, Maximize2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
// Import the helper function we created
import { runChat } from '../config/gemini' 

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatBotProps {
  isOpen?: boolean
  onToggle?: () => void
}

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen = false, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m Dr. LifeSaver, your organ donation assistant. I can help you with registration, eligibility, and support. How can I assist you today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // 1. Add User Message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    // Update UI immediately
    const newHistory = [...messages, userMessage];
    setMessages(newHistory)
    setInput('')
    setIsLoading(true)

    try {
      // 2. Call Gemini API directly (Client-side)
      // We pass the input and the previous messages for context
      const aiResponseText = await runChat(input.trim(), messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to Dr. LifeSaver. Please try again.",
        variant: "destructive"
      })
      // Optional: remove the user message if it failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] z-50 transition-all duration-300 ${isMinimized ? 'h-auto' : ''}`}>
      <Card className="card-shadow bg-card border-border shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5 rounded-t-xl">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm">Dr. LifeSaver (OrganConnect)</CardTitle>
              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Online
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <>
            <CardContent className="p-0">
              <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background/50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-primary' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <Bot className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      <p className={`text-[10px] mt-1 opacity-70 text-right ${
                        message.role === 'user' ? 'text-primary-foreground' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-border bg-background">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Dr. LifeSaver..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="shadow-md"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                  AI can make mistakes. Please consult a doctor for medical advice.
                </p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}