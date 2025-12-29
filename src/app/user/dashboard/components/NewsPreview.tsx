'use client';

import { ChevronRight, Newspaper } from 'lucide-react';
import Link from 'next/link';

interface NewsItem {
    id: string;
    title: string;
    date: string;
    category: string;
}

const dummyNews: NewsItem[] = [
    { id: '1', title: 'Season 2 Battle Pass Now Available!', date: '2 hours ago', category: 'Update' },
    { id: '2', title: 'New Map: Desert Storm Coming Soon', date: '1 day ago', category: 'Announcement' },
    { id: '3', title: 'Weekend Double XP Event', date: '2 days ago', category: 'Event' },
    { id: '4', title: 'Server Maintenance Scheduled', date: '3 days ago', category: 'Maintenance' },
];

export default function NewsPreview() {
    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Update': 'bg-blue-600',
            'Announcement': 'bg-purple-600',
            'Event': 'bg-green-600',
            'Maintenance': 'bg-red-600',
        };
        return colors[category] || 'bg-gray-600';
    };

    return (
        <div className="border border-gray-700 rounded-lg h-[300px] bg-zinc-900/50 overflow-hidden mt-8">
            {/* Header */}
            <Link href="/user/news" className="group">
                <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-4 flex items-center justify-between cursor-pointer hover:from-orange-500 hover:to-orange-700 transition-colors">
                    <div className="flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-white" />
                        <h2 className="text-xl font-bold text-white">News</h2>
                    </div>
                    <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>

            {/* News List */}
            <div className="p-4 space-y-3 h-[calc(300px-64px)] overflow-y-auto">
                {dummyNews.map((news) => (
                    <div
                        key={news.id}
                        className="bg-zinc-800/50 rounded-lg p-3 hover:bg-zinc-800 transition-colors cursor-pointer border border-gray-700"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-white line-clamp-2 flex-1">
                                {news.title}
                            </h3>
                            <span className={`text-[10px] font-medium text-white px-2 py-1 rounded ${getCategoryColor(news.category)} whitespace-nowrap`}>
                                {news.category}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400">{news.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
