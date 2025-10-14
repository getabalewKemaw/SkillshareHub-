// Chapa Payment Gateway Integration
// Documentation: https://developer.chapa.co/docs

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY!
const CHAPA_API_URL = 'https://api.chapa.co/v1'

export interface ChapaInitializePaymentParams {
  amount: number
  currency: string
  email: string
  first_name: string
  last_name?: string
  tx_ref: string // Unique transaction reference
  callback_url: string
  return_url: string
  customization?: {
    title?: string
    description?: string
  }
}

export interface ChapaPaymentResponse {
  message: string
  status: string
  data: {
    checkout_url: string
    tx_ref: string
  }
}

export interface ChapaVerifyResponse {
  message: string
  status: string
  data: {
    first_name: string
    last_name: string
    email: string
    currency: string
    amount: number
    charge: number
    mode: string
    method: string
    type: string
    status: string
    reference: string
    tx_ref: string
    customization: {
      title: string
      description: string
    }
    created_at: string
    updated_at: string
  }
}

/**
 * Initialize a payment with Chapa
 */
export async function initializePayment(
  params: ChapaInitializePaymentParams
): Promise<ChapaPaymentResponse> {
  const response = await fetch(`${CHAPA_API_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to initialize payment')
  }

  return response.json()
}

/**
 * Verify a payment transaction
 */
export async function verifyPayment(tx_ref: string): Promise<ChapaVerifyResponse> {
  const response = await fetch(`${CHAPA_API_URL}/transaction/verify/${tx_ref}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to verify payment')
  }

  return response.json()
}

/**
 * Generate a unique transaction reference
 */
export function generateTxRef(userId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return `tx-${userId.substring(0, 8)}-${timestamp}-${random}`
}
