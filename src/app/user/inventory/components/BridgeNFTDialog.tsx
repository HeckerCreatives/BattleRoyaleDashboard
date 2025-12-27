"use client"

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface BridgeNFTDialogProps {
  tokenId: number;
  itemName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (tokenId: number) => void;
  isPending?: boolean;
}

export default function BridgeNFTDialog({
  tokenId,
  itemName,
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: BridgeNFTDialogProps) {
  const { toast } = useToast();

  const handleBridge = () => {
    onConfirm(tokenId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bridge NFT to Account</DialogTitle>
          <DialogDescription>
            Link {itemName} #{tokenId.toString().padStart(6, '0')} to your in-game account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              This will register this NFT in your in-game inventory and make it available for use in the game.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Token ID:</span>
              <span className="font-medium">#{tokenId.toString().padStart(6, '0')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Item Name:</span>
              <span className="font-medium">{itemName}</span>
            </div>
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
            onClick={handleBridge}
            disabled={isPending}
            className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
          >
            {isPending ? 'Bridging...' : 'Bridge to Account'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
