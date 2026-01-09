"use client";

import { useState, useMemo } from "react";
import { NewsCard } from "./NewsCard";
import { TweetCard } from "./TweetCard";
import { AI_KEYWORDS } from "@/lib/constants";
import type { NewsItem } from "@/lib/rss";
import type { TweetItem } from "@/lib/x";

interface DashboardProps {
    news: NewsItem[];
    tweets: TweetItem[];
    query: string;
}

type Tab = "all" | "news" | "x";

export function Dashboard({ news, tweets, query }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>("all");
    const [relevanceThreshold, setRelevanceThreshold] = useState(0);

    // スコアリング関数
    const calculateScore = (text: string, currentQuery: string) => {
        let score = 0;
        const lowerText = text.toLowerCase();

        // AI推奨キーワードとの一致
        AI_KEYWORDS.forEach(kw => {
            if (lowerText.includes(kw.toLowerCase())) score += 1;
        });

        // 現在の検索クエリとの一致（ボーナス）
        if (currentQuery && currentQuery !== "Artificial Intelligence" && currentQuery !== "AI") {
            if (lowerText.includes(currentQuery.toLowerCase())) score += 2;
        }

        return score;
    };

    // フィルタリングとスコアリングを適用
    const filteredContent = useMemo(() => {
        const calculateItemScore = (item: NewsItem | TweetItem) => {
            const content = 'title' in item
                ? `${item.title} ${item.snippet}`
                : `${item.userName} ${item.content}`;
            return calculateScore(content, query);
        };

        const scoredNews = news.map(n => ({ type: 'news' as const, data: n, score: calculateItemScore(n) }));
        const scoredTweets = tweets.map(t => ({ type: 'x' as const, data: t, score: calculateItemScore(t) }));

        // 閾値でフィルタリング
        const filteredNews = scoredNews.filter(n => n.score >= relevanceThreshold);
        const filteredTweets = scoredTweets.filter(t => t.score >= relevanceThreshold);

        // 合和・シャッフル（交互配置）
        const mixed: ({ type: 'news', data: NewsItem, score: number } | { type: 'x', data: TweetItem, score: number })[] = [];
        const maxLen = Math.max(filteredNews.length, filteredTweets.length);
        for (let i = 0; i < maxLen; i++) {
            if (i < filteredNews.length) mixed.push(filteredNews[i]);
            if (i < filteredTweets.length) mixed.push(filteredTweets[i]);
        }

        return {
            all: mixed,
            news: filteredNews,
            x: filteredTweets
        };
    }, [news, tweets, query, relevanceThreshold]);

    const displayData = filteredContent[activeTab];

    return (
        <main className="md:ml-80 ml-0 min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
            {/* Background Effects */}
            <div className="fixed inset-0 md:ml-80 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-glow-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[80px] animate-glow-pulse" style={{ animationDelay: '4s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-10 pt-20 md:pt-10">
                {/* Header */}
                <header className="mb-10">
                    <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-1.5 h-10 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                    AI ニュース・インサイト
                                </h2>
                            </div>
                            <div className="ml-5">
                                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
                                    {query}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Relevance Slider */}
                            <div className="flex flex-col gap-2 w-full md:w-64 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400">
                                    <span>関連性フィルター</span>
                                    <span className="text-cyan-400">Lv.{relevanceThreshold}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="3"
                                    step="1"
                                    value={relevanceThreshold}
                                    onChange={(e) => setRelevanceThreshold(Number(e.target.value))}
                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500 transition-all hover:bg-white/20"
                                />
                                <div className="flex justify-between text-[10px] text-gray-500 font-medium px-1">
                                    <span>すべて</span>
                                    <span>厳選</span>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="inline-flex p-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 font-medium ${activeTab === 'all'
                                        ? 'bg-gradient-to-r from-gray-600/80 to-gray-500/80 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    すべて
                                </button>
                                <button
                                    onClick={() => setActiveTab("news")}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 font-medium ${activeTab === 'news'
                                        ? 'bg-gradient-to-r from-purple-600/80 to-purple-500/80 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    ニュース
                                </button>
                                <button
                                    onClick={() => setActiveTab("x")}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 font-medium ${activeTab === 'x'
                                        ? 'bg-gradient-to-r from-cyan-600/80 to-cyan-500/80 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    X トレンド
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${activeTab === 'news' ? 'bg-purple-500' :
                            activeTab === 'x' ? 'bg-cyan-500' : 'bg-white'
                            }`} />
                        {activeTab === 'news' ? 'ニュース' : activeTab === 'x' ? 'X ポスト' : '総合情報'}
                        <span className="text-white font-semibold mx-1">{displayData.length}</span> 件を表示中
                        {relevanceThreshold > 0 && (
                            <span className="ml-2 text-cyan-400 italic">（レベル {relevanceThreshold} 以上の関連性）</span>
                        )}
                    </p>
                </header>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayData.length > 0 ? (
                        displayData.map((item, index) => (
                            <div
                                key={item.type === 'news' ? `${item.data.link}-${index}` : item.data.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                {item.type === 'news' ? (
                                    <NewsCard {...item.data} />
                                ) : (
                                    <TweetCard tweet={item.data} />
                                )}
                            </div>
                        ))
                    ) : (
                        <NoContent message="該当する情報がありません" />
                    )}
                </div>
            </div>
        </main>
    );
}

function NoContent({ message }: { message: string }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-32 rounded-3xl bg-white/5 border border-dashed border-white/10">
            <div className="text-8xl mb-6 animate-float opacity-50">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-3">{message}</h3>
            <p className="text-gray-400 text-center max-w-md">
                関連性フィルターを「すべて」に近づけるか、別のトピックを試してみてください
            </p>
        </div>
    );
}
