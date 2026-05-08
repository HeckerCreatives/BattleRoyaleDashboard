'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaEdit, FaTasks, FaUsers, } from "react-icons/fa"
import { MdDashboard, MdWeb, MdAdminPanelSettings } from "react-icons/md"
import { GrHostMaintenance, GrTransaction } from "react-icons/gr"
import { FaBullhorn } from "react-icons/fa"
import { IoIosGift, IoIosSettings, IoIosArrowDown, IoIosMail } from "react-icons/io"
import { Box, Clock, Currency, Gift, MessageCircle, Sparkle, Store, User } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { FaMessage, FaRankingStar } from 'react-icons/fa6'

// ─── Nav Config ──────────────────────────────────────────────────────────────

type NavLink = {
  type: 'link'
  label: string
  href: string
  icon: React.ReactNode
}

type NavGroup = {
  type: 'group'
  label: string
  icon: React.ReactNode
  /** Match any of these path prefixes to highlight the trigger */
  matchPrefixes?: string[]
  children: Omit<NavLink, 'type'>[]
}

export type NavItem = NavLink | NavGroup

 export const NAV_ITEMS: NavItem[] = [
  {
    type: 'link',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <MdDashboard size={20} />,
  },
  {
    type: 'link',
    label: 'Game',
    href: '/dashboard/game',
    icon: <FaRankingStar size={20} />,
  },
  //  {
  //   type: 'link',
  //   label: 'Leaderboards',
  //   href: '/dashboard/leaderboards',
  //   icon: <Box size={20} />,
  // },
  {
    type: 'link',
    label: 'Dailies',
    href: '/dashboard/dailies',
    icon: <Clock size={20} />,
  },
   {
    type: 'group',
    label: 'Rewards',
    icon: <Sparkle size={20} />,
    matchPrefixes: ['/dashboard/rewards/'],
    children: [
      {
        label: 'Grant',
        href: '/dashboard/rewards/grant',
        icon: <Gift size={20} />,
      },
       {
        label: 'Quest',
        href: '/dashboard/rewards/quest',
        icon: <FaTasks size={20} />,
      },
     
    ],
  },
  // {
  //   type: 'link',
  //   label: 'Marketplace',
  //   href: '/dashboard/marketplace',
  //   icon: <Store size={20} />,
  // },
  {
    type: 'group',
    label: 'User Management',
    icon: <FaUsers size={20} />,
    matchPrefixes: ['/dashboard/usermanagement/'],
    children: [
      {
        label: 'Players',
        href: '/dashboard/usermanagement/player',
        icon: <FaUsers size={20} />,
      },
      // Uncomment to restore Admins link:
      // {
      //   label: 'Admins',
      //   href: '/dashboard/usermanagement/admins',
      //   icon: <MdAdminPanelSettings size={20} />,
      // },
    ],
  },
  {
    type: 'link',
    label: 'Message',
    href: '/dashboard/message',
    icon: <FaMessage size={20} />,
  },
  {
    type: 'link',
    label: 'Transaction',
    href: '/dashboard/transaction',
    icon: <GrTransaction size={20} />,
  },
  {
    type: 'link',
    label: 'News',
    href: '/dashboard/news',
    icon: <FaBullhorn size={20} />,
  },
  {
    type: 'link',
    label: 'Newsletter',
    href: '/dashboard/newsletter',
    icon: <IoIosMail size={20} />,
  },
  {
    type: 'group',
    label: 'Customization',
    icon: <FaEdit size={20} />,
    matchPrefixes: ['/dashboard/customization/'],
    children: [
      {
        label: 'Landing Page',
        href: '/dashboard/customization/landingpage',
        icon: <MdWeb size={20} />,
      },
      {
        label: 'Social Links',
        href: '/dashboard/customization/sociallinks',
        icon: <MessageCircle size={20} />,
      },
    ],
  },
  {
    type: 'link',
    label: 'Maintenance',
    href: '/dashboard/maintenance',
    icon: <GrHostMaintenance size={20} />,
  },
  // {
  //   type: 'link',
  //   label: 'Rewards',
  //   href: '/dashboard/rewards',
  //   icon: <IoIosGift size={20} />,
  // },
  {
    type: 'link',
    label: 'Account Settings',
    href: '/dashboard/settings',
    icon: <IoIosSettings size={20} />,
  },
]

// ─── Shared class helper ──────────────────────────────────────────────────────

export const linkClass = (active: boolean) =>
  `flex items-center space-x-4 px-3 py-2 text-sm hover:text-secondary ease-in-out duration-300 ${
    active ? 'text-secondary' : ''
  }`

// ─── Sub-components ───────────────────────────────────────────────────────────

export function NavLinkItem({ item, pathname }: { item: NavLink; pathname: string }) {
  const isActive = pathname === item.href || pathname === `${item.href}/`
  return (
    <Link href={item.href} passHref className={linkClass(isActive)} role="menuitem">
      {item.icon}
      <span>{item.label}</span>
    </Link>
  )
}

export function NavGroupItem({ item, pathname }: { item: NavGroup; pathname: string }) {
  const isActive =
    item.matchPrefixes?.some((prefix) => pathname.startsWith(prefix)) ?? false

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <p className={linkClass(isActive)} role="menuitem">
          {item.icon}
          <span>{item.label}</span>
        </p>
        <IoIosArrowDown size={10} />
      </CollapsibleTrigger>

      <CollapsibleContent className="flex flex-col gap-2 pl-4">
        {item.children.map((child) => {
          const childActive = pathname === child.href || pathname === `${child.href}/`
          return (
            <Link
              key={child.href}
              href={child.href}
              passHref
              className={linkClass(childActive)}
            >
              {child.icon}
              <span>{child.label}</span>
            </Link>
          )
        })}
      </CollapsibleContent>
    </Collapsible>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:block hidden w-[300px] h-screen sticky left-0 top-0 bg-zinc-950 text-white"
      style={{
        backgroundImage: "url('/dashboard/assets/Left Rectangular.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex flex-col gap-5 w-full h-full p-4">
        {/* Logo */}
        <Link href="/dashboard" aria-label="Go to the dashboard" passHref>
          <div className="flex items-center justify-center space-x-3">
            <img src="/logo 06 B.png" alt="Logo" width={120} />
          </div>
        </Link>

        {/* Nav Items */}
        <div className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) =>
            item.type === 'link' ? (
              <NavLinkItem key={item.href} item={item} pathname={pathname} />
            ) : (
              <NavGroupItem key={item.label} item={item} pathname={pathname} />
            )
          )}
        </div>
      </div>
    </nav>
  )
}