import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { CreditCard, ArrowRight, HelpCircle, FileText } from "lucide-react";

export default async function BillingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch all orders with course details
    const userOrders = await db.query.orders.findMany({
        where: (orders, { eq }) => eq(orders.userId, user.id),
        with: {
            course: true
        },
        orderBy: (orders, { desc }) => [desc(orders.createdAt)]
    });

    const totalSpent = userOrders
        .filter(o => o.status === 'completed')
        .reduce((acc, curr) => acc + Number(curr.finalAmount || curr.amount), 0);

    const activeCourses = userOrders.filter(o => o.status === 'completed').length;

    return (
        <div className="min-h-screen bg-[#faf7ff] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-10">
                    <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                        Account Billing
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 tracking-tight">
                        Billing & <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Invoices</span>
                    </h1>
                    <p className="text-gray-600 text-base max-w-2xl">
                        Manage your active enrollments and view your complete payment transaction history.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Amount Spent</p>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900">₹{totalSpent.toLocaleString()}</h2>
                    </div>
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Active Enrollments</p>
                        <h2 className="text-3xl sm:text-4xl font-black text-purple-700">{activeCourses}</h2>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-6 sm:p-8 rounded-3xl border border-purple-100 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-purple-900 text-xs font-bold uppercase tracking-wider mb-1">Need Assistance?</p>
                            <p className="text-gray-600 text-sm">Contact our billing support team.</p>
                        </div>
                        <Link href="/contact" className="p-3 rounded-2xl bg-white hover:bg-purple-100/80 text-purple-700 transition-colors shadow-sm border border-purple-200">
                            <HelpCircle className="w-6 h-6" />
                        </Link>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-600" />
                            <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/80">
                                    <th className="px-6 sm:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 sm:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 sm:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 sm:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 sm:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {userOrders.length > 0 ? (
                                    userOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-purple-50/30 transition-colors">
                                            <td className="px-6 sm:px-8 py-5">
                                                <p className="text-gray-900 font-semibold text-sm">
                                                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                                </p>
                                                <p className="text-gray-400 text-xs mt-0.5">
                                                    {format(new Date(order.createdAt), "hh:mm a")}
                                                </p>
                                            </td>
                                            <td className="px-6 sm:px-8 py-5">
                                                <p className="text-gray-900 font-bold text-sm">
                                                    {order.course?.title || "Online Program"}
                                                </p>
                                                <p className="text-gray-400 text-xs mt-0.5">
                                                    ID: {order.courseId.slice(0, 8)}...
                                                </p>
                                            </td>
                                            <td className="px-6 sm:px-8 py-5">
                                                <p className="text-gray-900 font-black text-base">
                                                    ₹{Number(order.finalAmount || order.amount).toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="px-6 sm:px-8 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${order.status === 'completed'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : order.status === 'pending'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-red-50 text-red-700 border border-red-200'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'completed' ? 'bg-emerald-500' : order.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                                                        }`} />
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 sm:px-8 py-5">
                                                <p className="text-gray-500 font-mono text-xs">
                                                    {order.razorpayPaymentId || order.razorpayOrderId || "N/A"}
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-3">
                                                    <CreditCard className="w-7 h-7" />
                                                </div>
                                                <p className="text-gray-900 font-bold text-base">No transactions yet</p>
                                                <p className="text-gray-500 text-xs mt-1">Explore our programs and book a trial or membership.</p>
                                                <Link href="/explore" className="text-purple-600 text-sm font-bold mt-4 hover:underline inline-flex items-center gap-1">
                                                    Explore Programs <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
