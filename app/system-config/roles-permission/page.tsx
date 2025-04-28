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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TableTopToolbar from "@/components/table-top-toolbar";
import TablePagination from "@/components/table-pagination";
import { TableThModel, TableShortList, FormState } from "@/lib/models-type";
import BreadcrumbListing from "@/components/breadcrumb-list";
import { AlertConfirm } from "@/components/alert-confirm";

import { Badge } from "@/components/ui/badge"
import { formatDate, SonnerPromise } from "@/lib/utils";
import { GetDataRoles, StoreDataRoles, DeleteDataRole, GetDataRoleById } from "@/app/api/system-config/action";
import { Roles } from "@prisma/client";
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GetDataMenus } from '@/app/api/action';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogFooter } from '@/components/ui/dialog';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { z } from 'zod';
import { ZodErrors } from '@/components/zod-errors';
import { DtoModuleAccess } from '@/lib/dto-type';

export default function RolesPermission() {
  const { setLoading } = useLoading();
  const listBreadcrumb = [
    { name: "System Config" },
    { name: "Roles & Permissions", url: "/system-config/roles-permission" }
  ];

  // Start Master
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<Roles[] | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { key: "name", name: "Name", IsVisible: true },
    { key: "slug_name", name: "Code", IsVisible: true },
    { key: "is_active", name: "Status", IsVisible: true },
    { key: "createdBy", name: "Created By", IsVisible: true },
    { key: "createdAt", name: "Created At", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    // setLoading(true);
    const selectObj = Object.fromEntries(tblThColomns.filter(col => col.IsVisible).map(col => [col.key, true]));
    const orderObj = tblSortList.filter(col => col.sort && col.sort.trim() !== "").map(col => ({ [col.key as string]: col.sort }));

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
    // setLoading(false);
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
    }, 300);
    return () => clearTimeout(timer);
  }, [inputSearch]);

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    setIsFirstRender(false);
    fatchDatas();
  }, []);
  // End Master

  const deleteRow = async (id: number) => {
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
    { key: "name", name: "Name", IsVisible: true },
    { key: "slug", name: "Code", IsVisible: false },
    { key: "is_active", name: "Status", IsVisible: false },
  ]);
  const fatchDatasAddEdit = async (page: number = pageTableAddEdit, countPage: number = perPageAddEdit) => {
    const selectObj = Object.fromEntries(tblThColomnsAddEdit.filter(col => col.IsVisible).map(col => [col.key, true]));
    const orderObj = tblSortListAddEdit.filter(col => col.sort && col.sort.trim() !== "").map(col => ({ [col.key as string]: col.sort }));

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
          ...selectObj
        },
      });
      setTotalPageAddEdit(result.meta.totalPages);
      setTotalCountAddEdit(result.meta.total);
      setPageTableAddEdit(result.meta.page);
      setInputPageAddEdit(result.meta.page.toString());

      setDatasAddEdit(result.data.map(x => {
        const findInStore = dataStoreAddEdit.find(y => y.menu_id === x.id);
        return {
          menu_id: x.id,
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
    }, 300);
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
  const [txtSlug, setTxtSlug] = useState("");
  const [isActive, setIsActive] = useState<string>();
  const [txtName, setTxtName] = useState("");

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
    const sonnerSubmit = SonnerPromise("Submiting proccess...", "Please wait, trying to submit you request!");
    try {
      formData.append("list_module", JSON.stringify(dataStoreAddEdit));
      await StoreDataRoles(formData);
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
  };

  const [openModal, setOpenModal] = useState(false);
  const openModalAddEdit = async (id?: number) => {
    if (id) {
      const data = await GetDataRoleById(id);
      if (data) {
        setTxtSlug(data.slug_name);
        setIsActive(data.is_active.toString());
        setTxtName(data.name ?? "");

        // setDatasAddEdit(result.data.map(x => {
        //   const findInStore = dataStoreAddEdit.find(y => y.menu_id === x.id);
        //   return {
        //     menu_id: x.id,
        //     menu_name: x.name,
        //     read: findInStore?.read ?? false,
        //     create: findInStore?.create ?? false,
        //     update: findInStore?.update ?? false,
        //     delete: findInStore?.delete ?? false,
        //     is_selected: findInStore?.is_selected ?? false,
        //   };
        // }));
      }
    }
    setOpenModal(true);
    await fatchDatasAddEdit();
  };
  const closeModalAddEdit = () => {
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

        openModal={() => openModalAddEdit()}
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
                    <i onClick={() => openModalAddEdit(data.id)} className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
                    <AlertConfirm
                      id={data.id.toString()}
                      deleteRow={() => deleteRow(data.id)}

                      className="w-[300px] min-w-[300px]"
                      title="Delete Confirmation!"
                      description="Are your sure want to delete this record? You will not abel to undo this action!"
                      icon={<i className='bx bx-trash bx-tada text-5xl text-muted-foreground'></i>}
                      btnOpen={<i className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>}
                    />
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

      {/* Modal Add & Edit */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent setOpenModal={() => closeModalAddEdit()} onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()} className="p-4 text-sm sm:max-w-2xl">
          <DialogHeader className="justify-center gap-y-0">
            <DialogTitle className="text-base">Add Role - Permission</DialogTitle>
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
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status role" />
                    </SelectTrigger>
                    <SelectContent id="is_active">
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
              <ScrollArea className="max-h-[300px]">
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
              </ScrollArea>
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