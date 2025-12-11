import type { Request, Response, NextFunction } from "express"

export function authenticateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"] as string
  const expectedApiKey = process.env.BACKEND_API_KEY

  if (!expectedApiKey) {
    console.error("[Auth] BACKEND_API_KEY não configurada!")
    return res.status(500).json({ error: "Servidor não configurado corretamente" })
  }

  if (!apiKey) {
    return res.status(401).json({ error: "API Key não fornecida. Use o header X-API-Key" })
  }

  if (apiKey !== expectedApiKey) {
    return res.status(403).json({ error: "API Key inválida" })
  }

  next()
}
