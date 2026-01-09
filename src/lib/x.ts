export interface TweetItem {
    id: string;
    userName: string;
    userHandle: string;
    userImage: string;
    content: string;
    timestamp: string;
    likes: number;
    retweets: number;
    replies: number;
    link: string;
}

const MOCK_TWEETS: TweetItem[] = [
    {
        id: "1",
        userName: "NTT 東日本 ニュース",
        userHandle: "@NTTEast_PR",
        userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=NTT",
        content: "電話での特殊詐欺対策として、AIによる「偽音声検知アプリ」をNABLAS社と共同開発しました。深層学習を活用し、肉声とAI合成音声の微細な違いをリアルタイムで識別します。 #NTT #防犯 #AI #ディープフェイク",
        timestamp: "1時間前",
        likes: 3420,
        retweets: 1100,
        replies: 45,
        link: "https://twitter.com"
    },
    {
        id: "2",
        userName: "楽天グループ プレス",
        userHandle: "@RakutenGroupPR",
        userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rakuten",
        content: "OpenAIとの協業をさらに強化。EC、金融、モバイルの各サービスに次世代LLMを統合し、ユーザー体験を革新します。日本市場に最適化されたAIモデルの共同開発も進行中です。 #楽天 #OpenAI #生成AI",
        timestamp: "3時間前",
        likes: 2150,
        retweets: 580,
        replies: 32,
        link: "https://twitter.com"
    },
    {
        id: "3",
        userName: "テック・インサイダー JPG",
        userHandle: "@tech_insider_jp",
        userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech",
        content: "CES 2026で日本のスタートアップ「First Habit」が最高賞を受賞！AIを活用した習慣形成とパーソナライズ学習が世界的に高く評価されました。日本のエドテックが熱い。 #CES2026 #スタートアップ #AI教育",
        timestamp: "5時間前",
        likes: 1280,
        retweets: 420,
        replies: 28,
        link: "https://twitter.com"
    },
    {
        id: "4",
        userName: "経済ニュース速報",
        userHandle: "@biz_news_jp",
        userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Biz",
        content: "ソフトバンクとアドバンテスト、東京エレクトロンなどのAI関連銘柄が堅調。2026年は「実用フェーズ」に入り、国内企業の労働生産性向上が本格的な投資テーマになっています。 #株価 #AI #経済",
        timestamp: "8時間前",
        likes: 890,
        retweets: 150,
        replies: 12,
        link: "https://twitter.com"
    }
];

/**
 * X (Twitter) API (RapidAPI - SocialData等) を使用してツイートを取得する
 */
export async function fetchTrendingTweets(query: string): Promise<TweetItem[]> {
    const apiKey = process.env.X_API_KEY;
    const apiHost = process.env.X_API_HOST || "social-data-api.p.rapidapi.com";

    // APIキーがない場合はモックデータを返す
    if (!apiKey) {
        console.log("X_API_KEY is not set. Using mock data.");
        return getFilteredMocks(query);
    }

    try {
        // 日本語のAI関連ポストを優先的に取得するためのクエリ調整
        const searchQuery = `${query} lang:ja min_faves:10`;
        const url = `https://${apiHost}/status/search?query=${encodeURIComponent(searchQuery)}&type=Top`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            },
            next: { revalidate: 3600 } // 1時間キャッシュ
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // APIのレスポンス形式に合わせてマッピング (SocialData APIを想定)
        // 実際のAPIによってパスが異なるため、柔軟に対応
        const tweets = data.tweets || data.results || [];

        if (tweets.length === 0) {
            return getFilteredMocks(query);
        }

        return tweets.map((t: any) => ({
            id: t.id_str || String(t.id),
            userName: t.user?.name || "Unknown",
            userHandle: `@${t.user?.screen_name}` || "@unknown",
            userImage: t.user?.profile_image_url_https || "",
            content: t.full_text || t.text || "",
            timestamp: formatRelativeTime(t.created_at),
            likes: t.favorite_count || 0,
            retweets: t.retweet_count || 0,
            replies: t.reply_count || 0,
            link: `https://twitter.com/${t.user?.screen_name}/status/${t.id_str || t.id}`
        }));

    } catch (error) {
        console.error("Failed to fetch tweets from X API:", error);
        return getFilteredMocks(query);
    }
}

function getFilteredMocks(query: string): TweetItem[] {
    const filtered = MOCK_TWEETS.filter(t =>
    (t.content.toLowerCase().includes(query.toLowerCase()) ||
        query === "Artificial Intelligence" ||
        query === "AI" ||
        query === "人工知能")
    );
    return filtered.length > 0 ? filtered : MOCK_TWEETS;
}

function formatRelativeTime(dateString: string): string {
    if (!dateString) return "不明";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    return `${days}日前`;
}
