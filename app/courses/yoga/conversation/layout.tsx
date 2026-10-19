import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Join Our Online Yoga Classes | NavigateSkills Academy",
    description:
        "Answer 4 quick questions to book your ₹20 trial yoga class with NavigateSkills Academy. Morning, afternoon, and evening batches available.",
};

/**
 * Isolated layout — no Navbar/Footer so the chatbot page is fully standalone.
 */
export default function YogaConversationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
