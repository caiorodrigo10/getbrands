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
    // Get completion rate
    const { aggregations: completionAggs } = await client.search({
      index: 'quiz_responses',
      body: {
        aggs: {
          completion_rate: {
            avg: {
              script: {
                source: "doc['completed_at'].size() > 0 ? 1 : 0"
              }
            }
          }
        }
      }
    })

    // Get average completion time
    const { aggregations: timeAggs } = await client.search({
      index: 'quiz_responses',
      body: {
        aggs: {
          avg_completion_time: {
            avg: {
              script: {
                source: "if (doc['completed_at'].size() > 0) { return (doc['completed_at'].value.toInstant().toEpochMilli() - doc['created_at'].value.toInstant().toEpochMilli()) / 60000 }"
              }
            }
          }
        }
      }
    })

    // Get total responses
    const { count } = await client.count({ index: 'quiz_responses' })

    const analytics = {
      completionRate: Math.round(completionAggs.completion_rate.value * 100),
      avgCompletionTime: Math.round(timeAggs.avg_completion_time.value * 10) / 10,
      totalResponses: count,
      conversionRates: [], // Add conversion rates calculation
      timeAnalysis: [], // Add time analysis calculation
      funnelData: [] // Add funnel data calculation
    }

    return new Response(
      JSON.stringify(analytics),
      { 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
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