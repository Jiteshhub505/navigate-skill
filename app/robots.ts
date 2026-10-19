import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/auth/',
                    '/profile/',
                    '/billing/',
                    '/my-courses/',
                    '/login',
                    '/signup',
                ],
            },
        ],
        sitemap: 'https://navigateskill.com/sitemap.xml',
        host: 'https://navigateskill.com',
    };
}
