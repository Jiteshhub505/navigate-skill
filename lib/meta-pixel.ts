const getCookie = (name: string) => {
    if (typeof document === "undefined") return "";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
    return "";
};

export const generateEventId = () => {
    return "evt_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
};

export const trackMetaEvent = async (
    eventName: string,
    customData: any = {},
    userData: { email?: string; phone?: string; name?: string; city?: string; country?: string } = {},
    isCustomEvent = false
) => {
    if (typeof window === "undefined") return null;

    // 1. Generate unique event_id for deduplication
    const eventId = generateEventId();

    // 2. Track on Browser Pixel
    if ((window as any).fbq) {
        if (isCustomEvent) {
            (window as any).fbq("trackCustom", eventName, customData, { eventID: eventId });
        } else {
            (window as any).fbq("track", eventName, customData, { eventID: eventId });
        }
    }

    // 3. For critical conversion events (not basic PageView/admin), send to Server Conversions API
    const isCapiEligible = !isCustomEvent && 
        eventName !== "PageView" && 
        !window.location.pathname.startsWith("/admin");

    if (isCapiEligible) {
        try {
            // Read client cookies for fbp and fbc
            const fbp = getCookie("_fbp");
            const fbc = getCookie("_fbc");

            const capiUserData = {
                ...userData,
                fbp,
                fbc
            };

            // Call next.js API route in the background (fire-and-forget)
            fetch("/api/meta-capi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    eventName,
                    eventId,
                    eventSourceUrl: window.location.href,
                    userData: capiUserData,
                    customData
                })
            }).catch(() => {
                // Silently ignore CAPI network errors in background
            });
        } catch (error) {
            console.error("Failed to trigger Meta Conversions API:", error);
        }
    }

    return eventId;
};
