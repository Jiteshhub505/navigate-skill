/**
 * Preload Links Component
 * 
 * Add this to your layout to preload critical resources
 * This improves FCP and LCP scores
 */

export function PreloadLinks() {
    return (
        <>
            {/* Preload critical fonts */}
            <link
                rel="preload"
                href="/fonts/geist-sans.woff2"
                as="font"
                type="font/woff2"
                crossOrigin="anonymous"
            />

            {/* DNS prefetch for external domains */}
            <link rel="dns-prefetch" href="https://secpjbemtkjoayumelvh.supabase.co" />

            {/* Preconnect to critical third-party origins */}
            <link rel="preconnect" href="https://secpjbemtkjoayumelvh.supabase.co" />
        </>
    )
}
