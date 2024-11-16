import { createClient } from 'https://esm.sh/@elastic/elasticsearch@8.12.1'
import { serve } from "https://deno.fresh.run/std@v1/http/server.ts"

const ELASTIC_CLOUD_ID = Deno.env.get('ELASTIC_CLOUD_ID')
const ELASTIC_API_KEY = Deno.env.get('ELASTIC_API_KEY')

const client = new createClient({
  cloud: { id: ELASTIC_CLOUD_ID! },
  auth: { apiKey: ELASTIC_API_KEY! }
})

serve(async () => {
  try {
    const [funnelResponse, timeResponse] = await Promise.all([
      // Get funnel data
      client.search({
        index: 'quiz-funnel',
        body: {
          size: 0,
          aggs: {
            steps: {
              terms: {
                field: 'steps_completed',
                order: { _key: 'asc' }
              },
              aggs: {
                conversion_rate: {
                  avg: {
                    script: {
                      source: "doc['completed'].value ? 100 : 0"
                    }
                  }
                }
              }
            }
          }
        }
      }),
      // Get time analysis
      client.search({
        index: 'quiz-funnel',
        body: {
          size: 0,
          aggs: {
            avg_completion_time: {
              avg: {
                field: 'completion_time'
              }
            }
          }
        }
      })
    ])

    const funnelData = funnelResponse.aggregations.steps.buckets.map(bucket => ({
      name: `Step ${bucket.key}`,
      value: bucket.doc_count,
      conversionRate: bucket.conversion_rate.value
    }))

    const timeData = {
      averageCompletionTime: timeResponse.aggregations.avg_completion_time.value / 60000 // Convert to minutes
    }

    return new Response(
      JSON.stringify({
        funnelData,
        timeData,
        totalStarted: funnelResponse.hits.total.value
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})