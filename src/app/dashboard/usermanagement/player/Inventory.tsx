import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TiArrowLeftThick, TiArrowRightThick } from 'react-icons/ti'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import api from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Battery, CheckIcon, ChevronsUpDownIcon, Crown, FlaskConical, HelpCircle, Loader2, Scissors, Shirt, Sword, Type, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
import { handleApiError } from '@/utils/ApiError'


interface Items {
  _id: string
  itemid:string
  itemname: string
  description: string
  amount: 10,
  currency: string
  type: string
  consumable: string
  createdAt: string
  updatedAt: string
    quantity: number,
    isEquipped: boolean,
              
}

interface Props {
    userid: string
}



export default function Inventory(props: Props) {
    const [inventory, setInventory] = useState('skin')
    const [selectItem, setSelectItem] = useState('')
    const [open, setOpen] = useState(false)
    const [list, setList] = useState<Items[]>([])
    const [items, setItems] = useState<Items[]>([])
    const [qty, setQty] = useState(1)
    const [loading, setLoading] = useState(false)
    const [loadingList, setLoadingList] = useState(false)
    const [ totalpages, setTotalPages] = useState(0)
    const [ currentpage, setCurrentpage] = useState<number>(0)
    const grantItems = items.filter((item) =>
        ["energy", "potion", "title"].includes(item.type)
        )

    
    

     const fetchData = async () => {
        const res = await api.get(`/marketplace/admin/player/inventory?page=${currentpage}&limit=6&search=&userId=${props.userid}&type=${inventory}`)
        setList(res.data.data.inventory)
        setTotalPages(res.data.data.pagination.totalPages)
      }

      const fetchItemData = async () => {
        const res = await api.get(`/marketplace/admin/items?limit=999999`)
        setItems(res.data.data)
    }


    useEffect(() => {
        const handler = setTimeout(() => {
        fetchItemData();
        }, 500);
        return () => {
        clearTimeout(handler);
        };
    }, []);
    
    
     useEffect(() => {
        setLoadingList(true)
        const handler = setTimeout(() => {
          fetchData();
        setLoadingList(false)

        }, 500);
        return () => {
          clearTimeout(handler);
        };
      }, [inventory, currentpage]);

       const grantItem = async () => {
        setLoading(true)
            try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/admin/player/add`, 
                {
                userId: props.userid,
                itemid: selectItem,     
                quantity: qty
                },
                {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
                }
            )

            toast({
                variant: "default",
                title: "Success",
                description: "Item granted successfully",
                duration: 2000
            })

            fetchData()
        setLoading(false)
        setSelectItem('')
        setQty(1)

            } catch (error) {
        setLoading(false)

            handleApiError(error)
            }
        }

    const getItemIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "energy":
            return <Zap className="h-5 w-5 " />
            case "potion":
            return <FlaskConical className="h-5 w-5 " />
            case "title":
            return <Crown className="h-5 w-5 " />
            case "skin":
            return <Shirt className="h-5 w-5 " />
            case "hair":
            return <Scissors className="h-5 w-5 " />
            case "weapon":
            return <Sword className="h-5 w-5 " />
            default:
            return <HelpCircle className="h-5 w-5 " />
        }
        }
    
  return (
     <div className=' relative w-full h-full rounded-lg flex flex-col gap-6 items-start p-4 z-50 overflow-y-auto'
                                        style={{backgroundImage: "url('/userdashboard/Assets/TAB HOLDER small.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat:"no-repeat"}}
                                        
                                        >

                                            <div className=' relative z-[99999999] flex flex-col bg-amber-950 p-3 rounded-sm'>
                                                <p className=' text-sm text-orange-600 mb-2'>Grant Items</p>

                                                <div className=' flex items-end flex-wrap gap-2 text-white'>
                                                    <div className=' flex flex-col'>
                                                        <p className=' text-xs'>Select Item</p>
                                                        <Popover open={open} onOpenChange={setOpen}>
                                                        <PopoverTrigger asChild className=' w-full'>
                                                            <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className=" w-[200px]  bg-white justify-between text-black"
                                                            >
                                                            {selectItem
                                                                ? grantItems.find((item) => item.itemid === selectItem)?.itemname
                                                                : "Select item..."}
                                                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>

                                                        <PopoverContent
                                                            className=" max-w-xs p-0 "
                                                        
                                                        >

                                                            <Command shouldFilter={true}>
                                                            <CommandInput placeholder="Search item..." />

                                                            <CommandList className="max-h-60 overflow-y-auto">
                                                                <CommandEmpty>No item found.</CommandEmpty>
                                                                <CommandGroup>
                                                                {grantItems.map((item) => (
                                                                    <CommandItem
                                                                    key={item._id}
                                                                    onSelect={() => {
                                                                        setSelectItem(item.itemid)
                                                                        setOpen(false) // ✅ close only when selecting item
                                                                    }}
                                                                    >
                                                                    <CheckIcon
                                                                        className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectItem === item.itemid ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {item.itemname}
                                                                    </CommandItem>
                                                                ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                        </Popover>
                                                    </div>

                                                    <div className=' flex flex-col'>
                                                        <p className=' text-xs'>Qty.</p>
                                                       <Input defaultValue={1} value={qty} onChange={(e) => setQty(e.target.valueAsNumber)} type='number' className=' text-black w-16'/>
                                                    </div>

                                                    <Button onClick={grantItem} disabled={loading}>
                                                        {loading && <Loader2 size={16} className="animate-spin mr-2" />}
                                                        Grant</Button>
                                                </div>

                                               







                                            </div>

                                            <div className=' hidden w-full bg-amber-900 md:grid grid-cols-5 p-2'>
                                                <p onClick={() => setInventory('skin')} className={`w-full text-sm text-center border-r-4 border-amber-950 cursor-pointer ${inventory === 'skin' ? ' text-orange-500' : ' text-orange-100'}`}>Skins</p>
                                                <p onClick={() => setInventory('title')} className={`w-full text-sm text-center border-r-4 border-amber-950 cursor-pointer ${inventory === 'title' ? ' text-orange-500' : ' text-orange-100'}`}>Titles</p>
                                                <p onClick={() => setInventory('hair')} className={`w-full text-sm text-center border-r-4 border-amber-950 cursor-pointer ${inventory === 'hair' ? ' text-orange-500' : ' text-orange-100'}`}>Hair Styles</p>
                                                <p onClick={() => setInventory('weapon')} className={`w-full text-sm text-center border-r-4 border-amber-950 cursor-pointer ${inventory === 'weapon' ? ' text-orange-500' : ' text-orange-100'}`}>Weapon</p>
                                                <p onClick={() => setInventory('usable')} className={`w-full text-sm text-center cursor-pointer ${inventory === 'usable' ? ' text-orange-500' : ' text-orange-100'}`}>Usable</p>
                                        

                                            </div>

                                            <Select value={inventory} onValueChange={setInventory}>
                                            <SelectTrigger className=" visible md:hidden bg-zinc-950 border-2 border-orange-300 border-opacity-30 text-orange-100">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent className=' bg-zinc-950 border-orange-300 border-opacity-30 text-orange-100'>
                                                <SelectItem value="skin" className=' cursor-pointer'>Skins</SelectItem>
                                                <SelectItem value="title" className=' cursor-pointer'>Titles</SelectItem>
                                                <SelectItem value="hair" className=' cursor-pointer'>Hair Styles</SelectItem>
                                                <SelectItem value="weapon" className=' cursor-pointer'>Weapon</SelectItem>
                                                <SelectItem value="usable" className=' cursor-pointer'>Usable</SelectItem>
                                            </SelectContent>
                                            </Select>

                                           <div
                                        className="grid 
                                        grid-cols-1
                                        md:grid-cols-2
                                                    lg:grid-cols-3 
                                                    w-full 
                                                    h-[75%] 
                                                    overflow-y-auto 
                                                    gap-4"
                                        >

                                            {list.map((item, index) => (
                                                <div
                                                key={index}
                                                className=" bg-gradient-to-b from-amber-950 to-amber-900 
                                                            border-2 border-orange-300 border-opacity-50 p-4 space-y-1"
                                                >
                                                    <div className=' p-3 w-fit rounded-md bg-orange-700 flex items-center justify-center text-white mb-4'>
                                                       {getItemIcon(item.type)}
                                                    </div>
                                                <p className="text-[clamp(1rem,1vw,1.5rem)] font-semibold text-orange-500">
                                                    {item.itemname}
                                                </p>
                                                <p className="text-[clamp(0.5rem,0.9vw,0.7rem)] text-white">
                                                    Quantity: {item.quantity.toLocaleString()}
                                                </p>
                                                </div>
                                            ))}
                                            </div>

                                            {list.length === 0 && (
                                                <div className=' w-full flex items-center justify-center py-16'>
                                                   {loadingList && <Loader2 size={16} className="animate-spin mr-2" />}
                                                    <p className=' text-xs text-zinc-300'>No items</p>
                                    
                                                </div>
                                            )}

                                           <div className=' w-full flex items-center justify-end gap-4'>
                                                <button 
                                                onClick={() => setCurrentpage( currentpage - 1)}
                                                disabled={loading ? true : currentpage === 0} 
                                            className=' cursor-pointer  bg-gradient-to-r from-orange-200 to-orange-400 rounded-md text-amber-950 px-6'><TiArrowLeftThick size={30}/></button>
                                                {/* <p className=' text-sm font-bold bg-zinc-950 px-4 py-2 text-center  rounded-md'>{currentpage + 1}</p> */}
                                                <button
                                                onClick={() => setCurrentpage(currentpage + 1)}
                                                disabled={ loading ? true :  currentpage + 1 === totalpages}
                                                className=' cursor-pointer bg-gradient-to-r from-orange-200 to-orange-400 rounded-md text-amber-950 px-6'><TiArrowRightThick size={30}/></button>

                                            </div>
                                        </div>
  )
}
