"use client";

import { GetDataUsers } from '@/app/api/system-config/action';
import { UseAlertDialog } from '@/components/alert-confirm';
import BreadcrumbListing from '@/components/breadcrumb-list';
import { useLoading } from '@/components/loading-context';
import TablePagination from '@/components/table-pagination';
import TableTopToolbar from '@/components/table-top-toolbar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableShortList, TableThModel } from '@/lib/models-type';
import { formatDate } from '@/lib/utils';
import { User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UserList() {
  const { setLoading } = useLoading();
  const { openAlert } = UseAlertDialog();

  const listBreadcrumb = [
    { name: "System Config" },
    { name: "User Management", url: "/system-config/user-management" }
  ];

  // Start Master
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<User[] | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { key: "email", name: "Email", IsVisible: true },
    { key: "accounts", name: "Account", IsVisible: true },
    { key: "is_active", name: "Status", IsVisible: true },
    { key: "role", name: "Role", IsVisible: true },
    { key: "createdAt", name: "Created At", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = Object.fromEntries(tblThColomns.filter(col => col.IsVisible).map(col => [col.key, true]));
    const orderObj = tblSortList.filter(col => col.sort && col.sort.trim() !== "").map(col => ({ [col.key as string]: col.sort }));

    try {
      const result = await GetDataUsers({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { email: { contains: inputSearch.trim(), mode: "insensitive" } },
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
      });
    }
  };

  useEffect(() => {
    if (isFirstRender) return;
    if (tblSortList.length === 0) fatchDatas();
  }, [tblSortList]);
  useEffect(() => {
    if (isFirstRender) return;
    fatchDatas(1);
  }, [tblThColomns]);
  useEffect(() => {
    if (isFirstRender) return;
    const timer = setTimeout(() => {
      fatchDatas(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearch]);

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    const firstInit = async () => {
      setLoading(true);
      await fatchDatas();
      setIsFirstRender(false);
      setLoading(false);
    };
    firstInit();
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
        fatchData={() => fatchDatas(pageTable)}

        // openModal={() => openModalAddEdit()}
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
                  {data.email && <TableCell>{data.email}</TableCell>}
                  <TableCell>account</TableCell>
                  {data.is_active != null && <TableCell><Badge className={`${data.is_active == true ? "success" : "secondary"}`}>{data.is_active == true ? "Active" : "Inactive"}</Badge></TableCell>}
                  <TableCell>roles</TableCell>
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
        fatchData={fatchDatas}

        inputPage={inputPage}
        setInputPage={setInputPage}
      />
    </>
  )
}
