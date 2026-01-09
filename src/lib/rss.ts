import Parser from "rss-parser";

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet: string;
  imageUrl?: string;
}

// Yahoo!ニュースの <image> タグを取得するためのカスタムフィールド設定
const parser = new Parser({
  customFields: {
    item: ['image']
  }
});

import { AI_KEYWORDS } from "./constants";

// Yahoo!ニュースのRSS URL（ITカテゴリに限定して精度を高める）
const YAHOO_RSS_URLS = [
  "https://news.yahoo.co.jp/rss/categories/it.xml"
];

/**
 * 記事がAIに関連しているか判定する
 */
function isAIBased(title: string, snippet: string): boolean {
  const content = (title + " " + snippet).toUpperCase();
  return AI_KEYWORDS.some(keyword => content.includes(keyword.toUpperCase()));
}

export async function fetchNews(query: string = "人工知能"): Promise<NewsItem[]> {
  // 検索クエリを強化（AI/人工知能をORで結合）
  const enhancedQuery = query === "人工知能" ? "(AI OR 人工知能 OR 機械学習)" : query;
  const encodedQuery = encodeURIComponent(enhancedQuery);
  const googleNewsUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=ja&gl=JP&ceid=JP:ja`;

  try {
    // google newsとYahoo!ニュースのRSSを並行してフェッチ
    const fetchPromises = [
      parser.parseURL(googleNewsUrl).then(feed => ({ type: 'google' as const, feed })),
      ...YAHOO_RSS_URLS.map(url => parser.parseURL(url).then(feed => ({ type: 'yahoo' as const, feed })))
    ];

    const results = await Promise.allSettled(fetchPromises);

    let allItems: NewsItem[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { type, feed } = result.value;

        feed.items.forEach((item: any) => {
          let title = item.title || "Untitled";
          let source = "Unknown";
          let snippet = item.contentSnippet || item.content || "";
          let imageUrl = item.image || undefined;

          if (type === 'google') {
            // Google News format: "Title - Source"
            const titleParts = title.split(" - ");
            source = titleParts.length > 1 ? titleParts.pop() || "Unknown" : "Unknown";
            title = titleParts.join(" - ") || "Untitled";
          } else {
            // Yahoo! News
            source = "Yahoo!ニュース";
          }

          // AI関連キーワードによるフィルタリング（Yahoo!などの広範なソース向け）
          if (type === 'yahoo' && !isAIBased(title, snippet)) {
            return;
          }

          allItems.push({
            title,
            link: item.link || "#",
            pubDate: item.pubDate || new Date().toISOString(),
            source,
            snippet,
            imageUrl,
          });
        });
      }
    });

    // 重複除去 (linkをキーにする)
    const uniqueItems = Array.from(new Map(allItems.map(item => [item.link, item])).values());

    // 日付順にソート (最新順)
    return uniqueItems.sort((a, b) =>
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

  } catch (error) {
    console.error("Failed to fetch RSS feeds:", error);
    return [];
  }
}
