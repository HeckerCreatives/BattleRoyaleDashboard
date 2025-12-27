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

interface ActivityProps {
  activityData?: any[];
  isLoading?: boolean;
}

export default function Activity({ activityData, isLoading }: ActivityProps) {
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

    return (
        <div className="border rounded-md h-[500px] p-6">
            <h2 className=" text-xl font-semibold mb-4 bg-gradient-to-r from-orange-500 to-black p-2 rounded-sm">Activity</h2>
            <Tabs defaultValue="match" className=" w-full">
                <TabsList className=" bg-zinc-800 rounded-md mb-4">
                    <TabsTrigger value="match" className=" data-[state=active]:bg-orange-400 data-[state=active]:text-amber-950 w-1/2">Match</TabsTrigger>
                    <TabsTrigger value="transactions" className=" data-[state=active]:bg-orange-400 data-[state=active]:text-amber-950 w-1/2">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="match">
                    <p className=" text-zinc-400">No recent match.</p>
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
                                    <TableHead className="text-white">Item</TableHead>
                                    <TableHead className="text-white">Type</TableHead>
                                    <TableHead className="text-white">Description</TableHead>
                                    <TableHead className="text-white">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activityData.map((activity) => (
                                    <TableRow key={activity._id}>
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