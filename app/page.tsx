import { Button } from "@/components/ui/button"
import { MessageSquare, Bot, Users, BarChart3, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">WhatsApp Automation</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Começar Agora</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-8 py-24 md:py-32">
          <div className="flex max-w-3xl flex-col items-center gap-4 text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Automatize seu atendimento no WhatsApp
            </h1>
            <p className="text-balance text-lg text-muted-foreground sm:text-xl">
              Gerencie múltiplas instâncias, crie chatbots inteligentes e converta mais leads com nossa plataforma
              completa de automação.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">Criar Conta Grátis</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/50 py-16">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">Recursos Principais</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <MessageSquare className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Múltiplas Instâncias</h3>
                <p className="text-muted-foreground">Conecte e gerencie várias contas do WhatsApp em um só lugar</p>
              </div>

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Chatbots Inteligentes</h3>
                <p className="text-muted-foreground">Crie fluxos de conversa automatizados com IA integrada</p>
              </div>

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Gestão de Leads</h3>
                <p className="text-muted-foreground">Organize e acompanhe todos os seus leads em tempo real</p>
              </div>

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Analytics Completo</h3>
                <p className="text-muted-foreground">Acompanhe métricas e performance em dashboards intuitivos</p>
              </div>

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Respostas Rápidas</h3>
                <p className="text-muted-foreground">Responda mais rápido com templates personalizados</p>
              </div>

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Seguro e Confiável</h3>
                <p className="text-muted-foreground">Seus dados protegidos com criptografia de ponta a ponta</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t py-16">
          <div className="container flex flex-col items-center gap-8 text-center">
            <h2 className="text-3xl font-bold">Pronto para começar?</h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Crie sua conta gratuitamente e comece a automatizar seu atendimento no WhatsApp hoje mesmo.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Criar Conta Grátis</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          2024 WhatsApp Automation. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
