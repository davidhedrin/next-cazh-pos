import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"
import { Dispatch, SetStateAction } from "react"

type TablePaginationProps = {
  perPage: string;
  pageTable: string;
  setPerPage: Dispatch<SetStateAction<string>>;
  setPageTable: Dispatch<SetStateAction<string>>;
}

export default function TablePagination({
  perPage,
  pageTable,
  setPerPage,
  setPageTable,
} : TablePaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm flex">
        <div className="items-center gap-2 flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Show
          </Label>
          <Select value={perPage} onValueChange={(val) => setPerPage(val)}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Select a rows" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label htmlFor="rows-per-page" className="hidden text-sm font-medium lg:block">
            Rows per Page
          </Label>
        </div>
      </div>
      <div className="flex items-center gap-6 w-fit">
        <div className="flex items-center text-sm font-medium gap-2">
          <div>Page</div>
          <Input value={pageTable} onChange={(e) => setPageTable(e.target.value)} className="h-8 w-10 text-center px-2" type="text" placeholder="0" />
          <div>of 10</div>
        </div>
        <div className="flex items-center gap-2 ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={true}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            disabled={true}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            disabled={false}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            disabled={false}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}