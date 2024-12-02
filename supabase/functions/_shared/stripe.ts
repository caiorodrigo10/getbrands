import Stripe from "https://esm.sh/stripe@12.4.0?target=deno"

export const stripe = new Stripe(Deno.env.get('NEW_STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})