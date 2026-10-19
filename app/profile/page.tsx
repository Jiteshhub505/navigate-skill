import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { User, Shield, Phone, Mail, Key } from "lucide-react";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id)
    });

    if (!dbUser) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-[#faf7ff] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-10">
                    <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                        Account Settings
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 tracking-tight">
                        My <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Profile</span>
                    </h1>
                    <p className="text-gray-600 text-base">
                        Manage your student profile information and account preferences.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Quick Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm text-center">
                            <div className="relative w-28 h-28 mx-auto mb-5">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-purple-600/20">
                                    {dbUser.name ? dbUser.name.charAt(0).toUpperCase() : "U"}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">{dbUser.name}</h2>
                            <p className="text-gray-500 text-xs mb-6 truncate">{dbUser.email}</p>

                            <div className="flex flex-col gap-2.5">
                                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="text-gray-500 text-xs font-semibold uppercase">Role</span>
                                    <span className="text-purple-700 text-xs font-bold uppercase tracking-wider">{dbUser.role}</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="text-gray-500 text-xs font-semibold uppercase">Status</span>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${dbUser.approvalStatus === 'approved' ? 'text-emerald-700' : 'text-amber-700'
                                        }`}>
                                        {dbUser.approvalStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>

                            <form className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue={dbUser.name}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            defaultValue={dbUser.phone || ""}
                                            placeholder="Add phone number"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        value={dbUser.email}
                                        disabled
                                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed font-medium"
                                    />
                                    <p className="text-[11px] text-gray-400 italic">Email address is managed securely via authentication.</p>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-sm rounded-xl hover:from-purple-700 hover:to-fuchsia-700 transition-all shadow-md shadow-purple-600/20"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="text-base font-bold text-gray-900 mb-4">Security</h3>
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-700 text-sm font-semibold transition-all">
                                    <Key className="w-4 h-4 text-purple-600" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
