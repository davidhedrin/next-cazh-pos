"use client"

import { useLoading } from '@/components/loading-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import TableTopToolbar from "@/components/table-top-toolbar";
import TablePagination from "@/components/table-pagination";
import { TableThModel, TableShortList } from "@/lib/models-type";
import BreadcrumbListing from "@/components/breadcrumb-list";

import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils";
import { GetData } from "@/app/api/roles-permission/action";
import { Roles } from "@prisma/client";
import { toast } from "sonner";

import Modal from "@/components/modal-dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RolesPermission() {
  const { setLoading } = useLoading();
  const listBreadcrumb = [
    { name: "System Config" },
    { name: "Roles & Permissions", url: "/system-config/roles-permission" }
  ];

  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { key: "name", name: "Name", IsVisible: true },
    { key: "slug_name", name: "Code", IsVisible: true },
    { key: "is_active", name: "Status", IsVisible: true },
    { key: "createdBy", name: "Created By", IsVisible: true },
    { key: "createdAt", name: "Created At", IsVisible: true },
  ]);
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<Roles[] | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const fatchDataUser = async (page: number = pageTable, countPage: number = perPage) => {
    setLoading(true);
    const selectObj = Object.fromEntries(tblThColomns.filter(col => col.IsVisible).map(col => [col.key, true]));
    const orderObj = tblSortList.filter(col => col.sort && col.sort.trim() !== "").map(col => ({ [col.key as string]: col.sort }));

    try {
      const result = await GetData({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { name: { contains: inputSearch.trim(), mode: "insensitive" } },
            { slug: { contains: inputSearch.trim(), mode: "insensitive" } }
          ]
        },
        select: {
          id: true,
          ...selectObj
        },
        orderBy: orderObj
      });
      setTotalPage(result.meta.totalPages);
      setTotalCount(result.meta.total);
      setPageTable(result.meta.page);
      setInputPage(result.meta.page.toString());

      setDatas(result.data);
    } catch (error: any) {
      toast.warning("Something's gone wrong!", {
        description: "We can't proccess your request, Please try again.",
        richColors: true
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isFirstRender) return;
    if (tblSortList.length === 0) fatchDataUser();
  }, [tblSortList]);
  useEffect(() => {
    if (isFirstRender) return;
    fatchDataUser(1);
  }, [tblThColomns]);
  useEffect(() => {
    if (isFirstRender) return;
    const timer = setTimeout(() => {
      fatchDataUser(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputSearch]);

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    setIsFirstRender(false);
    fatchDataUser();
  }, []);

  return (
    <>
      <BreadcrumbListing listBc={listBreadcrumb} />

      <TableTopToolbar
        tblName="Role List"
        inputSearch={inputSearch}
        tblSortList={tblSortList}
        thColomn={tblThColomns}
        setTblThColomns={setTblThColomns}
        setTblSortList={setTblSortList}
        setInputSearch={setInputSearch}
        fatchData={() => fatchDataUser(pageTable)}

        DialogAdd={ModalAddEdit}
      />
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>#</TableHead>
              {
                tblThColomns.map((x, i) => {
                  if (x.IsVisible) return <TableHead key={x.key}>{x.name}</TableHead>
                })

              }
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              datas != null && datas?.length > 0 ? datas.map((data, i) => (
                <TableRow key={data.id}>
                  <TableCell>{(pageTable - 1) * perPage + i + 1}</TableCell>
                  {data.name && <TableCell>{data.name}</TableCell>}
                  {data.slug_name && <TableCell>{data.slug_name}</TableCell>}
                  {data.is_active && <TableCell><Badge className={`${data.is_active ? "success" : "secondary"}`}>{data.is_active ? "Active" : "Inactive"}</Badge></TableCell>}
                  {data.createdBy && <TableCell>{data.createdBy}</TableCell>}
                  {data.createdAt && <TableCell>{data.createdAt && formatDate(data.createdAt, "medium")}</TableCell>}
                  <TableCell className="text-right space-x-1">
                    <i className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
                    <i className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>
                  </TableCell>
                </TableRow>
              )) : <TableRow>
                <TableCell className="text-center" colSpan={tblThColomns.length + 1}><i>No data found!</i></TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>
      <TablePagination
        perPage={perPage}
        pageTable={pageTable}
        totalPage={totalPage}
        totalCount={totalCount}
        setPerPage={setPerPage}
        setPageTable={setPageTable}
        fatchData={fatchDataUser}

        inputPage={inputPage}
        setInputPage={setInputPage}
      />
    </>
  )
}

function ModalAddEdit() {
  return (
    <Modal className="sm:max-w-2xl"
      title="Add Role & Permission"
      description="Here to add new access role & permission"
      btnOpen={
        <Button variant="outline" size="sm">
          <i className='bx bx-plus-circle text-lg'></i> New
        </Button>
      }
    >
      <div className='grid grid-cols-12 gap-3'>
        <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
          <Label htmlFor="email">Code</Label>
          <div>
            <Input id="email" name="email" type="text" placeholder="Enter unique role code" />
            {/* {stateForm.errors?.email && <ZodErrors err={stateForm.errors?.email} />} */}
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
          <Label htmlFor="email">Status</Label>
          <div>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">Active</SelectItem>
                  <SelectItem value="banana">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* {stateForm.errors?.email && <ZodErrors err={stateForm.errors?.email} />} */}
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 grid gap-2">
          <Label htmlFor="email">Name</Label>
          <div>
            <Input id="email" name="email" type="text" placeholder="Enter role name" />
            {/* {stateForm.errors?.email && <ZodErrors err={stateForm.errors?.email} />} */}
          </div>
        </div>
      </div>
    </Modal>
  )
}