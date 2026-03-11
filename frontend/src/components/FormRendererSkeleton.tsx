import { Skeleton } from "@/components/ui/skeleton";

const FormRendererSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>

        {/* Form Fields */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-5">
          {/* Branch Selector */}
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Form Fields */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}

          {/* Submit Button */}
          <div className="pt-2">
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRendererSkeleton;
