export default function RootLoading() {
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-[#faf7ff]">
            <div className="text-center">
                <div className="relative w-14 h-14 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-500 font-semibold tracking-wide">Loading...</p>
            </div>
        </div>
    );
}
