'use client';

import { useGetLeaderboard } from "@/api/leaderboard/list";
export default function Leaderboard(){

    const { data, isLoading, error } = useGetLeaderboard();
    console.log("Leaderboard data:", data);
    
    const leaderboardObj = data?.data?.leaderboard || {};
    const leaderboardData = Object.values(leaderboardObj);

    return (
        <div className="border border-gray-700 rounded-lg h-[500px] mt-8 bg-zinc-900/50 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-4">
                <h2 className="text-xl font-bold text-white">Leaderboard</h2>
            </div>
            <div className="p-4 overflow-auto h-[calc(500px-64px)]">
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400">Loading...</div>
                </div>
            ) : error ? (
                <div className="text-red-400 text-center p-4">
                    Error loading leaderboard
                </div>
            ) : leaderboardData.length === 0 ? (
                <div className="text-gray-400 text-center p-4">
                    No leaderboard data available
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Rank</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Username</th>
                                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboardData.map((entry: any, index: number) => (
                                <tr 
                                    key={index} 
                                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="py-3 px-4">
                                        <span className={`font-bold ${
                                            index === 0 ? 'text-yellow-400' :
                                            index === 1 ? 'text-gray-300' :
                                            index === 2 ? 'text-orange-600' :
                                            'text-gray-400'
                                        }`}>
                                            #{index + 1}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-200">{entry.user}</td>
                                    <td className="py-3 px-4 text-orange-400 font-semibold">{entry.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
        </div>
    )
}