import { ApiTester } from "@/components/testing/ApiTester";

export const metadata = {
  title: "API Testing - Fast Learners",
  description: "Test API connectivity and endpoints",
};

export default function ApiTestPage() {
  return (
    <div className="container space-y-6 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">API Testing</h1>
        <p className="text-muted-foreground">
          Test connectivity and functionality of Fast Learners API endpoints.
        </p>
      </div>

      <ApiTester />
    </div>
  );
}
