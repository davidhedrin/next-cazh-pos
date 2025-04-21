"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import data from "./data.json"
import { useState } from "react"
import TableTopToolbar from "@/components/table-top-toolbar"
import TablePagination from "@/components/table-pagination"

import { TableThModel } from "@/lib/models-type";

export default function Page() {
  const [pageTable, setPageTable] = useState("1");
  const [perPage, setPerPage] = useState("10");

  const tblThColomns: TableThModel[] = [
    { key: "invoice", name: "Invoice" },
    { key: "status", name: "Status" },
    { key: "method", name: "Method" },
    { key: "reviewer", name: "Reviewer" },
    { key: "amount", name: "Amount" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 gap-4 mb-3 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              $1,250.00
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up this month
            </div>
            <div className="text-muted-foreground">
              Visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>New Customers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              1,234
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                -20%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Down 20% this period
            </div>
            <div className="text-muted-foreground">
              Acquisition needs attention
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Accounts</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              45,678
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Strong user retention
            </div>
            <div className="text-muted-foreground">Engagement exceed targets</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Growth Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              4.5%
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                +4.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Steady performance increase
            </div>
            <div className="text-muted-foreground">Meets growth projections</div>
          </CardFooter>
        </Card>
      </div>

      <TableTopToolbar thColomn={tblThColomns} />
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead><Checkbox aria-label="Select all" disabled /></TableHead>
              {
                tblThColomns.map((x, i) => {
                  return <TableHead key={x.key}>{x.name}</TableHead>
                })
              }
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((data) => (
              <TableRow key={data.id}>
                <TableCell><Checkbox aria-label="Select row" /></TableCell>
                <TableCell>{data.header}</TableCell>
                <TableCell>{data.type}</TableCell>
                <TableCell>{data.target}</TableCell>
                <TableCell>{data.reviewer}</TableCell>
                <TableCell>{data.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination perPage={perPage} pageTable={pageTable} setPerPage={setPerPage} setPageTable={setPageTable} />
    </>
  )
}
