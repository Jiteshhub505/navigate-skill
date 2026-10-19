import Link from "next/link";
import { ArrowLeft, Search, Compass, MessageCircle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-[#faf7ff] px-4">
            <div className="text-center max-w-lg mx-auto bg-white rounded-3xl border border-purple-100 shadow-xl p-8 sm:p-12">
                <div className="w-20 h-20 bg-purple-50 border border-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Search className="w-10 h-10 text-purple-600" />
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                    404 Error
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                    Page Not Found
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed">
                    Sorry, the page or course you&apos;re looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl font-bold text-sm hover:from-purple-700 hover:to-fuchsia-700 transition-all shadow-md shadow-purple-600/20"
                    >
                        <Compass className="w-4 h-4" />
                        Browse Courses
                    </Link>
                    <Link
                        href="/contact"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                    >
                        <MessageCircle className="w-4 h-4 text-gray-500" />
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
