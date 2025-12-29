export default function LoadingGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="h-6 w-32 bg-gray-200 rounded-full animate-pulse" />
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-full" />
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                        </div>
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    )
}
