'use client';

import React from 'react';

export const PageLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm transition-colors duration-200">
            <div className="flex flex-col items-center gap-4">
                {/* Simple Spinner */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin"></div>
                </div>

                {/* Loading Text */}
                <span className="text-sm font-medium text-gray-600">Loading...</span>
            </div>
        </div>
    );
};

export const SectionLoader = () => {
    return (
        <div className="w-full py-20 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-3 border-purple-900/50"></div>
                    <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-purple-400 animate-spin"></div>
                </div>
                <span className="text-sm text-gray-500 font-medium">Loading content...</span>
            </div>
        </div>
    );
};
