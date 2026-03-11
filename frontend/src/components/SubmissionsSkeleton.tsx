import { Skeleton } from "@/components/ui/skeleton";

const SubmissionsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Page Title */}
      <Skeleton className="h-8 w-48 mb-4 md:mb-6" />

      {/* Submissions Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-5 border-b border-gray-200">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-full sm:w-64" />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-5 py-3 text-left">
                  <Skeleton className="h-4 w-28" />
                </th>
                <th className="px-5 py-3 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th className="px-5 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-5 py-3 text-left">
                  <Skeleton className="h-4 w-28" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-5 py-4">
                    <Skeleton className="h-4 w-40" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionsSkeleton;
