import Link from "next/link";

export const Trending = ({ featuredCourse }: { featuredCourse: any }) => {

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {featuredCourse.length > 0 ? (
                <div className="bg-gradient-to-r from-purple-600 to-purple-600 rounded-3xl p-6 md:p-12 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left">
                            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs md:text-sm font-bold mb-4 backdrop-blur-sm">Trending Now</span>
                            <h3 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">{featuredCourse[0].title}</h3>
                            <p className="text-purple-100 mb-6 md:mb-8 text-sm md:text-lg opacity-90">{featuredCourse[0].description}</p>
                            <Link href={`/${featuredCourse[0].category?.slug?.toLowerCase() || 'course'}/${featuredCourse[0].slug}`} className="bg-white text-purple-600 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold hover:bg-purple-50 transition shadow-lg inline-block text-sm md:text-base">
                                View Course Details
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="aspect-video bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-2xl">
                                <img src={featuredCourse[0].imageUrl} alt={featuredCourse[0].title} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-neutral-500">No featured course available.</div>
            )}
        </div>

    );
};  