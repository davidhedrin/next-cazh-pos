"use client";

import { DeleteDataStoreInfo, GetDataStoreInfoById, GetDataStoresInfo, StoreUpdateDataStoreInfo } from '@/app/api/actions/settings';
import { UseAlertDialog } from '@/components/alert-confirm';
import BreadcrumbListing from '@/components/breadcrumb-list';
import TablePagination from '@/components/table-pagination';
import TableTopToolbar from '@/components/table-top-toolbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { ZodErrors } from '@/components/zod-errors';
import { useLoading } from '@/contexts/loading-context';
import { useRole } from '@/contexts/role-context';
import { DtoStoreInfo } from '@/lib/dto';
import { FormState, TableShortList, TableThModel } from '@/lib/models-type';
import { formatDate, normalizeSelectObj, SonnerPromise, sortListToOrderBy } from '@/lib/utils';
import { RoleMenus, StoresInfo } from '@prisma/client';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { z } from 'zod';

export default function StoreInformation() {
  const { roleMenus } = useRole();
  const { setLoading } = useLoading();
  const { openAlert } = UseAlertDialog();

  const listBreadcrumb = [
    { name: "Settings" },
    { name: "Store Information", url: "/settings/store-info" }
  ];

  // Start Master
  const [accessPage, setAccessPage] = useState<RoleMenus>();
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<StoresInfo[] | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Store Name", key: "name", key_sort: "name", IsVisible: true },
    { name: "Store Code", key: "slug", key_sort: "slug", IsVisible: true },
    { name: "Address", key: "address", key_sort: "address", IsVisible: true },
    { name: "No Phone", key: "no_tlp", key_sort: "no_tlp", IsVisible: true },
    { name: "Store Email", key: "email", key_sort: "email", IsVisible: true },
    { name: "Status", key: "is_active", key_sort: "is_active", IsVisible: true },
    { name: "Created At", key: "createdAt", key_sort: "createdAt", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const result = await GetDataStoresInfo({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { name: { contains: inputSearch.trim(), mode: "insensitive" } },
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
    setLoading(true);
    const firstInit = async () => {
      await fatchDatas();
      setIsFirstRender(false);
      setLoading(false);
    };
    if (roleMenus != undefined && roleMenus.length > 0) {
      const permission = roleMenus.find((rm) => rm.menu_slug === "set-sri");
      if (!permission) redirect('/access-denied');

      setAccessPage(permission);
      firstInit();
    }
  }, [roleMenus]);
  // End Master

  // Modal Add & Edit
  const [openModal, setOpenModal] = useState(false);
  const [stateFormAddEdit, setStateFormAddEdit] = useState<FormState>({ success: false, errors: {} });

  const [addEditId, setAddEditId] = useState<number | null>(null);
  const [txtName, setTxtName] = useState("");
  const [isActive, setIsActive] = useState<string>();
  const [txtNoPhone, setTxtNoPhone] = useState("");
  const [txtEmail, setTxtEmail] = useState("");
  const [txtAddress, setTxtAddress] = useState("");
  const [txtDesc, setTxtDesc] = useState("");
  const FormSchemaAddEdit = z.object({
    is_active: z.string().min(1, { message: 'Status is required field.' }).trim(),
    store_name: z.string().min(1, { message: 'Name is required field.' }).trim(),
    address: z.string().min(1, { message: 'Address is required field.' }).trim(),
    email: z.string().trim().optional()
      .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Email address is not valid.",
      }),
  });
  const closeModalAddEdit = () => {
    setStateFormAddEdit({ success: true, errors: {} });
    setOpenModal(false);
  };
  const createDtoData = (): DtoStoreInfo => {
    const newData: DtoStoreInfo = {
      id: addEditId,
      name: txtName,
      desc: txtDesc.trim() != "" ? txtDesc : null,
      address: txtAddress.trim() != "" ? txtAddress : null,
      no_tlp: txtNoPhone.trim() != "" ? txtNoPhone : null,
      email: txtEmail.trim() != "" ? txtEmail : null,
      is_active: isActive === "true" ? true : false,
    };
    return newData;
  };
  const openModalAddEdit = async (id?: number) => {
    if (id) {
      const openSonner = SonnerPromise("Loading open form...");
      const data = await GetDataStoreInfoById(id);
      if(data){
        setAddEditId(data.id);
        setIsActive(data.is_active.toString());
        setTxtName(data.name || "");
        setTxtNoPhone(data.no_tlp || "");
        setTxtEmail(data.email || "");
        setTxtAddress(data.address || "");
        setTxtDesc(data.desc || "");
      }
      toast.dismiss(openSonner);
    } else {
      setAddEditId(null);
      setIsActive(undefined);
      setTxtName("");
      setTxtNoPhone("");
      setTxtEmail("");
      setTxtAddress("");
      setTxtDesc("");
    }
    setOpenModal(true);
  };
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
        await StoreUpdateDataStoreInfo(createDtoData());
        await fatchDatas();
        toast.success("Submit successfully!", {
          description: "Your submission has been successfully completed!",
        });

        setOpenModal(false);
      } catch (error: any) {
        toast.warning("Request Failed!", {
          description: error.message,
        });
      }
      toast.dismiss(sonnerSubmit);
    }, 100);
  };
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
      await DeleteDataStoreInfo(id);
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

  return (
    <>
      <BreadcrumbListing listBc={listBreadcrumb} />

      <TableTopToolbar
        tblName="Store Info List"
        tblDesc="Manage all the stores your own linked to your account. The number can register is limited by your Subscription Plan!"
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
              {(accessPage?.update == true || accessPage?.delete == true) && <TableHead className="text-right">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              datas != null && datas?.length > 0 ? datas.map((data, i) => (
                <TableRow key={data.id}>
                  <TableCell>{(pageTable - 1) * perPage + i + 1}</TableCell>

                  {'name' in data && <TableCell>{data.name}</TableCell>}
                  {'slug' in data && <TableCell>{data.slug}</TableCell>}
                  {'address' in data && <TableCell className="truncate max-w-[280px]">{data.address ?? "-"}</TableCell>}
                  {'no_tlp' in data && <TableCell>{data.no_tlp ?? "-"}</TableCell>}
                  {'email' in data && <TableCell>{data.email ?? "-"}</TableCell>}
                  {'is_active' in data && (
                    <TableCell>
                      <Badge className={`${data.is_active === true ? "success" : "secondary"}`}>
                        {data.is_active === true ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  )}
                  {'createdAt' in data && (<TableCell>{data.createdAt ? formatDate(data.createdAt, "medium") : "-"}</TableCell>)}

                  {
                    (accessPage && accessPage?.update == true || accessPage?.delete == true) && <TableCell className="text-right space-x-1">
                      {
                        accessPage.update == true && <i onClick={() => openModalAddEdit(data.id)} className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
                      }
                      {
                        accessPage.delete == true && <i onClick={() => deleteRow(data.id)} className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>
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

      {/* Modal add & edit */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="p-4 text-sm sm:max-w-lg" setOpenModal={() => closeModalAddEdit()} onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="justify-center gap-y-0">
            <DialogTitle className="text-base"><i className='bx bx-store-alt text-lg'></i> {addEditId ? "Edit" : "Add"} Store</DialogTitle>
            <DialogDescription>Here form to handle store info data</DialogDescription>
          </DialogHeader>
          <form action={(formData) => handleFormSubmitAddEdit(formData)}>
            <div className='grid grid-cols-12 gap-3 mb-3'>
              <div className="col-span-12 md:col-span-6 sm:col-span-6 grid gap-2">
                <Label className="gap-0" htmlFor="store_name">Store Name<span className="text-red-500">*</span></Label>
                <div>
                  <Input value={txtName} onChange={(e) => setTxtName(e.target.value)} type="text" id="store_name" name="store_name" placeholder="Enter store name" />
                  {stateFormAddEdit.errors?.store_name && <ZodErrors err={stateFormAddEdit.errors?.store_name} />}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 sm:col-span-6 grid gap-2">
                <Label className="gap-0" htmlFor="is_active">Status<span className="text-red-500">*</span></Label>
                <div>
                  <Select value={isActive} onValueChange={(val) => setIsActive(val)} name="is_active">
                    <SelectTrigger id="is_active" className="w-full">
                      <SelectValue placeholder="Select status account" />
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
              <div className="col-span-12 md:col-span-6 sm:col-span-6 grid gap-2">
                <Label className="gap-0" htmlFor="no_phone">No Phone</Label>
                <div>
                  <Input value={txtNoPhone} onChange={(e) => setTxtNoPhone(e.target.value)} type="text" id="no_phone" name="no_phone" placeholder="Enter store phone number" />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 sm:col-span-6 grid gap-2">
                <Label className="gap-0" htmlFor="email">Email</Label>
                <div>
                  <Input value={txtEmail} onChange={(e) => setTxtEmail(e.target.value)} type="text" id="email" name="email" placeholder="Enter store email address" />
                  {stateFormAddEdit.errors?.email && <ZodErrors err={stateFormAddEdit.errors?.email} />}
                </div>
              </div>
              <div className="col-span-12 grid gap-2">
                <Label className="gap-0" htmlFor="address">Address<span className="text-red-500">*</span></Label>
                <Textarea value={txtAddress} onChange={(e) => setTxtAddress(e.target.value)} id="address" name="address" className="min-h-9" placeholder="Enter store address" />
                {stateFormAddEdit.errors?.address && <ZodErrors err={stateFormAddEdit.errors?.address} />}
              </div>
              <div className="col-span-12 grid gap-2">
                <Label className="gap-0" htmlFor="store_desc">Description</Label>
                <Textarea value={txtDesc} onChange={(e) => setTxtDesc(e.target.value)} id="store_desc" name="store_desc" className="min-h-9" placeholder="Enter description if any" />
              </div>
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
}