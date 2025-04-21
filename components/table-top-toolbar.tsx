import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { TableThModel } from "@/lib/models-type";

type TableTopToolbarProps = {
  tblName?: string;
  thColomn?: TableThModel[];
  fatchData?: () => void;
};

export default function TableTopToolbar({ tblName, thColomn, fatchData }: TableTopToolbarProps) {
  return (
    <div>
      {
        tblName != null ? (
          <>
            <div className="font-medium">{tblName}</div>
            <hr className="mb-2.5 mt-0.5" />
          </>
        ) : <></>
      }
      <div className="flex flex-col w-full sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input className="h-8 lg:w-56" type="text" placeholder="Search here..." />
          <Button variant="outline" size="sm">
            <i className='bx bx-plus-circle text-lg'></i> New
          </Button>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <i className='bx bx-sort'></i> Sort
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-full max-w-[var(--radix-popover-content-available-width)] origin-[var(--radix-popover-content-transform-origin)] flex-col gap-2 p-4" align="end">
              <div className="flex flex-col gap-1">
                <h4 className="font-medium leading-none">Sort by</h4>
                <p className="text-muted-foreground text-sm m-0">
                  Select colomn for modify sorting your rows.
                </p>
              </div>
              {
                thColomn && thColomn?.length > 0 ? (
                  <div className="flex gap-2 overflow-y-auto">
                    <Select>
                      <SelectTrigger className="w-[140px]" size="sm">
                        <SelectValue placeholder="Select a colomn" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          thColomn?.map(x => {
                            return <SelectItem key={x.key} value={x.key}>{x.name}</SelectItem>
                          })
                        }
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="Sort type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Asc</SelectItem>
                        <SelectItem value="desc">Desc</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <i className='bx bx-refresh text-lg'></i>
                    </Button>
                  </div>
                ) : <p className="text-muted-foreground text-sm m-0 italic">
                  Info: No columns to sort or filter!
                </p>
              }
            </PopoverContent>
          </Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={fatchData}>
                  <i className='bx bx-refresh text-lg'></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh to fatch data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
