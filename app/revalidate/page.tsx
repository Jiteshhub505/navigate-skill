import { revalidateTag } from 'next/cache';

export default async function RevalidatePage() {
    async function doRevalidate() {
        'use server';
        revalidateTag('courses', 'max');
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Cache Revalidation</h1>
            <form action={doRevalidate}>
                <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                    Revalidate 'courses' tag
                </button>
            </form>
        </div>
    );
}
