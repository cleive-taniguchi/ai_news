import type { TweetItem } from "@/lib/x";

export function TweetCard({ tweet }: { tweet: TweetItem }) {
    return (
        <a
            href={tweet.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:border-purple-500/30 group relative overflow-hidden flex flex-col h-full cursor-pointer"
        >
            {/* Hover Glow Effect */}
            <div className="absolute -inset-px bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500" />
                        <img
                            src={tweet.userImage}
                            alt={tweet.userName}
                            className="relative w-12 h-12 rounded-full border border-white/10 bg-gray-900"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <h4 className="font-bold text-white truncate">{tweet.userName}</h4>
                            <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.88 0-1.688.312-2.33.84-.707-1.428-2.147-2.35-3.69-2.35-1.54 0-2.982.922-3.69 2.35-.64-.528-1.45-.84-2.33-.84-2.107 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.88 0 1.688-.312 2.33-.84.707 1.428 2.147 2.35 3.69 2.35 1.54 0 2.982-.922 3.69-2.35.64.528 1.45.84 2.33.84 2.107 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.614 5.71l-4.477-4.41 1.464-1.442 3.013 2.968 6.41-6.305 1.464 1.442-7.874 7.747z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-400 truncate">{tweet.userHandle} · {tweet.timestamp}</p>
                    </div>
                </div>

                {/* Tweet Body */}
                <p className="text-gray-200 mb-6 leading-relaxed line-clamp-4 flex-grow">
                    {tweet.content}
                </p>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-gray-400 text-sm">
                    <div className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors group/stat">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{tweet.replies}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-green-400 transition-colors group/stat">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{tweet.retweets}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-pink-400 transition-colors group/stat">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{tweet.likes}</span>
                    </div>
                    <div className="p-1 px-3 rounded-full bg-white/5 group-hover:bg-white/10 text-white transition-all text-xs">
                        詳細
                    </div>
                </div>
            </div>
        </a>
    );
}
