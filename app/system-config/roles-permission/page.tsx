"use client"
import { useRole } from '@/contexts/role-context';

import { useLoading } from '@/contexts/loading-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import TableTopToolbar from "@/components/table-top-toolbar";
import TablePagination from "@/components/table-pagination";
import { TableThModel, TableShortList, FormState } from "@/lib/models-type";
import BreadcrumbListing from "@/components/breadcrumb-list";
import { UseAlertDialog } from "@/components/alert-confirm";

import { Badge } from "@/components/ui/badge"
import { formatDate, normalizeSelectObj, SonnerPromise, sortListToOrderBy } from "@/lib/utils";
import { GetDataRoles, StoreDataRoles, DeleteDataRole, GetDataRoleById } from "@/app/api/system-config/action";
import { RoleMenus, Roles } from "@prisma/client";
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GetDataMenus } from '@/app/api/action';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DialogFooter } from '@/components/ui/dialog';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { z } from 'zod';
import { ZodErrors } from '@/components/zod-errors';
import { DtoRoles, DtoModuleAccess } from '@/prisma/DTO/roles';
import { redirect } from 'next/navigation';

export default function RolesPermission() {
  const { roleMenus } = useRole();
  const { setLoading } = useLoading();
  const { openAlert } = UseAlertDialog();

  const listBreadcrumb = [
    { name: "System Config" },
    { name: "Roles & Permissions", url: "/system-config/roles-permission" }
  ];

  // Start Master
  const [accessPage, setAccessPage] = useState<RoleMenus>();
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<Roles[] | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Name", key: "name", key_sort: "name", IsVisible: true },
    { name: "Code", key: "slug_name", key_sort: "slug_name", IsVisible: true },
    { name: "Status", key: "is_active", key_sort: "is_active", IsVisible: true },
    { name: "Created By", key: "createdBy", key_sort: "createdBy", IsVisible: true },
    { name: "Created At", key: "createdAt", key_sort: "createdAt", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const result = await GetDataRoles({
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
          is_delete: true,
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
    setLoading(true);
    const firstInit = async () => {
      await fatchDatas();
      setIsFirstRender(false);
      setLoading(false);
    };
    if (roleMenus != undefined && roleMenus.length > 0) {
      const permission = roleMenus.find((rm) => rm.menu_slug === "usm-rnp");
      if(!permission) redirect('/access-denied');

      setAccessPage(permission);
      firstInit();
    }
  }, [roleMenus]);
  // End Master

  const deleteRow = async (id: number) => {
    const confirmed = await openAlert({
      title: 'Delete Confirmation!',
      description: 'Are your sure want to delete this record? You will not abel to undo this action!',
      textConfirm: 'Yes, Delete',
      textClose: 'No, Keep It',
      icon: 'bx bx-trash bx-tada text-red-500'
    });
    if (!confirmed) return;

    const sonnerSubmit = SonnerPromise("Deleting proccess...", "Please wait, deletion data is in progress!");
    try {
      await DeleteDataRole(id);
      await fatchDatas();
      toast.success("Deletion Complete!", {
        description: "The selected data has been removed successfully!",
      });
    } catch (error: any) {
      toast.warning("Something's gone wrong!", {
        description: "We can't proccess your request, Please try again.",
      });
    }
    toast.dismiss(sonnerSubmit);
  };

  // Modal Add & Edit
  const [inputPageAddEdit, setInputPageAddEdit] = useState("1");
  const [pageTableAddEdit, setPageTableAddEdit] = useState(1);
  const [perPageAddEdit, setPerPageAddEdit] = useState(5);
  const [totalPageAddEdit, setTotalPageAddEdit] = useState(0);
  const [totalCountAddEdit, setTotalCountAddEdit] = useState(0);
  const [datasAddEdit, setDatasAddEdit] = useState<DtoModuleAccess[]>([]);
  const [inputSearchAddEdit, setInputSearchAddEdit] = useState("");
  const [tblSortListAddEdit, setTblSortListAddEdit] = useState<TableShortList[]>([]);
  const [tblThColomnsAddEdit, setTblThColomnsAddEdit] = useState<TableThModel[]>([
    { name: "Name", key: "name", key_sort: "name", IsVisible: true },
    { name: "Code", key: "slug", key_sort: "slug", IsVisible: false },
    { name: "Status", key: "is_active", key_sort: "is_active", IsVisible: false },
  ]);
  const fatchDatasAddEdit = async (page: number = pageTableAddEdit, countPage: number = perPageAddEdit, menuStroes: DtoModuleAccess[] = dataStoreAddEdit) => {
    const selectObj = normalizeSelectObj(tblThColomnsAddEdit);
    const orderObj = sortListToOrderBy(tblSortListAddEdit)

    try {
      const result = await GetDataMenus({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { name: { contains: inputSearchAddEdit.trim(), mode: "insensitive" } },
            { slug: { contains: inputSearchAddEdit.trim(), mode: "insensitive" } }
          ]
        },
        orderBy: orderObj,
        select: {
          id: true,
          slug: true,
          ...selectObj
        },
      });
      setTotalPageAddEdit(result.meta.totalPages);
      setTotalCountAddEdit(result.meta.total);
      setPageTableAddEdit(result.meta.page);
      setInputPageAddEdit(result.meta.page.toString());
      
      setDatasAddEdit(result.data.map(x => {
        const findInStore = menuStroes.find(y => y.menu_id === x.id);
        return {
          id: findInStore?.id,
          menu_id: x.id,
          menu_slug: x.slug,
          menu_name: x.name,
          read: findInStore?.read ?? false,
          create: findInStore?.create ?? false,
          update: findInStore?.update ?? false,
          delete: findInStore?.delete ?? false,
          is_selected: findInStore?.is_selected ?? false,
        };
      }));
    } catch (error: any) {
      toast.warning("Something's gone wrong!", {
        description: "We can't proccess your request, Please try again.",
      });
    }
  };

  useEffect(() => {
    if (isFirstRender) return;
    if (tblSortListAddEdit.length === 0) fatchDatasAddEdit();
  }, [tblSortListAddEdit]);
  useEffect(() => {
    if (isFirstRender) return;
    fatchDatasAddEdit(1);
  }, [tblThColomnsAddEdit]);
  useEffect(() => {
    if (isFirstRender) return;
    const timer = setTimeout(() => {
      fatchDatasAddEdit(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearchAddEdit]);

  const toggleCheckboxAddEdit = (index: number, field: keyof DtoModuleAccess, value: boolean) => {
    if (datasAddEdit === null) return;
    const updated = [...datasAddEdit];
    var dataUpdate: DtoModuleAccess = {
      ...updated[index],
      [field]: value,
    };

    if (field === "is_selected") {
      if (value === false) {
        dataUpdate.read = false;
        dataUpdate.create = false;
        dataUpdate.update = false;
        dataUpdate.delete = false;

        setDataStoreAddEdit(prev => prev.filter(x => x.menu_id !== dataUpdate.menu_id));
      } else {
        setDataStoreAddEdit(prev => {
          const exists = prev.find(x => x.menu_id === dataUpdate.menu_id);
          if (exists) return prev;
          dataUpdate.read = true;
          return [...prev, dataUpdate];
        });
      };
    } else {
      setDataStoreAddEdit(prev =>
        prev.map(x => x.menu_id === dataUpdate.menu_id ? { ...x, [field]: value } : x)
      );
    };

    updated[index] = dataUpdate;
    setDatasAddEdit(updated);
  };

  const [stateFormAddEdit, setStateFormAddEdit] = useState<FormState>({ success: false, errors: {} });
  const FormSchemaAddEdit = z.object({
    slug: z.string().min(1, { message: 'Slug is required field.' }).trim(),
    is_active: z.string().min(1, { message: 'Status is required field.' }).trim(),
    name: z.string().min(1, { message: 'Name is required field.' }).trim(),
  });

  const [dataStoreAddEdit, setDataStoreAddEdit] = useState<DtoModuleAccess[]>([]);
  const [addEditId, setAddEditId] = useState<number | null>(null);
  const [txtSlug, setTxtSlug] = useState("");
  const [isActive, setIsActive] = useState<string>();
  const [txtName, setTxtName] = useState("");
  const createDtoData = (): DtoRoles => {
    const newData: DtoRoles = {
      id: addEditId,
      slug_name: txtSlug,
      name: txtName,
      is_active: isActive === "true" ? true : false,
      role_menus: dataStoreAddEdit
    };
    return newData;
  }

  const handleFormSubmitAddEdit = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const valResult = FormSchemaAddEdit.safeParse(data);
    if (!valResult.success) {
      setStateFormAddEdit({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateFormAddEdit({ success: true, errors: {} });

    setOpenModal(false);
    setTimeout(async () => {
      const confirmed = await openAlert({
        title: 'Submit Confirmation!',
        description: 'Are you sure you want to submit this form? Please double-check before proceeding!',
        textConfirm: 'Yes, Submit',
        textClose: 'No, Go Back',
        icon: 'bx bx-error bx-tada text-blue-500'
      });
      if (!confirmed) {
        setOpenModal(true);
        return;
      }

      const sonnerSubmit = SonnerPromise("Submiting proccess...", "Please wait, trying to submit you request!");
      try {
        await StoreDataRoles(createDtoData());
        await fatchDatas();
        toast.success("Submit successfully!", {
          description: "Your submission has been successfully completed!",
        });

        setOpenModal(false);
        setDataStoreAddEdit([]);
      } catch (error: any) {
        toast.warning("Request Failed!", {
          description: error.message,
        });
      }
      toast.dismiss(sonnerSubmit);
    }, 100);
  };

  const [openModal, setOpenModal] = useState(false);
  const openModalAddEdit = async (id?: number) => {
    const openSonner = SonnerPromise("Loading open form...");
    if (id) {
      const data = await GetDataRoleById(id);
      if (data) {
        const roleMenus: DtoModuleAccess[] = data.role_menus.map(x => ({
          id: x.id,
          menu_id: x.menu_id,
          menu_slug: x.menu_slug,
          menu_name: x.menu?.name,
          create: x.create ?? false,
          read: x.read ?? false,
          update: x.update ?? false,
          delete: x.delete ?? false,
          is_selected: true
        }));
        setDataStoreAddEdit(roleMenus);

        setAddEditId(id);
        setTxtSlug(data.slug_name);
        setIsActive(data.is_active.toString());
        setTxtName(data.name ?? "");
        await fatchDatasAddEdit(1, perPageAddEdit, roleMenus);
      }
    } else {
      setAddEditId(null);
      setTxtSlug("");
      setIsActive(undefined);
      setTxtName("");
      await fatchDatasAddEdit(1);
    }
    setOpenModal(true);

    toast.dismiss(openSonner);
  };
  const closeModalAddEdit = () => {
    setStateFormAddEdit({ success: true, errors: {} });
    setDataStoreAddEdit([]);
    setOpenModal(false);
  }

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

        openModal={accessPage?.create == true ? () => openModalAddEdit() : undefined}
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

                  {'name' in data && <TableCell>{data.name}</TableCell>}
                  {'slug_name' in data && <TableCell>{data.slug_name}</TableCell>}
                  {'is_active' in data && (
                    <TableCell>
                      <Badge className={`${data.is_active === true ? "success" : "secondary"}`}>
                        {data.is_active === true ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  )}
                  {'createdBy' in data && <TableCell>{data.createdBy}</TableCell>}
                  {'createdAt' in data && (<TableCell>{data.createdAt ? formatDate(data.createdAt, "medium") : "-"}</TableCell>)}

                  {
                     (accessPage && accessPage?.update == true || accessPage?.delete == true) && <TableCell className="text-right space-x-1">
                      {
                        accessPage.update == true && <i onClick={() => openModalAddEdit(data.id)} className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
                      }
                      {
                        (accessPage.delete == true && data.is_delete == true) && <i onClick={() => deleteRow(data.id)} className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>
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

      {/* Modal Add & Edit */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="p-4 text-sm sm:max-w-2xl" setOpenModal={() => closeModalAddEdit()} onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="justify-center gap-y-0">
            <DialogTitle className="text-base"><i className='bx bx-shield-quarter text-lg'></i> {addEditId ? "Edit" : "Add"} Role - Permission</DialogTitle>
            <DialogDescription>Here to add new access role & permission</DialogDescription>
          </DialogHeader>
          <form action={(formData) => handleFormSubmitAddEdit(formData)}>
            <div className='grid grid-cols-12 gap-3 mb-3'>
              <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                <Label className="gap-0" htmlFor="slug">Code<span className="text-red-500">*</span></Label>
                <div>
                  <Input value={txtSlug} onChange={(e) => setTxtSlug(e.target.value)} id="slug" name="slug" type="text" placeholder="Enter unique role code" />
                  {stateFormAddEdit.errors?.slug && <ZodErrors err={stateFormAddEdit.errors?.slug} />}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                <Label className="gap-0" htmlFor="is_active">Status<span className="text-red-500">*</span></Label>
                <div>
                  <Select value={isActive} onValueChange={(val) => setIsActive(val)} name="is_active">
                    <SelectTrigger id="is_active" className="w-full">
                      <SelectValue placeholder="Select status role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {stateFormAddEdit.errors?.is_active && <ZodErrors err={stateFormAddEdit.errors?.is_active} />}
                </div>
              </div>
              <div className="col-span-12 md:col-span-4 grid gap-2">
                <Label className="gap-0" htmlFor="name">Name<span className="text-red-500">*</span></Label>
                <div>
                  <Input value={txtName} onChange={(e) => setTxtName(e.target.value)} id="name" name="name" type="text" placeholder="Enter role name" />
                  {stateFormAddEdit.errors?.name && <ZodErrors err={stateFormAddEdit.errors?.name} />}
                </div>
              </div>
            </div>

            <p className="font-medium mb-1">
              Module Access:
            </p>

            <div className="grid gap-2 mb-4">
              <TableTopToolbar
                inputSearch={inputSearchAddEdit}
                thColomn={tblThColomnsAddEdit}
                tblSortList={tblSortListAddEdit}
                setTblSortList={setTblSortListAddEdit}
                setInputSearch={setInputSearchAddEdit}
                fatchData={() => fatchDatasAddEdit(pageTableAddEdit)}
              />
              <div className="flex">
                <ScrollArea type="always" className="w-1 flex-1 max-h-[300px]">
                  <div className="overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                          <TableHead><Checkbox id="cb_all_menu" /></TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Read</TableHead>
                          <TableHead>Create</TableHead>
                          <TableHead>Update</TableHead>
                          <TableHead>Delete</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {
                          datasAddEdit != null && datasAddEdit?.length > 0 ? datasAddEdit.map((data, i) => (
                            <TableRow key={data.menu_id}>
                              <TableCell><Checkbox checked={data.is_selected} onCheckedChange={(val) => toggleCheckboxAddEdit(i, 'is_selected', val as boolean)} id={"cb_menu_" + i} /></TableCell>
                              <TableCell>{data.menu_name}</TableCell>
                              <TableCell><Checkbox disabled checked={data.read} onCheckedChange={(val) => toggleCheckboxAddEdit(i, 'read', val as boolean)} id={"cb_r_menu_" + i} /></TableCell>
                              <TableCell><Checkbox disabled={!data.is_selected} checked={data.create} onCheckedChange={(val) => toggleCheckboxAddEdit(i, 'create', val as boolean)} id={"cb_c_menu_" + i} /></TableCell>
                              <TableCell><Checkbox disabled={!data.is_selected} checked={data.update} onCheckedChange={(val) => toggleCheckboxAddEdit(i, 'update', val as boolean)} id={"cb_u_menu_" + i} /></TableCell>
                              <TableCell><Checkbox disabled={!data.is_selected} checked={data.delete} onCheckedChange={(val) => toggleCheckboxAddEdit(i, 'delete', val as boolean)} id={"cb_d_menu_" + i} /></TableCell>
                            </TableRow>
                          )) : <TableRow>
                            <TableCell className="text-center" colSpan={6}><i>No data found!</i></TableCell>
                          </TableRow>
                        }
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" className="w-full" />
                </ScrollArea>
              </div>
              <TablePagination
                perPage={perPageAddEdit}
                pageTable={pageTableAddEdit}
                totalPage={totalPageAddEdit}
                totalCount={totalCountAddEdit}
                setPerPage={setPerPageAddEdit}
                setPageTable={setPageTableAddEdit}
                fatchData={fatchDatasAddEdit}

                inputPage={inputPageAddEdit}
                setInputPage={setInputPageAddEdit}
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="primary" size={'sm'}>Submit</Button>
              <Button type="button" onClick={() => closeModalAddEdit()} variant={'outline'} size={'sm'}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
};