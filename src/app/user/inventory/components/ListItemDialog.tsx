"use client"

import React, { useState, useEffect } from 'react';
import { useListNFT } from '@/api/nft/mutations';
import { useGetTokenDetails } from '@/api/inventory/list';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface ListItemDialogProps {
  tokenId: number;
  itemName: string;
  inventoryId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ListItemDialog({
  tokenId,
  itemName,
  inventoryId,
  open,
  onOpenChange,
  onSuccess,
}: ListItemDialogProps) {
  const [price, setPrice] = useState('');
  const [resolvedInventoryId, setResolvedInventoryId] = useState<string | undefined>(inventoryId);
  const { mutate: listNFT, isPending } = useListNFT();
  const { toast } = useToast();
  
  // Fetch token details if inventoryId is not provided
  const { data: tokenDetails, isLoading: isFetchingDetails } = useGetTokenDetails(
    tokenId,
    open && !inventoryId
  );
  
  // Update resolvedInventoryId when tokenDetails are fetched
  useEffect(() => {
    console.log('Token details:', tokenDetails);
    console.log('Inventory ID from props:', inventoryId);
    
    if (tokenDetails?.data?.id) {
      console.log('Setting resolved inventory ID:', tokenDetails.data.id);
      setResolvedInventoryId(tokenDetails.data.id);
    } else if (inventoryId) {
      console.log('Using inventory ID from props:', inventoryId);
      setResolvedInventoryId(inventoryId);
    }
  }, [tokenDetails, inventoryId]);

  const handleList = () => {
    if (!price || parseFloat(price) <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price greater than 0',
        variant: 'destructive',
      });
      return;
    }
    
    if (!resolvedInventoryId) {
      toast({
        title: 'Error',
        description: 'Unable to fetch inventory details. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    listNFT(
      { tokenId, price, inventoryId: resolvedInventoryId },
      {
        onSuccess: () => {
          setPrice('');
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>List Item for Sale</DialogTitle>
          <DialogDescription>
            Set a price for {itemName} #{tokenId.toString().padStart(6, '0')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isFetchingDetails ? (
            <div className="flex items-center justify-center py-4">
              <div className="text-sm text-gray-500">Loading inventory details...</div>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price (ETH)
              </label>
              <Input
                id="price"
                type="number"
                step="0.001"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isPending || isFetchingDetails}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending || isFetchingDetails}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleList}
            disabled={isPending || isFetchingDetails || !price || !resolvedInventoryId}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            title={!resolvedInventoryId ? 'Waiting for inventory ID' : !price ? 'Enter a price' : ''}
          >
            {isPending ? 'Listing...' : isFetchingDetails ? 'Loading...' : 'List Item'}
          </button>
        </DialogFooter>
      </DialogContent >
    </Dialog>
  );
}
