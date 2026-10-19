"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { createClient } from "@/lib/supabase/client";

export default function MetaPixelTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [userData, setUserData] = useState<{ email?: string; phone?: string; name?: string }>({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    let name = user.user_metadata?.full_name || user.user_metadata?.name || '';
                    if (!name && user.email) {
                        const { data: dbUser } = await supabase
                            .from('users')
                            .select('name')
                            .eq('email', user.email)
                            .single();
                        if (dbUser?.name) {
                            name = dbUser.name;
                        }
                    }
                    setUserData({
                        email: user.email || "",
                        name: name,
                        phone: user.phone || ""
                    });
                }
            } catch (e) {
                console.error("Error fetching user for tracking:", e);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!pathname || pathname.startsWith("/admin")) return;
        // Track PageView on path/search changes for public site only
        trackMetaEvent("PageView", {}, userData);
    }, [pathname, searchParams]);

    return null;
}
