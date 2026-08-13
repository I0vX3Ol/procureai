export interface AIAnalysisRequest {
  documentId: string
  type: 'summary' | 'requirements' | 'deadlines' | 'risk' | 'compliance' | 'fit'
}

export interface AIAnalysisResult {
  id: string
  type: AIAnalysisRequest['type']
  content: string
  confidence: number
  sources: string[]
  createdAt: Date
}

export interface AIChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  citations?: string[]
}

/** Abstraction layer for OpenAI integration — swap implementation for production API. */
export class AIService {
  async analyzeDocument(request: AIAnalysisRequest): Promise<AIAnalysisResult> {
    await this.simulateLatency()

    const responses: Record<AIAnalysisRequest['type'], string> = {
      summary:
        'Multi-year federal contract for cloud infrastructure modernization. Key evaluation factors include technical approach (40%), past performance (30%), and price (30%). Incumbent vendor has held contract since 2019.',
      requirements:
        'FedRAMP High authorization required. CMMC Level 2 certification. Minimum 3 years federal cloud experience. Staff must hold active security clearances.',
      deadlines:
        'Questions due: Aug 20, 2026. Proposal due: Sep 15, 2026. Expected award: Nov 2026. Contract start: Jan 2027.',
      risk:
        'Medium risk: Strong incumbent advantage. Mitigation: Emphasize differentiated AI-powered monitoring capabilities and 15% cost reduction in transition plan.',
      compliance:
        'Section L: Technical Volume (50 pages max). Section M: Evaluation criteria documented. FAR 52.212-4 applies. Small business subcontracting plan required.',
      fit:
        '92% fit score based on: matching NAICS codes, relevant past performance (3 similar contracts), geographic presence, and required certifications on file.',
    }

    return {
      id: crypto.randomUUID(),
      type: request.type,
      content: responses[request.type],
      confidence: 0.89,
      sources: ['RFP Section C', 'RFP Section L', 'RFP Section M'],
      createdAt: new Date(),
    }
  }

  async chat(_documentIds: string[], message: string): Promise<AIChatMessage> {
    await this.simulateLatency()

    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Based on the uploaded documents, ${message.toLowerCase().includes('deadline') ? 'the proposal deadline is September 15, 2026. Pre-proposal questions are due August 20, 2026.' : 'the key technical requirements include FedRAMP High authorization, CMMC Level 2, and demonstrated federal cloud migration experience.'}`,
      timestamp: new Date(),
      citations: ['RFP Page 12', 'RFP Page 45'],
    }
  }

  async generateProposalSection(section: string, _context: string): Promise<string> {
    await this.simulateLatency()

    return `[AI Draft — ${section}]\n\nOur team brings unparalleled experience in federal cloud modernization, having successfully migrated 12 agency workloads to FedRAMP-authorized environments over the past five years. Our approach prioritizes zero-downtime migration, continuous compliance monitoring, and AI-driven cost optimization.`
  }

  private simulateLatency(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 800))
  }
}

export const aiService = new AIService()
