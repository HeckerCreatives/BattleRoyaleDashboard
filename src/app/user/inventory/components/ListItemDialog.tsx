"use client"

import React, { useState } from 'react';
import { useListNFT } from '@/api/nft/mutations';
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ListItemDialog({
  tokenId,
  itemName,
  open,
  onOpenChange,
  onSuccess,
}: ListItemDialogProps) {
  const [price, setPrice] = useState('');
  const { mutate: listNFT, isPending } = useListNFT();
  const { toast } = useToast();

  const handleList = () => {
    if (!price || parseFloat(price) <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price greater than 0',
        variant: 'destructive',
      });
      return;
    }

    listNFT(
      { tokenId, price },
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
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleList}
            disabled={isPending || !price}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Listing...' : 'List Item'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
