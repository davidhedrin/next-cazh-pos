import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import React, { Dispatch, SetStateAction } from "react"
import { DatePickerWithRange } from '@/components/date-range-picker';

import { TableShortList, TableThModel } from "@/lib/models-type";
import { Check, ChevronsUpDown, Settings2 } from "lucide-react";
import { cn, removeListStateByIndex } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { DateRange } from "react-day-picker";

type TableTopToolbarProps = {
  tblName?: string;
  tblDesc?: string;
  thColomn?: TableThModel[];
  tblSortList?: TableShortList[];
  inputSearch?: string;
  setTblThColomns?: React.Dispatch<React.SetStateAction<TableThModel[]>>;
  setTblSortList?: Dispatch<SetStateAction<TableShortList[]>>
  setInputSearch?: Dispatch<SetStateAction<string>>;
  fatchData?: (page?: number) => Promise<void>;

  openModal?: (id?: number) => Promise<void>;
  dateRange?: DateRange | undefined;
  setDateRange?: (date: DateRange | undefined) => void;
};

export default function TableTopToolbar({
  tblName,
  tblDesc,
  thColomn,
  tblSortList,
  inputSearch,
  setTblThColomns,
  setTblSortList,
  setInputSearch,
  fatchData,

  openModal,
  dateRange,
  setDateRange,
}: TableTopToolbarProps) {
  const addSort = () => {
    const newRow: TableShortList = { key: "", sort: "" };
    setTblSortList && setTblSortList(prev => [...prev, newRow]);
  };

  const updateSortField = (idx: number, field: keyof TableShortList, value: string) => {
    setTblSortList && setTblSortList(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    )
  };

  // *** Example Date Range ***
  // const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
  //   from: startOfMonth(new Date()),
  //   to: endOfMonth(new Date()),
  // });

  return (
    <div>
      {
        tblName != null || tblDesc != null ? (
          <>
            <div className="font-medium">{tblName}</div>
            <p className="text-sm text-muted-foreground">{tblDesc}</p>
            <hr className="mb-2.5 mt-0.5" />
          </>
        ) : <></>
      }
      <div className="flex flex-col w-full lg:flex-row lg:items-center lg:justify-between gap-2">
        <div className="flex items-center gap-2">
          {
            setInputSearch && <Command className="border border-b-0">
              <CommandInput
                value={inputSearch}
                onValueChange={(val) => setInputSearch(val)}
                onClear={() => setInputSearch("")}
                showClear={!!inputSearch}
                className="h-8 lg:w-64"
                placeholder="Type to search..."
              />
            </Command>
          }
          {
            openModal && <Button type="button" onClick={() => openModal()} variant="outline" size="sm">
              <i className='bx bx-plus-circle text-lg'></i> New
            </Button>
          }
        </div>

        <div className="flex items-center gap-2 justify-end">
          {
            dateRange && setDateRange && (
              <div className="w-full">
                <DatePickerWithRange dateVal={dateRange} setDateVal={setDateRange} />
              </div>
            )
          }

          {
            setTblSortList && <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <i className='bx bx-sort'></i> <span className="ml-auto hidden lg:flex">Sort</span>
                  {tblSortList && tblSortList.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="h-[16px] rounded-[3.2px] px-[3.5px] font-mono font-normal text-[10.4px]"
                    >
                      {tblSortList.length}
                    </Badge>
                  )}
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
                            <SelectTrigger className="min-w-[160px] max-w-[160px]" size="sm">
                              <SelectValue placeholder="Select a colomn" />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                thColomn?.filter(x => x.IsVisible && x.key_sort.trim() != "").map(y => {
                                  return <SelectItem key={i + y.key} value={y.key_sort}>{y.name}</SelectItem>
                                })
                              }
                            </SelectContent>
                          </Select>
                          <Select value={x.sort} onValueChange={(val) => updateSortField(i, "sort", val)}>
                            <SelectTrigger className="min-w-[80px] max-w-[80px]" size="sm">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asc">Asc</SelectItem>
                              <SelectItem value="desc">Desc</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button type="button" onClick={() => {
                            setTblSortList(prev => removeListStateByIndex(prev ?? [], i))
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
                    <Button type="button" onClick={addSort} size="sm" className="rounded h-7">
                      Add
                    </Button>
                    <Button type="button" onClick={() => setTblSortList([])} variant="outline" size="sm" className="rounded h-7">
                      Reset
                    </Button>
                  </div>

                  <Button type="button" onClick={() => fatchData && fatchData()} size="sm" className="rounded primary h-7">
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          }

          {
            setTblThColomns && <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  aria-label="Toggle columns"
                  role="combobox"
                  variant="outline"
                  size="sm"
                >
                  <Settings2 />
                  <span className="ml-auto hidden lg:flex">
                    View
                  </span>
                  <ChevronsUpDown className="ml-auto opacity-50 hidden lg:flex" />
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
                              setTblThColomns((prev) =>
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
          }

          {
            fatchData && <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="outline" size="sm" onClick={() => fatchData()}>
                    <i className='bx bx-refresh text-lg'></i>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh to fatch data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
        </div>
      </div>
    </div>
  )
}
