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
import { useEffect, useState } from "react";
import TableTopToolbar from "@/components/table-top-toolbar";
import TablePagination from "@/components/table-pagination";
import { TableThModel, TableShortList, FormState } from "@/lib/models-type";
import BreadcrumbListing from "@/components/breadcrumb-list";
import { AlertConfirm } from "@/components/alert-confirm";

import { Badge } from "@/components/ui/badge"
import { formatDate, SonnerPromise } from "@/lib/utils";
import { GetDataRoles, StoreDataRoles, DeleteDataRole } from "@/app/api/system-config/action";
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

export default function RolesPermission() {
  const { setLoading } = useLoading();
  const listBreadcrumb = [
    { name: "System Config" },
    { name: "Roles & Permissions", url: "/system-config/roles-permission" }
  ];

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

  const deleteRow = async (id: number) => {
    console.log(id);
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

        DialogAdd={() => ModalAddEdit(fatchDatas)}
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
    </>
  )
}


import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { z } from 'zod';
import { ZodErrors } from '@/components/zod-errors';
import { DtoModuleAccess } from '@/lib/dto-type';
function ModalAddEdit(fatchMainData?: (page?: number, countPage?: number) => Promise<void>) {
  const [openModal, setOpenModal] = useState(false);

  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<DtoModuleAccess[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { key: "name", name: "Name", IsVisible: true },
    { key: "slug", name: "Code", IsVisible: false },
    { key: "is_active", name: "Status", IsVisible: false },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = Object.fromEntries(tblThColomns.filter(col => col.IsVisible).map(col => [col.key, true]));
    const orderObj = tblSortList.filter(col => col.sort && col.sort.trim() !== "").map(col => ({ [col.key as string]: col.sort }));

    try {
      const result = await GetDataMenus({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { name: { contains: inputSearch.trim(), mode: "insensitive" } },
            { slug: { contains: inputSearch.trim(), mode: "insensitive" } }
          ]
        },
        orderBy: orderObj,
        select: {
          id: true,
          ...selectObj
        },
      });
      setTotalPage(result.meta.totalPages);
      setTotalCount(result.meta.total);
      setPageTable(result.meta.page);
      setInputPage(result.meta.page.toString());

      setDatas(result.data.map(x => {
        const findInStore = dataStore.find(y => y.menu_id === x.id);
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
  const clickOpenModal = () => {
    setIsFirstRender(false);
    fatchDatas();
    setOpenModal(true);
  };

  const toggleCheckbox = (index: number, field: keyof DtoModuleAccess, value: boolean) => {
    if (datas === null) return;
    const updated = [...datas];
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

        setDataStore(prev => prev.filter(x => x.menu_id !== dataUpdate.menu_id));
      } else {
        setDataStore(prev => {
          const exists = prev.find(x => x.menu_id === dataUpdate.menu_id);
          if (exists) return prev;
          dataUpdate.read = true;
          return [...prev, dataUpdate];
        });
      };
    } else {
      setDataStore(prev =>
        prev.map(x => x.menu_id === dataUpdate.menu_id ? { ...x, [field]: value } : x)
      );
    };

    updated[index] = dataUpdate;
    setDatas(updated);
  };
  const [dataStore, setDataStore] = useState<DtoModuleAccess[]>([]);

  const [stateForm, setStateForm] = useState<FormState>({ success: false, errors: {} });
  const FormSchema = z.object({
    slug: z.string().min(1, { message: 'Slug is required field.' }).trim(),
    is_active: z.string().min(1, { message: 'Status is required field.' }),
    name: z.string().min(1, { message: 'Name is required field.' }).trim(),
  });

  const handleFormSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const valResult = FormSchema.safeParse(data);
    if (!valResult.success) {
      setStateForm({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };

    setStateForm({ success: true, errors: {} });
    const sonnerSubmit = SonnerPromise("Submiting proccess...", "Please wait, trying to submit you request!");
    try {
      formData.append("list_module", JSON.stringify(dataStore));
      await StoreDataRoles(formData);
      fatchMainData && await fatchMainData();
      toast.success("Submit successfully!", {
        description: "Your submission has been successfully completed!",
      });
      
      setOpenModal(false);
      setDataStore([]);
    } catch (error: any) {
      toast.warning("Request Failed!", {
        description: error.message,
      });
    }
    toast.dismiss(sonnerSubmit);
  }

  return (
    <Dialog open={openModal}>
      <DialogTrigger asChild>
        <Button onClick={clickOpenModal} variant="outline" size="sm">
          <i className='bx bx-plus-circle text-lg'></i> New
        </Button>
      </DialogTrigger>
      <DialogContent setOpenModal={setOpenModal} className="p-4 text-sm sm:max-w-2xl">
        <DialogHeader className="justify-center gap-y-0">
          <DialogTitle className="text-base">Add Role - Permission</DialogTitle>
          <DialogDescription>Here to add new access role & permission</DialogDescription>
        </DialogHeader>
        <form action={(formData) => handleFormSubmit(formData)}>
          <div className='grid grid-cols-12 gap-3 mb-3'>
            <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
              <Label className="gap-0" htmlFor="slug">Code<span className="text-red-500">*</span></Label>
              <div>
                <Input id="slug" name="slug" type="text" placeholder="Enter unique role code" />
                {stateForm.errors?.slug && <ZodErrors err={stateForm.errors?.slug} />}
              </div>
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
              <Label className="gap-0" htmlFor="is_active">Status<span className="text-red-500">*</span></Label>
              <div>
                <Select name="is_active">
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
                {stateForm.errors?.is_active && <ZodErrors err={stateForm.errors?.is_active} />}
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 grid gap-2">
              <Label className="gap-0" htmlFor="name">Name<span className="text-red-500">*</span></Label>
              <div>
                <Input id="name" name="name" type="text" placeholder="Enter role name" />
                {stateForm.errors?.name && <ZodErrors err={stateForm.errors?.name} />}
              </div>
            </div>
          </div>

          <p className="font-medium mb-1">
            Module Access:
          </p>

          <div className="grid gap-2 mb-4">
            <TableTopToolbar
              inputSearch={inputSearch}
              thColomn={tblThColomns}
              tblSortList={tblSortList}
              setTblSortList={setTblSortList}
              setInputSearch={setInputSearch}
              fatchData={() => fatchDatas(pageTable)}
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
                      datas != null && datas?.length > 0 ? datas.map((data, i) => (
                        <TableRow key={data.menu_id}>
                          <TableCell><Checkbox checked={data.is_selected} onCheckedChange={(val) => toggleCheckbox(i, 'is_selected', val as boolean)} id={"cb_menu_" + i} /></TableCell>
                          <TableCell>{data.menu_name}</TableCell>
                          <TableCell><Checkbox disabled checked={data.read} onCheckedChange={(val) => toggleCheckbox(i, 'read', val as boolean)} id={"cb_r_menu_" + i} /></TableCell>
                          <TableCell><Checkbox disabled={!data.is_selected} checked={data.create} onCheckedChange={(val) => toggleCheckbox(i, 'create', val as boolean)} id={"cb_c_menu_" + i} /></TableCell>
                          <TableCell><Checkbox disabled={!data.is_selected} checked={data.update} onCheckedChange={(val) => toggleCheckbox(i, 'update', val as boolean)} id={"cb_u_menu_" + i} /></TableCell>
                          <TableCell><Checkbox disabled={!data.is_selected} checked={data.delete} onCheckedChange={(val) => toggleCheckbox(i, 'delete', val as boolean)} id={"cb_d_menu_" + i} /></TableCell>
                        </TableRow>
                      )) : <TableRow>
                        <TableCell className="text-center" colSpan={tblThColomns.length + 1}><i>No data found!</i></TableCell>
                      </TableRow>
                    }
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
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
          </div>

          <DialogFooter>
            <Button type="submit" className="primary" size={'sm'}>Submit</Button>
            <Button type="button" onClick={() => setOpenModal(false)} variant={'outline'} size={'sm'}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}