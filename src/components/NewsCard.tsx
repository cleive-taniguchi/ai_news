"use client";

import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface NewsCardProps {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    snippet: string;
    imageUrl?: string;
}

export function NewsCard({ title, link, pubDate, source, snippet, imageUrl }: NewsCardProps) {
    const timeAgo = formatDistanceToNow(new Date(pubDate), { addSuffix: true, locale: ja });
    const defaultImage = "/assets/default-news.png";

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl glass-card card-hover flex flex-col h-full cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={imageUrl || defaultImage}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultImage;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-60" />

                {/* Source Badge on Image */}
                <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-semibold bg-black/40 backdrop-blur-md text-white border border-white/10">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-pulse" />
                    {source}
                </span>
            </div>

            {/* Content Area */}
            <div className="relative p-6 flex flex-col flex-grow z-10">
                {/* Time */}
                <div className="flex items-center justify-between mb-3 text-gray-300">
                    <time className="text-xs flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {timeAgo}
                    </time>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all duration-300">
                    {title}
                </h3>

                {/* Snippet */}
                {snippet && (
                    <p className="text-sm text-gray-200 line-clamp-2 mb-5 leading-relaxed flex-grow">
                        {snippet}
                    </p>
                )}

                {/* Read More Link (Now just a visual indicator) */}
                <div className="mt-auto">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 group-hover:text-cyan-300 transition-all duration-300">
                        <span className="relative">
                            続きを読む
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300" />
                        </span>
                        <svg
                            className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Animated gradient border on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-cyan-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-cyan-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
        </a>
    );
}
