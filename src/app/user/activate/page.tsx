


'use client';

import { useState, useMemo } from "react";
import { useGetMyInventory, InventoryEntry } from "@/api/inventory/list";
import { ItemDetailCard } from "./components/ItemDetailCard";
import { FilterSection } from "./components/FilterSection";
import { ItemCard } from "./components/ItemCard";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function ActivatePage() {
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<InventoryEntry | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  // Build query params
  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: itemsPerPage,
      type: selectedType || undefined,
      rarity: selectedRarity || undefined,
      sort: sortBy,
      includeNFTs: 'true' as const,
    };
  }, [currentPage, selectedType, selectedRarity, sortBy]);

  const { data, isLoading, error, refetch } = useGetMyInventory(queryParams);

  const inventory = data?.data?.inventory || [];
  const pagination = data?.data?.pagination;
  const totalItems = pagination?.totalItems || 0;
  const totalPages = pagination?.totalPages || 1;

  const handleEquip = (item: InventoryEntry) => {
    // TODO: Implement equip API call
    toast({
      title: "Item Equipped",
      description: `${item.itemname} has been equipped.`,
    });
    refetch();
  };

  const handleUnequip = (item: InventoryEntry) => {
    // TODO: Implement unequip API call
    toast({
      title: "Item Unequipped",
      description: `${item.itemname} has been unequipped.`,
    });
    refetch();
  };

  const handleSell = (item: InventoryEntry) => {
    // TODO: Navigate to marketplace or open sell dialog
    toast({
      title: "Sell Item",
      description: `Opening marketplace for ${item.itemname}`,
    });
  };

  const handleGift = (item: InventoryEntry) => {
    // TODO: Open gift dialog
    toast({
      title: "Gift Item",
      description: `Opening gift dialog for ${item.itemname}`,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedItem(null);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="border border-red-500 bg-red-500/10 rounded-md p-4">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Inventory</h2>
          <p className="text-red-300">{error.message || 'Failed to load inventory'}</p>
          <Button onClick={() => refetch()} className="mt-4 bg-red-600 hover:bg-red-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Section 1: Item Detail Card */}
      <ItemDetailCard
        item={selectedItem}
        onEquip={handleEquip}
        onUnequip={handleUnequip}
      />

      {/* Section 2: Filter Section */}
      <FilterSection
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedRarity={selectedRarity}
        onRarityChange={setSelectedRarity}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Section 3: Item Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      ) : inventory.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📦</div>
          <div className="text-lg">No items found</div>
          <div className="text-sm">Try adjusting your filters</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {inventory.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onSelect={setSelectedItem}
                isSelected={selectedItem?._id === item._id}
                onSell={handleSell}
                onGift={handleGift}
                onEquip={item.isEquipped ? handleUnequip : handleEquip}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}