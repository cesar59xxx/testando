# Backend Railway - WhatsApp Automation

Backend Node.js/Express para gerenciar whatsapp-web.js no Railway.

## Arquitetura

\`\`\`
Frontend (Vercel) → Backend (Railway) → Supabase
                         ↓
                   WhatsApp Web.js
\`\`\`

## Setup Railway

1. Crie um novo projeto no Railway: https://railway.app

2. Conecte este repositório ou faça upload dos arquivos da pasta `backend-railway`

3. Configure as variáveis de ambiente:

\`\`\`bash
# Porta do servidor
PORT=3001

# URL do frontend Vercel (você vai pegar depois do deploy)
FRONTEND_URL=https://seu-app.vercel.app

# Supabase
SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig

# Chave de API para autenticação (crie uma chave secreta forte)
BACKEND_API_KEY=sua-chave-secreta-super-forte-abc123xyz
\`\`\`

**IMPORTANTE:** A `BACKEND_API_KEY` deve ser a MESMA no Railway e na Vercel!

4. Deploy será automático!

5. Após o deploy, copie a URL do Railway e adicione na Vercel como `NEXT_PUBLIC_RAILWAY_BACKEND_URL`

## Endpoints

### WhatsApp
- `POST /api/whatsapp/instances/:id/connect` - Conectar instância
- `GET /api/whatsapp/instances/:id/status` - Status da conexão
- `POST /api/whatsapp/instances/:id/disconnect` - Desconectar
- `POST /api/whatsapp/instances/:id/send` - Enviar mensagem

### Webhook
- `POST /api/webhook/message` - Receber mensagens (usado internamente)

### Health Check
- `GET /health` - Verificar se o servidor está rodando

## Autenticação

Todos os endpoints `/api/whatsapp/*` requerem autenticação via header:

\`\`\`
X-API-Key: sua-chave-secreta-super-forte-abc123xyz
\`\`\`

## Desenvolvimento Local

\`\`\`bash
cd backend-railway
npm install

# Crie um arquivo .env com as variáveis acima
cp .env.example .env

# Rode em modo desenvolvimento
npm run dev
\`\`\`

## Deploy

\`\`\`bash
npm run build
npm start
\`\`\`

O Railway detecta automaticamente e faz deploy!

## Troubleshooting

### Erro: "Backend not available"
- Verifique se o Railway está online
- Verifique se a URL do Railway está correta na Vercel

### Erro: "API Key inválida"
- Verifique se a `BACKEND_API_KEY` é a mesma no Railway e na Vercel
- Verifique se o header `X-API-Key` está sendo enviado

### QR Code não aparece
- Verifique os logs do Railway
- Verifique se o whatsapp-web.js está inicializando corretamente
