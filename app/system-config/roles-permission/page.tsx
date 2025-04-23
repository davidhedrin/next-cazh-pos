"use client"

import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import TableTopToolbar from "@/components/table-top-toolbar";
import TablePagination from "@/components/table-pagination";
import { TableThModel, TableShortList } from "@/lib/models-type";
import BreadcrumbListing from "@/components/breadcrumb-list";

import { GetData } from "@/app/api/roles-permission/action";
import { Roles } from "@prisma/client";
import Loading from "@/components/loading";

export default function RolesPermission() {
  const listBreadcrumb = [
    { name: "System Config" },
    { name: "Roles & Permissions", url: "/system-config/roles-permission" }
  ];
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { key: "name", name: "Name", IsVisible: true },
    { key: "slug", name: "Code", IsVisible: true },
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
  const [fatchLoading, setFatchLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      fatchDataUser(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputSearch]);
  useEffect(() => {
    fatchDataUser(1)
  }, [tblThColomns]);

  const fatchDataUser = async (page: number = pageTable, countPage: number = perPage) => {
    setFatchLoading(true);
    const selectObj = Object.fromEntries(tblThColomns.filter(col => col.IsVisible).map(col => [col.key, true]));

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
      }
    });
    setTotalPage(result.meta.totalPages);
    setTotalCount(result.meta.total);
    setPageTable(result.meta.page);
    setInputPage(result.meta.page.toString());

    setDatas(result.data);
    setFatchLoading(false);
  };

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
      />
      {fatchLoading && <Loading />}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>#</TableHead>
              {
                tblThColomns.map((x, i) => {
                  if(x.IsVisible) return <TableHead key={x.key}>{x.name}</TableHead>
                })
              }
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              datas != null && datas?.length > 0 ? datas.map((data, i) => (
                <TableRow key={data.id}>
                  <TableCell>{(pageTable - 1) * perPage + i + 1}</TableCell>
                  {data.name && <TableCell>{data.name}</TableCell>}
                  {data.slug && <TableCell>{data.slug}</TableCell>}
                  {data.is_active && <TableCell><Badge className={`${data.is_active ? "success" : "secondary"}`}>{data.is_active ? "Active" : "Inactive"}</Badge></TableCell>}
                  {data.createdBy && <TableCell>{data.createdBy}</TableCell>}
                  {data.createdAt && <TableCell>{data.createdAt && formatDate(data.createdAt, "medium")}</TableCell>}
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
