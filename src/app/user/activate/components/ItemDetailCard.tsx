'use client';

import { InventoryEntry } from "@/api/inventory/list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ItemDetailCardProps {
  item: InventoryEntry | null;
  onEquip: (item: InventoryEntry) => void;
  onUnequip: (item: InventoryEntry) => void;
}

export function ItemDetailCard({ item, onEquip, onUnequip }: ItemDetailCardProps) {
  if (!item) {
    return (
      <Card className="p-6 bg-gray-900/50 border-gray-700">
        <div className="text-center text-gray-500">
          Select an item to view details
        </div>
      </Card>
    );
  }

    const formatTokenId = (tokenId?: number) => {
        if (tokenId === undefined || tokenId === null) return '000000';
        return tokenId.toString().padStart(6, '0');
    }


  return (
    <Card className="p-6 bg-gray-900/50 border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Activate NFT</h2>
      <div className="bg-orange-500/20 border border-orange-500/50 rounded-md p-4 mb-4">
        <p className="text-sm text-orange-200">
          When using in-game, every NFT of the granting gear depending industry, its owner have this industry standard comes real game arrival that index.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Item Image */}
        <div className="flex-shrink-0">
          <div className="w-48 h-48 border-2 border-gray-600 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
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
        </div>

        {/* Item Details */}
        <div className="flex-1">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Name</h3>
            <p className="text-gray-300">{item.itemname}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-300">{item.item.description || 'No description available'}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Rank Bonus</h3>
            <p className="text-gray-300">e.g. 20 matches / day</p>
          </div>

          <div className="flex gap-4 items-center">
            {item.isEquipped ? (
              <Button
                onClick={() => onUnequip(item)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Unequip
              </Button>
            ) : (
              <Button
                onClick={() => onEquip(item)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Equip
              </Button>
            )}
            
            <div className="flex gap-2">
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                {item.item.rarity || 'Common'}
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                {item.type}
              </Badge>
              {item.isMinted && (
                <Badge variant="outline" className="border-green-600 text-green-300">
                  NFT #{formatTokenId(item.tokenId)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
