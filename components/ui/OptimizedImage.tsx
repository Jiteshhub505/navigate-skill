'use client'

import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<NextImageProps, 'onLoad'> {
    fallback?: string
}

export function OptimizedImage({
    src,
    alt,
    fallback = '/placeholder.png',
    className = '',
    ...props
}: OptimizedImageProps) {
    const [imgSrc, setImgSrc] = useState(src)
    const [isLoading, setIsLoading] = useState(true)

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <NextImage
                {...props}
                src={imgSrc}
                alt={alt}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setImgSrc(fallback)
                    setIsLoading(false)
                }}
                loading="lazy"
                quality={85}
            />
            {isLoading && (
                <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
            )}
        </div>
    )
}
