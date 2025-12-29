'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterSectionProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  selectedRarity: string | null;
  onRarityChange: (rarity: string | null) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalItems: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const ITEM_TYPES = [
  { label: 'Head Gear', value: 'headgear' },
  { label: 'Gloves', value: 'gloves' },
  { label: 'Upper Body', value: 'upperbody' },
  { label: 'Title', value: 'title' },
  { label: 'Weapon', value: 'weapon' },
  { label: 'Foot Gear', value: 'footgear' },
  { label: 'Lower Body', value: 'lowerbody' },
];

const RARITIES = [
  { label: 'All', value: 'all' },
  { label: 'Common', value: 'common' },
  { label: 'Uncommon', value: 'uncommon' },
  { label: 'Rare', value: 'rare' },
  { label: 'Epic', value: 'epic' },
  { label: 'Legendary', value: 'legendary' },
  { label: 'Mythic', value: 'mythic' },
];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Lowest ID', value: 'lowestId' },
  { label: 'Highest ID', value: 'highestId' },
  { label: 'Sort A-Z', value: 'a-z' },
  { label: 'Sort Z-A', value: 'z-a' },
];

export function FilterSection({
  selectedType,
  onTypeChange,
  selectedRarity,
  onRarityChange,
  sortBy,
  onSortChange,
  totalItems,
  currentPage = 0,
  totalPages = 1,
  onPageChange,
}: FilterSectionProps) {
  return (
    <div className="space-y-4">
      {/* Type Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {ITEM_TYPES.map((type) => (
          <Button
            key={type.value}
            onClick={() => onTypeChange(selectedType === type.value ? null : type.value)}
            variant={selectedType === type.value ? 'default' : 'outline'}
            className={`
              rounded-full px-4 py-2 text-sm
              ${selectedType === type.value 
                ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600'
              }
            `}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Count, Rarity, and Sort */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">
          {totalItems} Items
        </div>

        <div className="flex flex-col gap-3 items-end">
          <div className="flex gap-3">
            {/* Rarity Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600"
                >
                  Rarity
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 bg-gray-800 border-gray-700">
                <div className="space-y-2">
                  {RARITIES.map((rarity) => (
                    <Button
                      key={rarity.value}
                      onClick={() => onRarityChange(rarity.value === 'all' ? null : rarity.value)}
                      variant="ghost"
                      className={`w-full justify-start ${
                        (rarity.value === 'all' && !selectedRarity) || selectedRarity === rarity.value
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {rarity.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Sort Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600"
                >
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 bg-gray-800 border-gray-700">
                <div className="space-y-2">
                  {SORT_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                      variant="ghost"
                      className={`w-full justify-start ${
                        sortBy === option.value
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Pagination - Only show when there's data */}
          {totalItems > 0 && onPageChange && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="bg-gray-800 hover:bg-gray-700 border-gray-600"
              >
                &lt;
              </Button>

              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (currentPage <= 2) {
                  pageNum = i;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    onClick={() => onPageChange(pageNum)}
                    className={
                      currentPage === pageNum
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-gray-800 hover:bg-gray-700 border-gray-600'
                    }
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 3 && (
                <span className="text-gray-500">...</span>
              )}

              <Button
                variant="outline"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="bg-gray-800 hover:bg-gray-700 border-gray-600"
              >
                &gt;
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
