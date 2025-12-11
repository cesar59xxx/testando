import ChatbotDetailPageClient from "./client"

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0

export default function ChatbotDetailPage({ params }: { params: { id: string } }) {
  return <ChatbotDetailPageClient params={params} />
}
