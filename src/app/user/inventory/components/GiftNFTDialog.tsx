"use client"

import React, { useState } from 'react';
import { useGiftNFT } from '@/api/nft/mutations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useUserList } from '@/api/auth/auth';

interface GiftNFTDialogProps {
  tokenId: number;
  itemName: string;
  inventoryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function GiftNFTDialog({
  tokenId,
  itemName,
  inventoryId,
  open,
  onOpenChange,
  onSuccess,
}: GiftNFTDialogProps) {

  const { data: userList, isPending: isUserListPending } = useUserList(0,99999);

  const [targetWallet, setTargetWallet] = useState('');
  const { mutate: giftNFT, isPending } = useGiftNFT();
  const { toast } = useToast();

  const handleGift = () => {
    if (!inventoryId) {
      toast({
        title: 'Error',
        description: 'Inventory ID is required',
        variant: 'destructive',
      });
      return;
    }

    if (!targetWallet) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid wallet address',
        variant: 'destructive',
      });
      return;
    }

    if (targetWallet.length !== 42 || !targetWallet.startsWith('0x')) {
      toast({
        title: 'Invalid Address',
        description: 'Wallet address must be 42 characters and start with 0x',
        variant: 'destructive',
      });
      return;
    }

    giftNFT(
      { tokenId, targetWallet, inventoryId },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: `${itemName} gifted to ${targetWallet.substring(0, 6)}...${targetWallet.substring(38)}`,
          });
          setTargetWallet('');
          onSuccess?.();
        },
        onError: (error: any) => {
          toast({
            title: 'Gift Failed',
            description: error?.message || 'Failed to gift NFT',
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gift NFT</DialogTitle>
          <DialogDescription>
            Transfer {itemName} #{tokenId.toString().padStart(6, '0')} to another wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="wallet" className="text-sm font-medium">
              Select Recipient
            </label>
            {isUserListPending ? (
              <div className="text-sm text-gray-500">Loading users...</div>
            ) : (
              <Select
                value={targetWallet}
                onValueChange={setTargetWallet}
                disabled={isPending}
              >
                <SelectTrigger className="w-full border">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {userList?.data?.users?.map((user: any) => (
                    <SelectItem key={user.id} value={user.walletAddress}>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.username}</span>
                        <span className="text-xs text-gray-500">
                          {user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(38)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
            onClick={handleGift}
            disabled={isPending || !targetWallet}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {isPending ? 'Gifting...' : 'Gift NFT'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
