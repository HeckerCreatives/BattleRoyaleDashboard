'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface InventorySlot {
    id: string;
    type: string;
    count: number;
    icon: string;
}

const dummyInventory: InventorySlot[] = [
    { id: '1', type: 'Head Gear', count: 99, icon: '🪖' },
    { id: '2', type: 'Upper Body', count: 99, icon: '👔' },
    { id: '3', type: 'Lower Body', count: 99, icon: '👖' },
    { id: '4', type: 'Gloves', count: 99, icon: '🧤' },
    { id: '5', type: 'Foot Gear', count: 99, icon: '👟' },
    { id: '6', type: 'Weapon', count: 99, icon: '🔫' },
    { id: '7', type: 'Title', count: 99, icon: '🏆' },
];

export default function InventoryPreview() {
    return (
        <div className="border border-gray-700 rounded-lg h-[500px] bg-zinc-900/50 overflow-hidden">
            {/* Header */}
            <Link href="/user/inventory" className="group">
                <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-4 flex items-center justify-between cursor-pointer hover:from-orange-500 hover:to-orange-700 transition-colors">
                    <h2 className="text-xl font-bold text-white">Inventory</h2>
                    <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>

            {/* Inventory Grid */}
            <div className="p-4 grid grid-cols-2 gap-3 h-[calc(500px-64px)] overflow-y-auto">
                {dummyInventory.map((slot) => (
                    <div
                        key={slot.id}
                        className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-3 flex items-center gap-3 hover:from-orange-500 hover:to-orange-600 transition-colors cursor-pointer"
                    >
                        {/* Icon */}
                        <div className="bg-zinc-800/80 rounded-full w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0">
                            {slot.icon}
                        </div>
                        
                        {/* Type and Count */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-orange-100 truncate">{slot.type}</p>
                            <p className="text-2xl font-bold text-white">{slot.count}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
