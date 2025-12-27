"use client"

import React from 'react';
import { NFTItem } from '../../../../api/nft/list';
import { useMintNFT } from '../../../../api/nft/mutations';
import { toast } from '@/components/ui/use-toast';

interface Props {
  item: NFTItem;
}

export default function MintAction({ item }: Props) {
  const mintMutation = useMintNFT();

  const handleMint = () => {
    if (!item.inventoryId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Inventory ID is required' });
      return;
    }

    // Build metadata for NFT
    const metadata = {
      name: item.name || `Token #${item.tokenId}`,
      description: item.description || '',
      image: item.image || '',
      attributes: [],
    };

    console.log('Minting NFT with:', { tokenId: item.tokenId, inventoryId: item.inventoryId, metadata });

    // Call mintNFT with tokenId, metadata, and inventoryId
    mintMutation.mutate(
      { 
        tokenId: item.tokenId, 
        metadata,
        inventoryId: item.inventoryId, // Use backend inventory _id/id for registration
      },
      {
        onSuccess: (data) => {
          console.log('Mint success:', data);
          toast({ 
            title: 'Success!', 
            description: `NFT #${item.tokenId} minted successfully${data.backendRegistered ? '' : ' (backend sync pending)'}` 
          });
        },
        onError: (error: any) => {
          console.error('Mint error:', error);
          const errorMessage = error?.message || 'Failed to mint NFT';
          toast({ 
            variant: 'destructive', 
            title: 'Minting Failed', 
            description: errorMessage 
          });
        }
      }
    );
  };

  return (
    <button
      onClick={handleMint}
      disabled={mintMutation.isPending}
      className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-md"
    >
      {mintMutation.isPending ? 'Minting...' : 'Mint'}
    </button>
  );
}
