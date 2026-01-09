import { Suspense } from "react";
import { fetchNews } from "@/lib/rss";
import { fetchTrendingTweets } from "@/lib/x";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
    const { q = "Artificial Intelligence" } = await searchParams;
    const [news, tweets] = await Promise.all([
        fetchNews(q),
        fetchTrendingTweets(q)
    ]);

    return (
        <div className="min-h-screen bg-gray-950">
            <Suspense fallback={<SidebarSkeleton />}>
                <Sidebar />
            </Suspense>
            <Dashboard news={news} tweets={tweets} query={q} />
        </div>
    );
}

function SidebarSkeleton() {
    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-8" />
            <div className="h-12 bg-white/10 rounded mb-4" />
            <div className="h-10 bg-white/10 rounded" />
        </aside>
    );
}
