import type { NextPage } from "next";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

const GeneralInfo = () => {
  return (
    <Card>
      <CardHeader className="pt-4">
        <h2 className="w-56 border-b border-b-slate-200 pb-1 text-lg font-bold">
          My Company
        </h2>
      </CardHeader>
    </Card>
  );
};

const LatestResults = () => {
  return (
    <Card>
      <CardHeader className="pt-4">
        <h2 className="w-56 border-b border-b-slate-200 pb-1 text-lg font-bold">Latest Results</h2>
      </CardHeader>
    </Card>
  );
};

const LocationsList = () => {
  return (
    <Card>
      <CardHeader className="pt-4">
        <h2 className="w-56 border-b border-b-slate-200 pb-1 text-lg font-bold">My Locations</h2>
      </CardHeader>
    </Card>
  );
};

const BenchmarkGroupsList = () => {
  return (
    <Card>
      <CardHeader className="pt-4">
        <h2 className="w-56 border-b border-b-slate-200 pb-1 text-lg font-bold">My Benchmark Groups</h2>
      </CardHeader>
    </Card>
  );
};

const DashboardPage: NextPage = () => {
  return (
    <div className="my-6 lg:container">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">My YummiLytics Dashboard</h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <GeneralInfo />
          <LatestResults />
          <div className="flex gap-6">
            <div className="flex-1">
              <LocationsList />
            </div>
            <div className="flex-1">
              <BenchmarkGroupsList />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
