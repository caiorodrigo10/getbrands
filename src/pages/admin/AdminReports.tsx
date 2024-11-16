import { QuizFunnelAnalysis } from "@/components/admin/reports/QuizFunnelAnalysis";

const AdminReports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive analytics and insights about your marketing funnel and user engagement.
        </p>
      </div>

      <QuizFunnelAnalysis />
    </div>
  );
};

export default AdminReports;