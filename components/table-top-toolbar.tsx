import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dispatch, SetStateAction } from "react"

import { TableShortList, TableThModel } from "@/lib/models-type";
import { Check, ChevronsUpDown, Settings2 } from "lucide-react";
import { cn, removeListStateByIndex } from "@/lib/utils";

type TableTopToolbarProps = {
  tblName?: string;
  thColomn?: TableThModel[];
  tblSortList?: TableShortList[];
  inputSearch?: string;
  setTblThColomns?: React.Dispatch<React.SetStateAction<TableThModel[]>>;
  setTblSortList?: Dispatch<SetStateAction<TableShortList[]>>
  setInputSearch?: Dispatch<SetStateAction<string>>;
  fatchData?: (page?: number) => Promise<void>;
};

export default function TableTopToolbar({ 
  tblName,
  thColomn,
  tblSortList,
  inputSearch,
  setTblThColomns,
  setTblSortList,
  setInputSearch,
  fatchData 
}: TableTopToolbarProps) {
  const addSort = () => {
    console.log("addSort");
    const newRow: TableShortList = {key: "", sort: ""};
    setTblSortList && setTblSortList(prev => [...prev, newRow]);
  };
  const updateSortField = (idx: number, field: keyof TableShortList, value: string) => {
    setTblSortList && setTblSortList(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    )
  }

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
          <Command className="border border-b-0">
            <CommandInput
              value={inputSearch}
              onValueChange={(val) => setInputSearch && setInputSearch(val)}
              onClear={() => setInputSearch && setInputSearch("")}
              showClear={!!inputSearch}
              className="h-8 lg:w-64"
              placeholder="Type to search..."
            />
          </Command>
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
                tblSortList && tblSortList.length > 0 && tblSortList.map((x, i) => {
                  return (
                    thColomn && thColomn?.length > 0 && (
                      <div key={i} className="flex gap-2 overflow-y-auto">
                        <Select value={x.key} onValueChange={(val) => updateSortField(i, "key", val)}>
                          <SelectTrigger className="w-[140px]" size="sm">
                            <SelectValue placeholder="Select a colomn" />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              thColomn?.map(y => {
                                return <SelectItem key={i + y.key} value={y.key}>{y.name}</SelectItem>
                              })
                            }
                          </SelectContent>
                        </Select>
                        <Select value={x.sort} onValueChange={(val) => updateSortField(i, "sort", val)}>
                          <SelectTrigger size="sm">
                            <SelectValue placeholder="Sort type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asc">Asc</SelectItem>
                            <SelectItem value="desc">Desc</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={() => {
                          setTblSortList && setTblSortList(prev => removeListStateByIndex(prev ?? [], i))
                        }} variant="outline" size="sm">
                          <i className='bx bx-trash text-lg'></i>
                        </Button>
                      </div>
                    )
                  )
                })
              }
              <div className="flex items-center justify-between mt-1">
                <div className="flex w-full items-center gap-2">
                  <Button onClick={addSort} size="sm" className="rounded h-7">
                    Add
                  </Button>
                  <Button onClick={() => setTblSortList && setTblSortList([])} variant="outline" size="sm" className="rounded h-7">
                    Reset
                  </Button>
                </div>
                
                <Button onClick={addSort} size="sm" className="rounded primary h-7">
                    Done
                  </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                aria-label="Toggle columns"
                role="combobox"
                variant="outline"
                size="sm"
                className="ml-auto hidden h-8 lg:flex"
              >
                <Settings2 />
                View
                <ChevronsUpDown className="ml-auto opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-0">
              <Command>
                <CommandInput placeholder="Search columns..." />
                <CommandList>
                  <CommandEmpty><i>No columns found.</i></CommandEmpty>
                  <CommandGroup>
                    {
                      thColomn?.map(x => {
                        return <CommandItem key={x.key}
                          onSelect={() => {
                            setTblThColomns && setTblThColomns((prev) =>
                              prev.map((col) => col.key === x.key ? { ...col, IsVisible: !col.IsVisible } : col)
                            )
                          }}>
                          <span className="truncate">{x.name}</span>
                          <Check
                            className={cn(
                              "ml-auto size-4 shrink-0",
                              x.IsVisible ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      })
                    }
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={async () => {
                  if (fatchData) await fatchData();
                }}>
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
