export const BACKEND_CONFIG = {
  // Railway production URL: https://ddddddd-whatsapp-production.up.railway.app
  baseUrl: process.env.NEXT_PUBLIC_RAILWAY_BACKEND_URL || "https://ddddddd-whatsapp-production.up.railway.app",
  apiKey: process.env.BACKEND_API_KEY || "",
  endpoints: {
    whatsapp: {
      connect: (instanceId: string) => `/api/whatsapp/instances/${instanceId}/connect`,
      disconnect: (instanceId: string) => `/api/whatsapp/instances/${instanceId}/disconnect`,
      status: (instanceId: string) => `/api/whatsapp/instances/${instanceId}/status`,
      send: (instanceId: string) => `/api/whatsapp/instances/${instanceId}/send`,
    },
  },
}
