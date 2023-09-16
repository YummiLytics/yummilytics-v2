import type { NextPage } from "next";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { api } from "~/utils/api";
import { Skeleton } from "~/components/ui/skeleton";
import { defaultCompany } from "~/types/defaults";
import { getPhoneFormatted, getFullAddress } from "~/utils/company-utils";

const DashboardCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode | React.ReactNode[];
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pt-4 pb-3">
        <h2 className="w-56 border-b border-b-slate-200 pb-1 text-lg font-bold">
          {title}
        </h2>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const GeneralInfo = () => {
  const { data, isFetched } = api.companies.getCurrentCompany.useQuery();
  const company = data ?? {
    ...defaultCompany,
    name: "Could not get company name...",
    repFirstName: "Could not get representative name...",
    repEmail: "Could not get email address..."
  }

  return (
    <DashboardCard title="My Company">
      <div className="flex items-center gap-2">
        <span className="font-semibold">Name:</span>
        <span>
          {isFetched ? company.name : <Skeleton className="h-5 w-32" />}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">Address:</span>
        <span>
          {isFetched ? (
            getFullAddress(company)
          ) : (
            <Skeleton className="h-5 w-72" />
          )}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">Representative Name:</span>
        <span>
          {isFetched ? (
            `${company.repFirstName ?? ""} ${company.repLastName ?? ""}`
          ) : (
            <Skeleton className="h-5 w-44" />
          )}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">Email:</span>
        <span>
          {isFetched ? company.repEmail : <Skeleton className="h-5 w-56" />}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">Phone:</span>
        <span>
          {isFetched ? getPhoneFormatted(company) : <Skeleton className="h-5 w-24" />}
        </span>
      </div>
    </DashboardCard>
  );
};

const LatestResults = () => {
  return (
    <DashboardCard title="Latest Results">
    </DashboardCard>
  );
};

const LocationsList = () => {
  return (
    <DashboardCard title="My Locations">
    </DashboardCard>
  );
};

const BenchmarkGroupsList = () => {
  return (
    <DashboardCard title="My Benchmark Groups">
    </DashboardCard>
  );
};

const DashboardPage: NextPage = () => {
  return (
    <div className="my-6 lg:container">
      <Card className="shadow-md">
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
