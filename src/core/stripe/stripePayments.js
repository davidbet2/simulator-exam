import { getApp } from 'firebase/app'
import { getStripePayments } from '@invertase/firestore-stripe-payments'

/**
 * Shared Stripe payments instance (Invertase Extension client SDK).
 * Collections must match the Extension configuration in Firebase Console.
 */
export const payments = getStripePayments(getApp(), {
  productsCollection: 'products',
  customersCollection: 'customers',
})
