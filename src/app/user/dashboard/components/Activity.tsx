import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


export default function Activity() {
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
                <TabsContent value="transactions">
                    <p className=" text-zinc-400">No recent transactions.</p>
                </TabsContent>
            </Tabs>  
        </div>
    )
}