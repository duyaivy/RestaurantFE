"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/shared/ui/pagination'
import { cn } from '@/shared/lib/utils'
import { useSearchParams } from 'next/navigation'
interface Props {
  page: number
  pageSize: number
  pathname: string
}

/**
Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page

[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20 
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 8 9 ... 19 20

1 2 ...13 14 [15] 16 17 ... 19 20


1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 15 16 [17] 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]
 */

const RANGE = 2
export default function AutoPagination({ page, pageSize, pathname }: Props) {
  const searchParams = useSearchParams()
  const pageCount = Math.max(1, pageSize)
  const activePage = Math.min(Math.max(page, 1), pageCount)

  const createPageHref = (pageNumber: number) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString())
    const nextPage = Math.min(Math.max(pageNumber, 1), pageCount)

    nextSearchParams.set('page', String(nextPage))

    return {
      pathname,
      query: Object.fromEntries(nextSearchParams.entries())
    }
  }

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <PaginationItem key={`ellipsis-before-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <PaginationItem key={`ellipsis-after-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }
    return Array(pageCount)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1

        // Điều kiện để return về ...
        if (activePage <= RANGE * 2 + 1 && pageNumber > activePage + RANGE && pageNumber < pageCount - RANGE + 1) {
          return renderDotAfter(index)
        } else if (activePage > RANGE * 2 + 1 && activePage < pageCount - RANGE * 2) {
          if (pageNumber < activePage - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > activePage + RANGE && pageNumber < pageCount - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (activePage >= pageCount - RANGE * 2 && pageNumber > RANGE && pageNumber < activePage - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <PaginationItem key={index}>
            <PaginationLink
              href={createPageHref(pageNumber)}
              isActive={pageNumber === activePage}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        )
      })
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageHref(activePage - 1)}
            className={cn({
              'cursor-not-allowed': activePage === 1
            })}
            onClick={(e) => {
              if (activePage === 1) {
                e.preventDefault()
              }
            }}
          />
        </PaginationItem>
        {renderPagination()}

        <PaginationItem>
          <PaginationNext
            href={createPageHref(activePage + 1)}
            className={cn({
              'cursor-not-allowed': activePage === pageCount
            })}
            onClick={(e) => {
              if (activePage === pageCount) {
                e.preventDefault()
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
