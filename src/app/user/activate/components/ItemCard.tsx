'use client';

import { InventoryEntry } from "@/api/inventory/list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ItemCardProps {
  item: InventoryEntry;
  onSelect: (item: InventoryEntry) => void;
  isSelected: boolean;
  onSell?: (item: InventoryEntry) => void;
  onGift?: (item: InventoryEntry) => void;
  onEquip?: (item: InventoryEntry) => void;
}

export function ItemCard({ 
  item, 
  onSelect, 
  isSelected,
  onSell,
  onGift,
  onEquip 
}: ItemCardProps) {
    const formatTokenId = (tokenId?: number) => {
        if (tokenId === undefined || tokenId === null) return '000000';
        return tokenId.toString().padStart(6, '0');
    }

  return (
    <Card
      className={`
        bg-gray-900/50 border cursor-pointer transition-all hover:border-orange-500/50
        ${isSelected ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-gray-700'}
      `}
      onClick={() => onSelect(item)}
    >
      <div className="p-4">
        {/* Item Image */}
        <div className="aspect-square border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-800 mb-3 flex items-center justify-center">
          {item.ipfsImage ? (
            <img
              src={item.ipfsImage}
              alt={item.itemname}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-500 text-center">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-xs">Item Image</div>
            </div>
          )}
        </div>

        {/* Item Info */}
        <div className="space-y-2 mb-3">
          <div>
            <div className="text-sm text-gray-400">Name</div>
            <div className="font-semibold text-white truncate">{item.itemname}</div>
          </div>
          
          {item.isMinted && (
            <div>
              <div className="text-sm text-gray-400">NFT #</div>
              <div className="font-semibold text-orange-400">#{formatTokenId(item.tokenId)}</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onSell?.(item);
            }}
          >
            Sell
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onGift?.(item);
            }}
          >
            Gift
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`
              text-xs
              ${item.isEquipped 
                ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600'
              }
            `}
            onClick={(e) => {
              e.stopPropagation();
              onEquip?.(item);
            }}
          >
            {item.isEquipped ? 'Equipped' : 'Equip'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
