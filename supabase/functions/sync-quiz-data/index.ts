import { createClient } from 'https://esm.sh/@elastic/elasticsearch@8.12.1'
import { serve } from "https://deno.fresh.run/std@v1/http/server.ts"

const ELASTIC_CLOUD_ID = Deno.env.get('ELASTIC_CLOUD_ID')
const ELASTIC_API_KEY = Deno.env.get('ELASTIC_API_KEY')

const client = new createClient({
  cloud: { id: ELASTIC_CLOUD_ID! },
  auth: { apiKey: ELASTIC_API_KEY! }
})

serve(async (req) => {
  try {
    const { record, type } = await req.json()

    if (type === 'INSERT' || type === 'UPDATE') {
      await client.index({
        index: 'quiz-funnel',
        id: record.id,
        document: {
          user_id: record.user_id,
          answers: record.answers,
          completed_at: record.completed_at,
          created_at: record.created_at,
          updated_at: record.updated_at,
          // Add computed fields for analytics
          completion_time: record.completed_at ? 
            new Date(record.completed_at).getTime() - new Date(record.created_at).getTime() 
            : null,
          steps_completed: Object.keys(record.answers || {}).length,
          completed: !!record.completed_at
        }
      })
    }

    return new Response(
      JSON.stringify({ message: "Success" }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})