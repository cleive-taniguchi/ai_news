"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useCallback, useEffect, useRef } from "react";

// サジェスト用のキーワードリスト
const SUGGEST_KEYWORDS = [
    "AI", "人工知能", "生成AI", "機械学習", "深層学習", "ディープラーニング",
    "ChatGPT", "GPT-4", "OpenAI", "Claude", "Gemini", "Llama",
    "NVIDIA", "GPU", "半導体", "H100", "Blackwell",
    "ロボット", "ロボティクス", "ボストン・ダイナミクス",
    "自動運転", "テスラ", "Waymo",
    "量子コンピュータ", "AI倫理", "プロンプトエンジニアリング",
    "大規模言語モデル", "LLM", "エッジAI", "AIエージェント",
    "Google DeepMind", "Microsoft AI", "Anthropic", "Perplexity"
];

export function Sidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const currentQuery = searchParams.get("q") || "人工知能";
    const [inputValue, setInputValue] = useState(currentQuery);

    // サジェスト関連の状態
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);

    // 検索実行処理
    const executeSearch = useCallback((query: string) => {
        if (query.trim()) {
            startTransition(() => {
                router.push(`/?q=${encodeURIComponent(query.trim())}`);
            });
            setIsOpen(false);
            setShowSuggestions(false);
        }
    }, [router]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        executeSearch(inputValue);
    };

    // 入力変更時のフィルタリング
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim()) {
            const filtered = SUGGEST_KEYWORDS.filter(k =>
                k.toLowerCase().includes(value.toLowerCase()) &&
                k.toLowerCase() !== value.toLowerCase()
            ).slice(0, 6); // 最大6件表示
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
            setSelectedIndex(-1);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // キーボード操作
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            const selected = suggestions[selectedIndex];
            setInputValue(selected);
            executeSearch(selected);
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    // クリック外判定
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={toggleMenu}
                className="fixed top-4 left-4 z-[60] md:hidden p-3 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 neon-glow transition-all duration-300 hover:border-purple-500/50"
                aria-label="メニューを開く"
            >
                <div className="w-6 h-5 flex flex-col justify-between">
                    <span className={`block h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                    <span className={`block h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed left-0 top-0 h-full w-80 z-50
                bg-black/70 backdrop-blur-2xl border-r border-white/10
                p-6 flex flex-col
                transition-transform duration-300 ease-out
                md:translate-x-0
                ${isOpen ? 'translate-x-0 animate-slide-in' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-glow-pulse" />
                <div className="absolute bottom-40 right-5 w-24 h-24 bg-cyan-500/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />

                {/* Logo */}
                <div className="relative mb-10">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-br from-white via-purple-300 to-cyan-300 bg-clip-text text-transparent animate-float drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        AI ニュースハブ
                    </h1>
                    <p className="text-sm text-gray-300 mt-2 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Google News & Yahoo!で配信
                    </p>
                </div>

                {/* Search Form */}
                <div className="relative mb-10" ref={suggestionRef}>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-200 mb-3">
                        🔍 トピックを検索
                    </label>
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl opacity-0 group-focus-within:opacity-50 blur transition-all duration-300" />
                        <input
                            id="search"
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => inputValue && suggestions.length > 0 && setShowSuggestions(true)}
                            placeholder="例：ロボティクス、AI倫理..."
                            autoComplete="off"
                            className="relative w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                        />
                        <button
                            type="submit"
                            disabled={isPending}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:from-purple-500 hover:to-cyan-400 transition-all duration-300 disabled:opacity-50 neon-glow"
                        >
                            {isPending ? (
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </button>
                    </form>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden z-[70] shadow-2xl animate-fade-in">
                            <ul className="py-2">
                                {suggestions.map((suggestion, index) => (
                                    <li key={suggestion}>
                                        <button
                                            className={`w-full text-left px-5 py-3 transition-all duration-200 ${selectedIndex === index
                                                ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white"
                                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                                                }`}
                                            onClick={() => {
                                                setInputValue(suggestion);
                                                executeSearch(suggestion);
                                            }}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <span className="flex items-center gap-3">
                                                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-4m0 0l4 4m-4-4V4" />
                                                </svg>
                                                {suggestion}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Current Topic */}
                <div className="relative mb-auto">
                    <p className="text-xs text-gray-300 mb-3 uppercase tracking-wider">表示中のトピック</p>
                    <div className="inline-flex items-center px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 neon-glow">
                        <span className="text-sm text-white font-medium">{currentQuery}</span>
                    </div>
                </div>

                {/* Quick Topics */}
                <div className="relative mb-8">
                    <p className="text-xs text-gray-300 mb-3 uppercase tracking-wider">人気のトピック</p>
                    <div className="flex flex-wrap gap-2">
                        {['AI', 'ロボット', '機械学習', 'ChatGPT', '自動運転'].map((topic) => (
                            <button
                                key={topic}
                                onClick={() => {
                                    setInputValue(topic);
                                    executeSearch(topic);
                                }}
                                className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-gray-200 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-white transition-all duration-300"
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative text-xs text-gray-400 pt-4 border-t border-white/5">
                    <p>© 2026 AI ニュースハブ</p>
                </div>
            </aside>
        </>
    );
}
