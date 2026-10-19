export function SkeletonLoader({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse ${className}`}>
            <div className="bg-gray-200/80 rounded-xl h-full w-full"></div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="h-12 bg-gray-200 rounded-lg w-16"></div>
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 p-6 rounded-3xl animate-pulse shadow-sm">
            <div className="space-y-4">
                <div className="h-44 bg-gray-100 rounded-2xl"></div>
                <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
                <div className="pt-4 flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded-lg w-20"></div>
                    <div className="h-8 bg-purple-100 rounded-xl w-24"></div>
                </div>
            </div>
        </div>
    );
}
