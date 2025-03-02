"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Bot, Send, User, Wallet, Plus, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"
import { AddWalletDialog } from "@/components/wallets/add-wallet-dialog"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  actions?: {
    type: "add-expense" | "add-wallet" | "view-transactions"
    label: string
  }[]
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your Woretto AI assistant. I can help you track expenses, manage wallets, and provide financial insights. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let assistantMessage: Message

      // Simple pattern matching for demo purposes
      if (input.toLowerCase().includes("add expense") || input.toLowerCase().includes("new expense")) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I can help you add a new expense. Would you like to do that now?",
          timestamp: new Date(),
          actions: [
            {
              type: "add-expense",
              label: "Add Expense",
            },
          ],
        }
      } else if (input.toLowerCase().includes("add wallet") || input.toLowerCase().includes("new wallet")) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I can help you create a new wallet. Would you like to add one now?",
          timestamp: new Date(),
          actions: [
            {
              type: "add-wallet",
              label: "Add Wallet",
            },
          ],
        }
      } else if (input.toLowerCase().includes("transactions") || input.toLowerCase().includes("spending")) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "You can view all your transactions in the transactions page. Would you like to go there now?",
          timestamp: new Date(),
          actions: [
            {
              type: "view-transactions",
              label: "View Transactions",
            },
          ],
        }
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm here to help you manage your finances. You can ask me to help add expenses, create wallets, or provide insights about your spending habits.",
          timestamp: new Date(),
        }
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-60px)] md:h-screen">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
          </div>

          <Card className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-220px)]">
            <CardHeader>
              <CardTitle>Woretto Assistant</CardTitle>
              <CardDescription>
                Ask me anything about your finances, or let me help you add expenses and manage wallets.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {message.role === "assistant" ? (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>AI</AvatarFallback>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <Bot className="h-4 w-4" />
                        </Avatar>
                      ) : (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {message.role === "assistant" ? "Assistant" : "You"}
                      </div>
                    </div>
                    <div>{message.content}</div>
                    {message.actions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.actions.map((action) =>
                          action.type === "add-expense" ? (
                            <AddExpenseDialog key={action.type}>
                              <Button size="sm" variant="secondary">
                                <Plus className="mr-1 h-3 w-3" />
                                {action.label}
                              </Button>
                            </AddExpenseDialog>
                          ) : action.type === "add-wallet" ? (
                            <AddWalletDialog key={action.type}>
                              <Button size="sm" variant="secondary">
                                <Wallet className="mr-1 h-3 w-3" />
                                {action.label}
                              </Button>
                            </AddWalletDialog>
                          ) : (
                            <Button key={action.type} size="sm" variant="secondary" asChild>
                              <a href="/dashboard/transactions">
                                <ArrowRight className="mr-1 h-3 w-3" />
                                {action.label}
                              </a>
                            </Button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>AI</AvatarFallback>
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <Bot className="h-4 w-4" />
                      </Avatar>
                      <div className="text-xs text-muted-foreground">Assistant</div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.2s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <Input
                  placeholder="Ask me anything about your finances..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

