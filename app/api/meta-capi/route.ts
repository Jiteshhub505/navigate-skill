import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { eventName, eventId, eventSourceUrl, userData = {}, customData = {} } = body;

        // 1. Get client IP and User Agent from headers
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
        const userAgent = req.headers.get("user-agent") || "";

        // 2. Get fbp and fbc from cookies or request body
        const fbp = req.cookies.get("_fbp")?.value || userData.fbp || "";
        const fbc = req.cookies.get("_fbc")?.value || userData.fbc || "";

        // 3. Helper to hash SHA-256
        const hash = (val: string | undefined): string | null => {
            if (!val) return null;
            const normalized = val.trim().toLowerCase();
            return crypto.createHash("sha256").update(normalized).digest("hex");
        };

        const hashPhone = (phone: string | undefined): string | null => {
            if (!phone) return null;
            // Remove all non-digits
            let normalized = phone.replace(/\D/g, "");
            // Standard Indian country code normalization
            if (normalized.length === 10) {
                normalized = "91" + normalized;
            }
            return crypto.createHash("sha256").update(normalized).digest("hex");
        };

        // 4. Split and hash name
        let hashedFn: string | null = null;
        let hashedLn: string | null = null;
        if (userData.name) {
            const parts = userData.name.trim().split(/\s+/);
            if (parts.length > 0) {
                hashedFn = hash(parts[0]);
                if (parts.length > 1) {
                    hashedLn = hash(parts.slice(1).join(" "));
                }
            }
        }

        const hashedEmail = hash(userData.email);
        const hashedPhone = hashPhone(userData.phone);
        const hashedCity = hash(userData.city);
        const hashedCountry = hash(userData.country);

        // 5. Construct User Data for Meta
        const metaUserData: any = {
            client_ip_address: ip,
            client_user_agent: userAgent
        };

        if (hashedEmail) metaUserData.em = [hashedEmail];
        if (hashedPhone) metaUserData.ph = [hashedPhone];
        if (hashedFn) metaUserData.fn = [hashedFn];
        if (hashedLn) metaUserData.ln = [hashedLn];
        if (hashedCity) metaUserData.ct = [hashedCity];
        if (hashedCountry) metaUserData.country = [hashedCountry];
        if (fbp) metaUserData.fbp = fbp;
        if (fbc) metaUserData.fbc = fbc;

        // 6. Construct Event data
        const eventData = {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            event_source_url: eventSourceUrl || "https://navigateskill.com/courses/yoga",
            action_source: "website",
            user_data: metaUserData,
            custom_data: customData
        };

        // 7. Payload for Meta Graph API
        const payload = {
            data: [eventData],
            test_event_code: "TEST31742" // Conversions API request only while testing
        };

        const pixelId = "1760871571894513";
        const accessToken = "EAATDfiNx9kkBR2fHWtPgWJZARK5JvsiPW4XWwj5KC73SMTkSz9kdAZAkSLJ4laGnV8ZACITyE44XWZBDKh5pGEj78uV2xAXudZA8d7fgFMTnplK3aKXZC9fD7hazL96Y9OGvvyC0CF9yA2GJU2SPoinrUcDB2RIcAWLJR5oNXUyrAmEYNGE7ZAVrMDAZCSV2lrT79QZDZD";

        const metaUrl = `https://graph.facebook.com/v23.0/${pixelId}/events?access_token=${accessToken}`;

        const response = await fetch(metaUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const resData = await response.json();
        
        if (!response.ok) {
            console.error("Meta CAPI Error Response:", resData);
            return NextResponse.json({ success: false, error: resData }, { status: response.status });
        }

        return NextResponse.json({ success: true, result: resData });
    } catch (error: any) {
        console.error("Meta CAPI API Handler Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
