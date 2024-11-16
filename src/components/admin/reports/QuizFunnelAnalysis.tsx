import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ConversionRates } from "./funnel/ConversionRates"
import { TimeAnalysis } from "./funnel/TimeAnalysis"
import { FunnelView } from "./funnel/FunnelView"

const fetchQuizAnalytics = async () => {
  const response = await fetch('/api/quiz-analytics')
  if (!response.ok) {
    throw new Error('Failed to fetch quiz analytics')
  }
  return response.json()
}

export const QuizFunnelAnalysis = () => {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['quizAnalytics'],
    queryFn: fetchQuizAnalytics,
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Error loading analytics data</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Start to Completion Rate</h3>
          <div className="space-y-2">
            <Progress value={analytics.completionRate} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {analytics.completionRate}% completion rate
            </p>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Average Completion Time</h3>
          <p className="text-2xl font-bold">
            {analytics.avgCompletionTime} minutes
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Total Responses</h3>
          <p className="text-2xl font-bold">{analytics.totalResponses}</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ConversionRates data={analytics.conversionRates} />
        <TimeAnalysis data={analytics.timeAnalysis} />
      </div>

      <FunnelView data={analytics.funnelData} />
    </div>
  )
}