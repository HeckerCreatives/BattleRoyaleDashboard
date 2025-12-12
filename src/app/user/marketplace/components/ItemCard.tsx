"use client";

import React, { useState } from 'react';
import { NFTItem } from '@/api/nft/list';
import { toast } from '@/components/ui/use-toast';
import { useCancelListing, useBuyNFT } from '@/api/nft/mutations';

type Props = {
	item: NFTItem;
	currentAddress?: string;
	onSuccess?: () => void;
};

export default function ItemCard({ item, currentAddress, onSuccess }: Props) {
	const cancelListingMutation = useCancelListing();
	const buyNFTMutation = useBuyNFT();

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
		if (!seller || !currentAddress) return false;
		return seller.toLowerCase() === currentAddress.toLowerCase();
	}

	const truncateAddress = (a?: string) => {
		if (!a) return '';
		if (a.length <= 12) return a;
		return `${a.substring(0,6)}...${a.substring(a.length - 4)}`;
	}

	const handleCancel = async () => {
		if (!window.ethereum) return toast({ variant: 'destructive', title: 'No wallet', description: 'Please install a Web3 wallet.' });
		
		cancelListingMutation.mutate(
			{ tokenId: item.tokenId },
			{
				onSuccess: () => {
					toast({ variant: 'default', title: 'Listing cancelled', description: `Token #${item.tokenId} listing cancelled` });
					if (onSuccess) onSuccess();
				},
				onError: (err: any) => {
					console.error(err);
					toast({ variant: 'destructive', title: 'Cancel failed', description: err?.message || 'Cancel failed' });
				}
			}
		);
	}

	const handleBuy = async () => {
		if (!window.ethereum) return toast({ variant: 'destructive', title: 'No wallet', description: 'Please install a Web3 wallet.' });
		
		buyNFTMutation.mutate(
			{ tokenId: item.tokenId, price: item.price },
			{
				onSuccess: () => {
					toast({ variant: 'default', title: 'Purchase successful', description: `You purchased token #${item.tokenId}` });
					if (onSuccess) onSuccess();
				},
				onError: (err: any) => {
					console.error(err);
					toast({ variant: 'destructive', title: 'Buy failed', description: err?.message || 'Buy failed' });
				}
			}
		);
	}

	// const formatPrice = (p?: string) => {
	// 	if (!p) return '0';
	// 	const n = Number(p);
	// 	if (Number.isNaN(n)) return p;
	// 	if (n === 0) return '0';
	// 	if (n < 0.0001) return n.toPrecision(4);
	// 	if (n < 1) return n.toFixed(6).replace(/\.?0+$/,'');
	// 	return n.toFixed(4).replace(/\.?0+$/,'');
	// }
	return (
		<div className="border rounded-lg overflow-hidden shadow-sm bg-white">
			<div className="h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
				{item.seller && (
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

			<div className="p-3">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-semibold text-gray-900 truncate">{item.name} #{formatTokenId(item.tokenId)}</h3>
	
				</div>
				<p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>

				<div className="mt-3 flex items-center justify-between">
					<div>
						<div className="text-xs text-black">Price</div>
						<div className="text-sm text-black font-medium">{item.price} ETH</div>
					</div>

					<div className="text-right">
						<div className="text-xs text-black-500">Seller</div>
						<div className="text-xs text-gray-700 truncate w-28">{item.seller}</div>
					</div>
				</div>

				<div className="mt-3 flex items-center justify-between">
					{isSellerOwner(item.seller) ? (
						<button
							className="px-3 py-1 text-sm bg-red-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={handleCancel}
							disabled={cancelListingMutation.isPending}
						>
							{cancelListingMutation.isPending ? 'Canceling...' : 'Cancel Listing'}
						</button>
					) : (
						<button
							className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={handleBuy}
							disabled={buyNFTMutation.isPending}
						>
							{buyNFTMutation.isPending ? 'Processing...' : `Buy NFT`}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

