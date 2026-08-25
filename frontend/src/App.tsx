import { lazy, Suspense, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

// Performance fix (skill: vercel-react-best-practices, bundle-dynamic-imports
// — the skill's own example uses next/dynamic; this app uses Vite, so the
// equivalent is React.lazy + Suspense): both charts depend on recharts,
// the largest single library in the bundle (the build previously warned
// about a 585 kB chunk). Lazy-loading defers that cost until the charts
// actually render.
const IncomeOutcomeChart = lazy(() =>
  import("@/components/dashboard/income-outcome-chart").then((mod) => ({
    default: mod.IncomeOutcomeChart,
  })),
);
const ProfitPercentChart = lazy(() =>
  import("@/components/dashboard/profit-percent-chart").then((mod) => ({
    default: mod.ProfitPercentChart,
  })),
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchFinancialData(): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

// Fallback shown only while the chart's own JS chunk is downloading (a
// one-time cost per browser session). Mirrors the chart's own internal
// loading skeleton so there is no visible layout shift.
function ChartSkeletonFallback() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-3 w-64 mt-1" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFinancialData()
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
      })
      .catch(() => {
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Accessibility fix (skill: accessibility, WCAG 2.4.1 Skip links):
          lets keyboard users bypass the header and jump straight to the
          main content region below. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <main className="dark min-h-screen bg-background text-foreground">
        <div
          id="main-content"
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col gap-8">
            <DashboardHeader period="2024 - Full Year" />

            {error ? (
              // Accessibility fix (skill: accessibility, WCAG 3.3.1/3.3.3 +
              // live regions 4.1.3): role="alert" makes screen readers
              // announce this message as soon as it appears.
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground"
              >
                {error}
              </div>
            ) : null}

            <section aria-label="Key performance indicators">
              <KPIRow metrics={metrics} loading={loading} />
            </section>

            <section
              aria-label="Financial charts"
              className="grid grid-cols-1 gap-4 xl:grid-cols-2"
            >
              <Suspense fallback={<ChartSkeletonFallback />}>
                <IncomeOutcomeChart data={monthlyData} loading={loading} />
              </Suspense>
              <Suspense fallback={<ChartSkeletonFallback />}>
                <ProfitPercentChart data={monthlyData} loading={loading} />
              </Suspense>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
