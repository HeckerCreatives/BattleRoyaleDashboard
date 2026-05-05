'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { NAV_ITEMS } from '@/components/Sidebar'
import type { NavItem } from '@/components/Sidebar'

// ─── Build maps ───────────────────────────────────────────────────────────────

function buildMaps(items: NavItem[]) {
  const labelMap: Record<string, string> = {}
  const linkSet = new Set<string>()      // only real navigable hrefs

  for (const item of items) {
    if (item.type === 'link') {
      labelMap[item.href] = item.label
      linkSet.add(item.href)
    } else if (item.type === 'group') {
      // Group parent: label only, no real route
      for (const prefix of item.matchPrefixes ?? []) {
        const href = prefix.replace(/\/$/, '')
        labelMap[href] = item.label
        // intentionally NOT added to linkSet
      }
      for (const child of item.children) {
        labelMap[child.href] = child.label
        linkSet.add(child.href)
      }
    }
  }

  return { labelMap, linkSet }
}

const { labelMap: LABEL_MAP, linkSet: LINK_SET } = buildMaps(NAV_ITEMS)

// ─── Component ────────────────────────────────────────────────────────────────

export default function Breadcrumb() {
  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)

  const crumbs = segments.map((_, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/')
    const label = LABEL_MAP[href] ?? capitalize(segments[i])
    const isNavigable = LINK_SET.has(href)
    return { href, label, isNavigable }
  })

  if (crumbs.length <= 1) return null

  return (
    <nav className="hidden md:flex items-center gap-1 text-sm text-zinc-400">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1

        return (
          <React.Fragment key={crumb.href}>
            {i !== 0 && (
              <ChevronRight size={14} className="text-zinc-600 shrink-0" />
            )}
            {isLast ? (
              // Last segment — always plain text
              <span className="text-white font-medium">{crumb.label}</span>
            ) : crumb.isNavigable ? (
              // Real route — clickable
              <Link href={crumb.href} className="hover:text-white transition-colors">
                {crumb.label}
              </Link>
            ) : (
              // Group parent — no route, plain muted text
              <span className="text-zinc-500">{crumb.label}</span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}