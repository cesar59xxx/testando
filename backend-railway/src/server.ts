import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { whatsappRouter } from "./routes/whatsapp"
import { webhookRouter } from "./routes/webhook"
import { authenticateApiKey } from "./middleware/auth"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Routes
app.use("/api/whatsapp", authenticateApiKey, whatsappRouter)
app.use("/api/webhook", webhookRouter)

app.listen(PORT, () => {
  console.log(`🚀 Backend Railway rodando na porta ${PORT}`)
  console.log(`📱 WhatsApp Web.js pronto para conectar`)
})
