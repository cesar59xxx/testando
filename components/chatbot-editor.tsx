"use client"

import { useState } from "react"
import type { Database } from "@/lib/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Chatbot = Database["public"]["Tables"]["chatbot_configs"]["Row"] & {
  whatsapp_instances: {
    id: string
    name: string
  }
}

interface ChatbotEditorProps {
  chatbot: Chatbot
}

interface FlowOption {
  text: string
  response: string
  keywords: string[]
}

export function ChatbotEditor({ chatbot: initialChatbot }: ChatbotEditorProps) {
  const [chatbot, setChatbot] = useState(initialChatbot)
  const [flows, setFlows] = useState<FlowOption[]>((chatbot.flows as any[]) || [])
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleAddFlow = () => {
    setFlows([...flows, { text: "", response: "", keywords: [] }])
  }

  const handleRemoveFlow = (index: number) => {
    setFlows(flows.filter((_, i) => i !== index))
  }

  const handleFlowChange = (index: number, field: keyof FlowOption, value: any) => {
    const updated = [...flows]
    updated[index] = { ...updated[index], [field]: value }
    setFlows(updated)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("chatbot_configs")
        .update({
          name: chatbot.name,
          welcome_message: chatbot.welcome_message,
          is_active: chatbot.is_active,
          flows: flows,
          openai_enabled: chatbot.openai_enabled,
          openai_api_key: chatbot.openai_api_key,
          openai_model: chatbot.openai_model,
          openai_instructions: chatbot.openai_instructions,
          fallback_message: chatbot.fallback_message,
        })
        .eq("id", chatbot.id)

      if (error) throw error

      alert("Chatbot salvo com sucesso!")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving chatbot:", error)
      alert("Erro ao salvar chatbot")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList>
          <TabsTrigger value="basic">Configuração Básica</TabsTrigger>
          <TabsTrigger value="flows">Fluxos de Conversa</TabsTrigger>
          <TabsTrigger value="ai">Integração IA</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>Configure as informações básicas do chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Chatbot</Label>
                <Input
                  id="name"
                  value={chatbot.name}
                  onChange={(e) => setChatbot({ ...chatbot, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
                <Textarea
                  id="welcomeMessage"
                  value={chatbot.welcome_message}
                  onChange={(e) => setChatbot({ ...chatbot, welcome_message: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fallbackMessage">Mensagem de Fallback</Label>
                <Textarea
                  id="fallbackMessage"
                  value={chatbot.fallback_message || ""}
                  onChange={(e) => setChatbot({ ...chatbot, fallback_message: e.target.value })}
                  rows={3}
                  placeholder="Mensagem exibida quando o bot não entender"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Status do Chatbot</Label>
                  <p className="text-sm text-muted-foreground">Ative ou desative o chatbot</p>
                </div>
                <Switch
                  id="isActive"
                  checked={chatbot.is_active}
                  onCheckedChange={(checked) => setChatbot({ ...chatbot, is_active: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flows" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Fluxos de Conversa</CardTitle>
                  <CardDescription>Configure respostas automáticas baseadas em palavras-chave</CardDescription>
                </div>
                <Button onClick={handleAddFlow}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Fluxo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {flows.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum fluxo configurado ainda.</p>
                  <p className="text-sm">Clique em "Adicionar Fluxo" para começar.</p>
                </div>
              ) : (
                flows.map((flow, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Fluxo {index + 1}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveFlow(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label>Texto da Opção</Label>
                        <Input
                          value={flow.text}
                          onChange={(e) => handleFlowChange(index, "text", e.target.value)}
                          placeholder="Ex: Quero fazer um orçamento"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Palavras-chave (separadas por vírgula)</Label>
                        <Input
                          value={flow.keywords.join(", ")}
                          onChange={(e) =>
                            handleFlowChange(
                              index,
                              "keywords",
                              e.target.value.split(",").map((k) => k.trim()),
                            )
                          }
                          placeholder="orçamento, preço, valor, quanto custa"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Resposta</Label>
                        <Textarea
                          value={flow.response}
                          onChange={(e) => handleFlowChange(index, "response", e.target.value)}
                          placeholder="Digite a resposta automática..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integração com IA</CardTitle>
              <CardDescription>Configure a integração com OpenAI para respostas inteligentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="openaiEnabled">Ativar OpenAI</Label>
                  <p className="text-sm text-muted-foreground">Use IA para respostas mais inteligentes</p>
                </div>
                <Switch
                  id="openaiEnabled"
                  checked={chatbot.openai_enabled}
                  onCheckedChange={(checked) => setChatbot({ ...chatbot, openai_enabled: checked })}
                />
              </div>

              {chatbot.openai_enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="openaiKey">API Key da OpenAI</Label>
                    <Input
                      id="openaiKey"
                      type="password"
                      value={chatbot.openai_api_key || ""}
                      onChange={(e) => setChatbot({ ...chatbot, openai_api_key: e.target.value })}
                      placeholder="sk-..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openaiModel">Modelo</Label>
                    <Input
                      id="openaiModel"
                      value={chatbot.openai_model}
                      onChange={(e) => setChatbot({ ...chatbot, openai_model: e.target.value })}
                      placeholder="gpt-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openaiInstructions">Instruções para a IA</Label>
                    <Textarea
                      id="openaiInstructions"
                      value={chatbot.openai_instructions || ""}
                      onChange={(e) => setChatbot({ ...chatbot, openai_instructions: e.target.value })}
                      rows={5}
                      placeholder="Você é um assistente virtual de atendimento ao cliente. Seja educado e prestativo..."
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 sticky bottom-4">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  )
}
