// components/RewardsField.tsx
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

import { useGetRewardItems, VALID_REWARD_TYPES } from '@/api/rewards/quest'
import { RewardSchema } from '@/validations/quest'

interface RewardsFieldProps {
  selected: RewardSchema[]
  onChange: (val: RewardSchema[]) => void
}

export function RewardsField({ selected, onChange }: RewardsFieldProps) {
  const { data } = useGetRewardItems()

  console.log(selected)

  // ➜ ADD
  const addReward = () => {
    onChange([
      ...selected,
      { type: VALID_REWARD_TYPES[0], amount: 1 },
    ])
  }

  // ➜ DELETE
  const removeReward = (index: number) => {
    onChange(selected.filter((_, i) => i !== index))
  }

  // ➜ UPDATE FIELD
  const updateReward = (index: number, updated: Partial<RewardSchema>) => {
    const copy = [...selected]
    copy[index] = { ...copy[index], ...updated }
    onChange(copy)
  }

  return (
    <div className="bg-zinc-800 border border-zinc-600 rounded-md p-3 space-y-2">
        <Button type='button' onClick={addReward} variant="secondary" size="sm" className=' text-xs'>
        + Add Reward
      </Button>
      {selected.map((reward, i) => (
        <div key={i} className="flex items-end flex-wrap gap-2 bg-zinc-900 p-3 rounded-md">

          {/* TYPE */}
          <div className=' space-y-1'>
            <p className=' text-xs text-zinc-500'>Type</p>
          <Select
            value={reward.type}
            onValueChange={(val) =>
              updateReward(i, { type: val as any, itemid: undefined })
            }
          >
            <SelectTrigger className="w-[140px] bg-zinc-600">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {VALID_REWARD_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
          

          {/* ITEM SELECT (only if type === 'item') */}

          
          {reward.type === 'item' && (
            <div className=' space-y-1'>
            <p className=' text-xs text-zinc-500'>Items</p>
         <Select
              value={reward.itemid}
              onValueChange={(val) =>
                updateReward(i, { itemid: val })
              }
            >
              <SelectTrigger className="w-[180px] bg-zinc-600">
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {data?.data?.map((item: any) => (
                  <SelectItem key={item.itemid} value={item.itemid}>
                    {item.itemname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
            
          )}

          {/* AMOUNT */}
          <div className=' space-y-1'>
            <p className=' text-xs text-zinc-500'>Amount</p>
              <Input
            type="number"
            min={1}
            value={reward.amount}
            onChange={(e) =>
              updateReward(i, {
                amount: parseInt(e.target.value) || 1,
              })
            }
            className="w-[80px] bg-zinc-600"
          />
            </div>
        

          {/* DELETE */}
          <Button
            variant="destructive"
            size="sm"
            type='button'
            onClick={() => removeReward(i)}
          >
            ✕
          </Button>
        </div>
      ))}

      {/* ADD BUTTON */}
    
    </div>
  )
}