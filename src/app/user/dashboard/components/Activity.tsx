'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetNFTActivityHistory } from "@/api/inventory/list";
import { useGetViewMatchHistory } from "@/api/matchhistory/list";

// Types for Match History
interface MatchHistoryItem {
    id: string;
    player: string;
    kills: number;
    placement: number;
    createdAt: string;
}

interface MatchHistoryResponse {
    message: string;
    data: MatchHistoryItem[];
    pagination: {
        totalCount: number;
        totalPages: number;
    };
}

// Types for Activity/Transactions
interface User {
    _id: string;
    username: string;
    walletAddress: string;
}

interface InventoryItem {
    _id: string;
    itemname: string;
    type: string;
    ipfsImage: string;
}

interface ActivityItem {
    _id: string;
    tokenId: number;
    inventoryItem: InventoryItem;
    activityType: 'gift' | 'bridge' | 'mint' | 'transfer' | 'list';
    from: User | null;
    fromWallet: string;
    to: User | null;
    toWallet: string;
    itemname: string;
    type: string;
    metadata: any;
    createdAt: string;
    updatedAt: string;
    description: string;
}

interface ActivityResponse {
    message: string;
    data: ActivityItem[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export default function Activity() {

    const { data: activityResponse, isPending: isLoading } = useGetNFTActivityHistory();
    const { data: matchResponse, isPending: isMatchLoading } = useGetViewMatchHistory({ page: 0, limit: 10 });

    const matchData = (matchResponse as MatchHistoryResponse)?.data || [];
    const activityData = (activityResponse as ActivityResponse)?.data || [];

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid date';
        }
    };

    const getActivityBadge = (type?: string) => {
        if (!type) return <span className="px-2 py-0.5 text-xs rounded-full text-white bg-gray-500">Unknown</span>;
        
        const colors: Record<string, string> = {
            bridge: 'bg-yellow-500',
            mint: 'bg-green-500',
            transfer: 'bg-blue-500',
            list: 'bg-purple-500',
            gift: 'bg-pink-500',
        };
        return (
            <span className={`px-2 py-0.5 text-xs rounded-full text-white ${colors[type] || 'bg-gray-500'}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
        );
    };

    const formatTokenId = (tokenId?: number) => {
        if (tokenId === undefined || tokenId === null) return '000000';
        return tokenId.toString().padStart(6, '0');
    }

    const getPlacementColor = (placement: number) => {
        if (placement === 1) return 'text-yellow-400 font-bold';
        if (placement <= 3) return 'text-orange-400 font-semibold';
        if (placement <= 10) return 'text-green-400';
        return 'text-gray-400';
    };

    return (
        <div className="border border-gray-700 rounded-lg h-[500px] bg-zinc-900/50 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-4">
                <h2 className="text-xl font-bold text-white">Activity</h2>
            </div>
            <Tabs defaultValue="match" className="w-full p-4">
                <TabsList className="bg-zinc-800 rounded-lg mb-4 w-full">
                    <TabsTrigger value="match" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white w-1/2 rounded-lg">Match</TabsTrigger>
                    <TabsTrigger value="transactions" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white w-1/2 rounded-lg">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="match" className="max-h-[350px] overflow-y-auto">
                    {isMatchLoading ? (
                        <p className="text-zinc-400">Loading match history...</p>
                    ) : matchData.length === 0 ? (
                        <p className="text-zinc-400">No recent match.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-white">Player</TableHead>
                                    <TableHead className="text-white">Kills</TableHead>
                                    <TableHead className="text-white">Placement</TableHead>
                                    <TableHead className="text-white">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {matchData.map((match: MatchHistoryItem) => (
                                    <TableRow key={match.id}>
                                        <TableCell className="font-medium">
                                            {match.player}
                                        </TableCell>
                                        <TableCell className="font-medium text-orange-400">
                                            {match.kills}
                                        </TableCell>
                                        <TableCell className={getPlacementColor(match.placement)}>
                                            #{match.placement}
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-400">
                                            {formatDate(match.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TabsContent>
                <TabsContent value="transactions" className="max-h-[350px] overflow-y-auto">
                    {isLoading ? (
                        <p className="text-zinc-400">Loading transactions...</p>
                    ) : !activityData || activityData.length === 0 ? (
                        <p className="text-zinc-400">No recent transactions.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-white">Token ID</TableHead>
                                    <TableHead className="text-white">Item</TableHead>
                                    <TableHead className="text-white">Type</TableHead>
                                    <TableHead className="text-white">Description</TableHead>
                                    <TableHead className="text-white">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activityData.map((activity: ActivityItem) => (
                                    <TableRow key={activity._id}>
                                        <TableCell className="font-medium">
                                            #{formatTokenId(activity.tokenId)}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {activity.inventoryItem?.ipfsImage && (
                                                    <img 
                                                        src={activity.inventoryItem.ipfsImage} 
                                                        alt={activity.itemname}
                                                        className="w-8 h-8 rounded object-cover"
                                                    />
                                                )}
                                                <span className="truncate max-w-[120px]">
                                                    {activity.itemname || 'Unknown Item'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getActivityBadge(activity.activityType)}</TableCell>
                                        <TableCell className="text-sm text-zinc-400">
                                            {activity.description || 'No description available.'}
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-400">
                                            {formatDate(activity.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TabsContent>
            </Tabs>  
        </div>
    )
}