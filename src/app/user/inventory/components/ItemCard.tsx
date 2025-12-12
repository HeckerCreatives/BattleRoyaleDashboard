"use client"

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { NFTItem } from '../../../../api/nft/list';
import ListItemDialog from './ListItemDialog';
import GiftNFTDialog from './GiftNFTDialog';

interface Props {
  item: NFTItem;
  onList?: (tokenId: number) => void;
  mintAction?: React.ReactNode;
  onBridge?: (tokenId: number) => void;
  isMinted?: boolean;
}

export default function ItemCard({ item, onList, mintAction, onBridge, isMinted }: Props) {
  const { address } = useAccount();
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);

  const resolveImage = (img?: string) => {
    if (!img) return '';
    if (img.startsWith('ipfs://')) {
      return `https://gateway.pinata.cloud/ipfs/${img.replace('ipfs://', '')}`;
    }
    return img;
  };

  const formatTokenId = (tokenId: number) => {
    return tokenId.toString().padStart(6, '0');
  }

  const isSellerOwner = (seller?: string) => {
    if (!seller || !address) return false;
    return seller.toLowerCase() === address.toLowerCase();
  }

  const truncateAddress = (a?: string) => {
    if (!a) return '';
    if (a.length <= 12) return a;
    return `${a.substring(0,6)}...${a.substring(a.length - 4)}`;
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white h-full flex flex-col">
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {item.seller && item.listed && (
          <span className={`absolute left-2 top-2 text-xs px-2 py-0.5 rounded-md font-semibold ${isSellerOwner(item.seller) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {isSellerOwner(item.seller) ? 'Your listing' : 'Listed'}
          </span>
        )}
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveImage(item.image)}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name} #{formatTokenId(item.tokenId)}</h3>
        
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <div>
            {item.listed && item.price && item.price !== '0' ? (
              <>
                <div className="text-xs text-black">Price</div>
                <div className="text-sm text-black font-medium">{item.price} ETH</div>
              </>
            ) : (
              <div className="text-xs text-gray-400">Not for sale</div>
            )}
          </div>

          <div className="text-right">
            {item.listed && item.seller ? (
              <>
                <div className="text-xs text-black-500">Seller</div>
                <div className="text-xs text-gray-700 truncate w-28">{truncateAddress(item.seller)}</div>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            {mintAction}

            {onBridge && (
              <button
                onClick={() => onBridge && onBridge(item.tokenId)}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md"
              >
                Bridge
              </button>
            )}

            {/* List button should only appear for already-minted items */}
            {onList && isMinted && (
              <button
                onClick={() => setListDialogOpen(true)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md"
              >
                List
              </button>
            )}

            {/* Gift button should only appear for already-minted items */}
            {isMinted && (
              <button
                onClick={() => setGiftDialogOpen(true)}
                className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md"
              >
                Gift
              </button>
            )}
          </div>

          {!mintAction && !onBridge && !onList && (item.listed ? (
            <div className="text-xs text-gray-400">You listed this item</div>
          ) : (
            <div className="text-xs text-gray-400">Not for sale</div>
          ))}
        </div>
      </div>

      {onList && isMinted && (
        <ListItemDialog
          tokenId={item.tokenId}
          itemName={item.name}
          open={listDialogOpen}
          onOpenChange={setListDialogOpen}
          onSuccess={() => {
            // Optionally call onList to refresh parent data
            onList?.(item.tokenId);
          }}
        />
      )}

      {isMinted && (
        <GiftNFTDialog
          tokenId={item.tokenId}
          itemName={item.name}
          open={giftDialogOpen}
          onOpenChange={setGiftDialogOpen}
          onSuccess={() => {
            // Refresh parent data after gifting
            onList?.(item.tokenId);
          }}
        />
      )}
    </div>
  );
}
