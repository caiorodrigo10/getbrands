import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@elastic/elasticsearch@8.12.1'

const ELASTIC_URL = Deno.env.get('ELASTIC_URL')
const ELASTIC_API_KEY = Deno.env.get('ELASTIC_API_KEY')

const client = new createClient({
  node: ELASTIC_URL,
  auth: {
    apiKey: ELASTIC_API_KEY
  }
})

serve(async (req) => {
  try {
    const { record, type } = await req.json()
    
    if (!record?.id) {
      return new Response(
        JSON.stringify({ error: 'Missing required data' }),
        { status: 400 }
      )
    }

    // Format the data for Elasticsearch
    const doc = {
      quiz_id: record.id,
      user_id: record.user_id,
      answers: record.answers,
      completed_at: record.completed_at,
      created_at: record.created_at,
      updated_at: record.updated_at
    }

    if (type === 'INSERT' || type === 'UPDATE') {
      await client.index({
        index: 'quiz_responses',
        id: record.id,
        document: doc,
        refresh: true
      })
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})