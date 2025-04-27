import { Input } from "@/components/ui/input"
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
  perPage: number;
  pageTable: number;
  totalPage: number;
  totalCount: number;
  setPerPage: Dispatch<SetStateAction<number>>;
  setPageTable: Dispatch<SetStateAction<number>>;
  fatchData?: (page?: number, countPage?: number) => Promise<void>;

  inputPage: string;
  setInputPage: Dispatch<SetStateAction<string>>;
}

export default function TablePagination({
  perPage,
  pageTable,
  totalPage,
  totalCount,
  setPerPage,
  setPageTable,
  fatchData,

  inputPage,
  setInputPage,
}: TablePaginationProps) {
  const changePaginate = async (page: number, countPage?: number) => {
    if (fatchData) {
      setPageTable(page);
      await fatchData(page, countPage);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm flex">
        <div className="items-center gap-2 flex">
          <span className="text-sm">
            Show
          </span>
          <Select value={perPage.toString()} onValueChange={(val) => {
            setPerPage(parseInt(val));
            changePaginate(1, parseInt(val));
          }}>
            <SelectTrigger className="gap-x-1 px-2.5" size="sm">
              <SelectValue placeholder="Select a rows" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 25].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="hidden text-sm lg:block">
            rows of {totalCount} entries
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6 w-fit">
        <div className="flex items-center text-sm gap-2">
          <div>Page</div>
          <Input value={inputPage}
            onChange={(e) => {
              setInputPage(e.target.value);
              if (e.target.value.trim() != "" && !isNaN(parseInt(e.target.value))){
                let numPage = parseInt(e.target.value);
                if(numPage > totalPage) numPage = totalPage;
                else if(numPage < 1) numPage = 1;
                changePaginate(numPage);
              }
            }}
            onBlur={(e) => {
              if(e.target.value.trim() === "" || isNaN(parseInt(e.target.value))){
                setInputPage(pageTable.toString());
              }
            }}
            className="h-8 w-10 text-center px-1.5 input-no-spinner" type="number" min={1} max={totalPage}
          />
          <div><span className="pe-1">of</span> {totalPage}</div>
        </div>

        <div className="flex items-center gap-2 ml-0">
          <Button
            type="button"
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={pageTable <= 1}
            onClick={() => {
              if (pageTable >= 1) changePaginate(1);
            }}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="size-8"
            size="icon"
            disabled={pageTable <= 1}
            onClick={() => {
              if (pageTable >= 1) changePaginate(pageTable - 1)
            }}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="size-8"
            size="icon"
            disabled={pageTable >= totalPage}
            onClick={() => {
              if (pageTable <= totalPage) changePaginate(pageTable + 1)
            }}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            disabled={pageTable >= totalPage}
            onClick={() => {
              if (pageTable <= totalPage) changePaginate(totalPage)
            }}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}