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
import { TableThModel } from "@/lib/models-type";
import BreadcrumbListing from "@/components/breadcrumb-list";

import { GetData } from "@/app/api/roles-permission/action";
import { Roles } from "@prisma/client";
import Loading from "@/components/loading";

export default function RolesPermission() {
  const [fatchLoading, setFatchLoading] = useState(true);
  const [pageTable, setPageTable] = useState("1");
  const [perPage, setPerPage] = useState("10");
  const [totalPage, setTotalPage] = useState(0);
  const tblThColomns: TableThModel[] = [
    { key: "name", name: "Name"},
    { key: "slug", name: "Code"},
    { key: "is_active", name: "Status"},
    { key: "createdBy", name: "Created By"},
    { key: "createdAt", name: "Created At"},
  ];

  const [datas, setDatas] = useState<Roles[] | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      await fatchDataUser();
    };
    fetchData();
  }, []);

  const fatchDataUser = async () => {
    setFatchLoading(true);
    const result = await GetData({
      curPage: parseInt(pageTable),
      perPage: parseInt(perPage)
    });
    console.log(result);
    setTotalPage(result.meta.totalPages)
    setDatas(result.data);
    setFatchLoading(false);
  }

  const listBreadcrumb = [
    {name: "System Config"},
    {name: "Roles & Permissions", url: "/system-config/roles-permission"}
  ];
  
  return (
    <>
      <BreadcrumbListing listBc={listBreadcrumb} />

      <TableTopToolbar thColomn={tblThColomns} fatchData={fatchDataUser} />
      {
        fatchLoading && <Loading />
      }
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>#</TableHead>
              {
                tblThColomns.map((x, i) => {
                  return <TableHead key={x.key}>{x.name}</TableHead>
                })
              }
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              datas!= null && datas?.length > 0 ? datas.map((data, i) => (
                <TableRow key={data.id}>
                  <TableCell>{(parseInt(pageTable) - 1) * parseInt(perPage) + i + 1}</TableCell>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.slug}</TableCell>
                  <TableCell><Badge className={`${data.is_active ? "success" : "secondary"}`}>{data.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell>{data.createdBy}</TableCell>
                  <TableCell>{data.createdAt && formatDate(data.createdAt, "medium")}</TableCell>
                </TableRow>
              )) : <TableRow>
                <TableCell className="text-center" colSpan={tblThColomns.length + 1}><i>No data found!</i></TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>
      <TablePagination perPage={perPage} pageTable={pageTable} setPerPage={setPerPage} setPageTable={setPageTable} />
    </>
  )
}
