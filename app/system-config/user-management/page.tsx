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
import { FormState, TableShortList, TableThModel } from '@/lib/models-type';
import { cn, formatDate, normalizeSelectObj, SonnerPromise, sortListToOrderBy } from '@/lib/utils';
import { Account, RoleMenus, Roles, User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ZodErrors } from '@/components/zod-errors';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';

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
  // End Master

  // Modal Add & Edit
  const [openModal, setOpenModal] = useState(false);
  const [addEditId, setAddEditId] = useState<number | null>(null);
  const [stateFormAddEdit, setStateFormAddEdit] = useState<FormState>({ success: false, errors: {} });
  const [openSelectRole, setOpenSelectRole] = useState(false);
  const [valueSelectRole, setValueSelectRole] = useState("");
  const closeModalAddEdit = () => {
    setStateFormAddEdit({ success: true, errors: {} });
    setOpenModal(false);
  };

  const openModalAddEdit = async (id?: number) => {
    if (id) {
      const openSonner = SonnerPromise("Loading open form...");
      // const data = await GetDataRoleById(id);
    } else {
      setAddEditId(null);
    }
    setOpenModal(true);
  };

  const [isActive, setIsActive] = useState<string>();
  const handleFormSubmitAddEdit = async (formData: FormData) => {
    // const data = Object.fromEntries(formData);
    // const valResult = FormSchemaAddEdit.safeParse(data);
    // if (!valResult.success) {
    //   setStateFormAddEdit({
    //     success: false,
    //     errors: valResult.error.flatten().fieldErrors,
    //   });
    //   return;
    // };
    // setStateFormAddEdit({ success: true, errors: {} });

    // setOpenModal(false);
    // setTimeout(async () => {
    //   const confirmed = await openAlert({
    //     title: 'Submit Confirmation!',
    //     description: 'Are you sure you want to submit this form? Please double-check before proceeding!',
    //     textConfirm: 'Yes, Submit',
    //     textClose: 'No, Go Back',
    //     icon: 'bx bx-error bx-tada text-blue-500'
    //   });
    //   if (!confirmed) {
    //     setOpenModal(true);
    //     return;
    //   }

    //   const sonnerSubmit = SonnerPromise("Submiting proccess...", "Please wait, trying to submit you request!");
    //   try {
    //     await StoreDataRoles(createDtoData());
    //     await fatchDatas();
    //     toast.success("Submit successfully!", {
    //       description: "Your submission has been successfully completed!",
    //     });

    //     setOpenModal(false);
    //     setDataStoreAddEdit([]);
    //   } catch (error: any) {
    //     toast.warning("Request Failed!", {
    //       description: error.message,
    //     });
    //   }
    //   toast.dismiss(sonnerSubmit);
    // }, 100);
  };

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

      {/* Modal Add & Edit */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="p-4 text-sm sm:max-w-xl" setOpenModal={() => closeModalAddEdit()} onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="justify-center gap-y-0">
            <DialogTitle className="text-base"><i className='bx bx-user-pin text-lg'></i> {addEditId ? "Edit" : "Add"} User Account</DialogTitle>
            <DialogDescription>Here form to handle user account data</DialogDescription>
          </DialogHeader>
          <form action={(formData) => handleFormSubmitAddEdit(formData)}>
            <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-3 mb-3'>
              <div className="grid gap-2">
                <Label className="gap-0" htmlFor="email">Email<span className="text-red-500">*</span></Label>
                <div>
                  <Input type="text" id="email" name="email" placeholder="Enter email address" />
                  {/* {stateFormAddEdit.errors?.slug && <ZodErrors err={stateFormAddEdit.errors?.slug} />} */}
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="gap-0" htmlFor="password">Password<span className="text-red-500">*</span></Label>
                <div>
                  <Input type="text" id="password" name="password" placeholder="Enter password account" />
                  {/* {stateFormAddEdit.errors?.slug && <ZodErrors err={stateFormAddEdit.errors?.slug} />} */}
                </div>
              </div>
              <div className="grid gap-2">
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
                  {/* {stateFormAddEdit.errors?.is_active && <ZodErrors err={stateFormAddEdit.errors?.is_active} />} */}
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="gap-0" htmlFor="role_account">Role<span className="text-red-500">*</span></Label>
                <div>
                  <Popover open={openSelectRole} onOpenChange={setOpenSelectRole} modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSelectRole}
                        className="w-full justify-between"
                      >
                        {valueSelectRole
                          ? frameworks.find((framework) => framework.value === valueSelectRole)?.label
                          : "Select framework..."}
                        <ChevronDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
                      <Command>
                        <CommandInput placeholder="Search framework..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {frameworks.map((framework) => (
                              <CommandItem
                                key={framework.value}
                                value={framework.value}
                                onSelect={(currentValue) => {
                                  setValueSelectRole(currentValue === valueSelectRole ? "" : currentValue)
                                  setOpenSelectRole(false)
                                }}
                              >
                                {framework.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    valueSelectRole === framework.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {/* {stateFormAddEdit.errors?.is_active && <ZodErrors err={stateFormAddEdit.errors?.is_active} />} */}
                </div>
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

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]