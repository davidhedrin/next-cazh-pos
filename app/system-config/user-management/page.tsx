"use client";
import { useRole } from '@/contexts/role-context';

import { GetDataUsers } from '@/app/api/system-config/action';
import { UseAlertDialog } from '@/components/alert-confirm';
import BreadcrumbListing from '@/components/breadcrumb-list';
import { useLoading } from '@/contexts/loading-context';
import TablePagination from '@/components/table-pagination';
import TableTopToolbar from '@/components/table-top-toolbar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableShortList, TableThModel } from '@/lib/models-type';
import { formatDate, normalizeSelectObj, sortListToOrderBy } from '@/lib/utils';
import { Account, RoleMenus, Roles, User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

export default function UserList() {
  const { roleMenus } = useRole();
  const { setLoading } = useLoading();
  const { openAlert } = UseAlertDialog();

  const listBreadcrumb = [
    { name: "System Config" },
    { name: "User Management", url: "/system-config/user-management" }
  ];

  // Start Master
  const [accessPage, setAccessPage] = useState<RoleMenus>();
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<(User & { account: Account | null, role: Roles | null })[] | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Email", key: "email", key_sort: "email", IsVisible: true },
    { name: "Fullname", key: "account[fullname,no_phone]", key_sort: "account.fullname", IsVisible: true },
    { name: "Status", key: "is_active", key_sort: "is_active", IsVisible: true },
    { name: "Role", key: "role[name]", key_sort: "role.name", IsVisible: true },
    { name: "Created At", key: "createdAt", key_sort: "createdAt", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const result = await GetDataUsers({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { email: { contains: inputSearch.trim(), mode: "insensitive" } },
            {
              account: {
                OR: [
                  { fullname: { contains: inputSearch.trim(), mode: "insensitive" } }
                ]
              }
            }
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
      console.log(result.data);

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
    setLoading(true);
    const firstInit = async () => {
      await fatchDatas();
      setIsFirstRender(false);
      setLoading(false);
    };
    if (roleMenus != undefined && roleMenus.length > 0) {
      const permission = roleMenus.find((rm) => rm.menu_slug === "usm-usl");
      if (!permission) redirect('/access-denied');

      setAccessPage(permission);
      firstInit();
    }
  }, [roleMenus]);

  return (
    <>
      <BreadcrumbListing listBc={listBreadcrumb} />

      <TableTopToolbar
        tblName="User List"
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
              {(accessPage?.update == true || accessPage?.delete == true) && <TableHead className="text-right">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              datas != null && datas?.length > 0 ? datas.map((data, i) => (
                <TableRow key={data.id}>
                  <TableCell>{(pageTable - 1) * perPage + i + 1}</TableCell>

                  {'email' in data && <TableCell>{data.email}</TableCell>}
                  {'account' in data && <TableCell>{data.account ? data.account.fullname : "-"}</TableCell>}
                  {'is_active' in data && (
                    <TableCell>
                      <Badge className={`${data.is_active === true ? "success" : "secondary"}`}>
                        {data.is_active === true ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  )}
                  {'role' in data && <TableCell>{data.role ? data.role.name : "-"}</TableCell>}
                  {'createdAt' in data && (<TableCell>{data.createdAt ? formatDate(data.createdAt, "medium") : "-"}</TableCell>)}

                  {
                    (accessPage && accessPage?.update == true || accessPage?.delete == true) && <TableCell className="text-right space-x-1">
                      {
                        accessPage.update == true && <i className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
                      }
                      {
                        accessPage.delete == true && <i className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>
                      }
                    </TableCell>
                  }
                </TableRow>
              )) : <TableRow>
                <TableCell className="text-center" colSpan={tblThColomns.length + 3}><i>No data found!</i></TableCell>
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
