"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Renders its children only when the current pathname does NOT start with
 * any of the given `paths`. Use this in the root layout to hide global
 * chrome (Navbar, Footer, widgets) on standalone pages.
 */
export function HideOnPaths({
    paths,
    children,
}: {
    paths: string[];
    children: ReactNode;
}) {
    const pathname = usePathname();
    const hidden = paths.some((p) => pathname.startsWith(p));
    if (hidden) return null;
    return <>{children}</>;
}
