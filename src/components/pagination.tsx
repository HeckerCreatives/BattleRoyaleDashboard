"use client"

import { ArrowBigLeft, ArrowBigRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const maxVisiblePages = 3
    const pages = []

    const startPage = Math.max(0, Math.min(currentPage - 1, totalPages - maxVisiblePages))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages)

    for (let i = startPage; i < endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <Button
        className=" px-6 py-1 rounded-md shadow cursor-pointer"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ArrowBigLeft size={18} />
      </Button>

        {/* <p
          className={`px-3 py-1 text-sm rounded border-2 border-zinc-800 `}
        >
          {currentPage + 1}
        </p> */}

      <Button
        className=" px-6 py-1 rounded-md shadow cursor-pointer"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        <ArrowBigRight size={18} />
      </Button>
    </div>
  )
}
