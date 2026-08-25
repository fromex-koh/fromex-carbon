"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "usehooks-ts"
import { useEffect } from "react"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-gray-600",
      className,
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

interface TableProps {
  head?: (string | number | React.JSX.Element)[]
  rows?: (string | number | React.JSX.Element)[][]
  isLoading?: boolean
  skeletonRowCount?: number
  skeletonCellCount?: number
  maxTitleWidthRatio?: number
  tableClassName?: string
  tableBodyClassName?: string
  tableRowClassName?: string
  tableCellClassName?: string
  tableHeaderClassName?: string
  tableHeadClassName?: string
  mobileCellClassName?: string
  mobileHeadClassName?: string
  mobileContentClassName?: string
}

const ResponsiveTable: React.FC<TableProps> = ({
  head,
  rows,
  isLoading,
  skeletonRowCount,
  skeletonCellCount,
  maxTitleWidthRatio = 10,
  tableClassName,
  tableBodyClassName,
  tableRowClassName,
  tableCellClassName,
  tableHeaderClassName,
  tableHeadClassName,
  mobileCellClassName,
  mobileHeadClassName,
  mobileContentClassName,
}) => {
  const [isMounted, setIsMounted] = React.useState(false)
  const isMobile = useMediaQuery("(max-width: 767px)")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const maxTitleWidth = React.useMemo(() => {
    return (
      Math.max(
        ...(head ?? [])
          .filter(
            (title) => typeof title === "string" || typeof title === "number",
          )
          .map((title) => String(title).length),
      ) * maxTitleWidthRatio
    )
  }, [head])

  if (!isMounted) return null
  if (isLoading) {
    return (
      <TableSkeleton
        skeletonRowCount={skeletonRowCount}
        skeletonCellCount={skeletonCellCount}
        maxTitleWidth={maxTitleWidth}
        isMobile={isMobile}
      />
    )
  }

  return (
    <Table className={cn(tableClassName)}>
      {isMobile ? (
        <TableBody className={cn("max-md:border-t", tableBodyClassName)}>
          {(rows ?? []).map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={cn("rounded-lg p-2 md:border", tableRowClassName)}
            >
              <TableCell
                className={cn("flex flex-col gap-2 p-3", tableCellClassName)}
              >
                {row.map((cell, cellIndex) => (
                  <div
                    key={`${rowIndex}-${cellIndex}`}
                    className={cn("flex gap-1", mobileCellClassName)}
                  >
                    <span
                      className={cn(
                        "font-medium text-muted-foreground",
                        mobileHeadClassName,
                      )}
                      style={{ minWidth: `${maxTitleWidth}px` }}
                    >
                      {(head ?? [])[cellIndex]}
                    </span>
                    <span className={cn(mobileContentClassName)}>{cell}</span>
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <>
          <TableHeader className={cn(tableHeaderClassName)}>
            <TableRow className={cn(tableRowClassName)}>
              {(head ?? []).map((title, index) => (
                <TableHead key={index} className={cn(tableHeadClassName)}>
                  {title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className={cn(tableBodyClassName)}>
            {(rows ?? []).map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <TableRow key={rowIndex} className={cn(tableRowClassName)}>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className={cn(tableCellClassName)}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  )
}

const TableSkeleton: React.FC<
  TableProps & { isMobile: boolean; maxTitleWidth: number }
> = ({ skeletonRowCount, skeletonCellCount, maxTitleWidth, isMobile }) => {
  const rowArray = new Array(skeletonRowCount).fill(0)
  const cellArray = new Array(skeletonCellCount).fill(0)

  return (
    <Table>
      {isMobile ? (
        <TableBody>
          {rowArray.map((_, rowIndex) => (
            <TableRow key={rowIndex} className="rounded-lg border p-2">
              <TableCell className="p-3">
                {[0, 1].map((_, cellIndex) => (
                  <div
                    key={`${rowIndex}-${cellIndex}`}
                    className="flex items-center gap-2"
                  >
                    <Skeleton
                      className="h-6"
                      style={{ minWidth: `${maxTitleWidth}px` }}
                    ></Skeleton>
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <TableBody>
          {rowArray.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <TableRow key={rowIndex}>
                {cellArray.map((cell, cellIdx) => (
                  <TableCell key={`${cellIdx}`}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      )}
    </Table>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  ResponsiveTable,
}
