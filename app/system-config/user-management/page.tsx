"use client";
import { useRole } from '@/contexts/role-context';

import { GetDataRoles, GetDataUsers, StoreDataUser } from '@/app/api/actions/system-config';
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
import { useEffect, useRef, useState } from 'react';
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
import { MultiSelect, MutipleSelectType } from '@/components/multi-select';
import { DatePicker } from '@/components/date-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DtoUserAccount } from '@/lib/dto';
import { AllStoreInfo } from '@/app/api/actions/settings';

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
  const [stateFormAddEdit, setStateFormAddEdit] = useState<FormState>({ success: false, errors: {} });
  const [openSelectRole, setOpenSelectRole] = useState(false);
  const [inputSearchPovRole, setInputSearchPovRole] = useState("");
  const [datasRoles, setDatasRoles] = useState<Roles[] | null>(null);
  const [storeAccessList, setStoreAccessList] = useState<MutipleSelectType[]>();
  const closeModalAddEdit = () => {
    setStateFormAddEdit({ success: true, errors: {} });
    setOpenModal(false);
  };
  const createDtoData = (): DtoUserAccount => {
    const newData: DtoUserAccount = {
      id: addEditId,
      email: txtEmail,
      role_id: parseInt(valueSelectRole),
      is_active_user: isActive === "true" ? true : false,

      id_account: addEditIdAccount,
      fullname: txtFullname.trim() != "" ? txtFullname : null,
      no_phone: txtNoPhone.trim() != "" ? txtNoPhone : null,
      gender: txtGender.trim() != "" ? txtGender : null,
      birth_date: txtBirthDate,
      birth_place: txtBirthPlace.trim() != "" ? txtBirthPlace : null,

      store_access: selectedStoreAccess || [],
    };
    return newData;
  };

  const fatchPovDataRole = async (search: string = inputSearchPovRole) => {
    const getRole = await GetDataRoles({
      curPage: 1,
      perPage: 5,
      where: {
        is_active: true,
        OR: [
          { name: { contains: search.trim(), mode: "insensitive" } },
          { slug: { contains: search.trim(), mode: "insensitive" } }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        slug_name: true,
      }
    });
    setDatasRoles(getRole.data);
  };
  const openPopoverRole = async (open: boolean) => {
    setInputSearchPovRole("");
    await fatchPovDataRole("");
    setOpenSelectRole(open);
  };
  const timerRefSearchRole = useRef<NodeJS.Timeout | null>(null)
  const onChangeSearchPovRole = (val: string) => {
    setInputSearchPovRole(val);

    if (timerRefSearchRole.current) {
      clearTimeout(timerRefSearchRole.current)
    }
    timerRefSearchRole.current = setTimeout(() => {
      fatchPovDataRole(val)
    }, 400)
  };

  const openModalAddEdit = async (id?: number) => {
    const openSonner = SonnerPromise("Loading open form...");

    const data = await AllStoreInfo();
    const listData: MutipleSelectType[] = data.map(x => ({
      label: x.name || "",
      value: x.slug
    }));
    setStoreAccessList(listData);

    if (id) {
      // const data = await GetDataRoleById(id);
    } else {
      setAddEditId(null);
      setSelectedStoreAccess([]);
      setTxtEmail("");
      setValueSelectRole("");
      setTxtFullname("");
      setTxtGender("");
      setTxtNoPhone("");
      setTxtBirthPlace("");
      setTxtBirthDate(undefined);
      setIsActive(undefined);
    }
    toast.dismiss(openSonner);
    setOpenModal(true);
  };

  const [addEditId, setAddEditId] = useState<number | null>(null);
  const [addEditIdAccount, setAddEditIdAccount] = useState<number | null>(null);
  const [selectedStoreAccess, setSelectedStoreAccess] = useState<MutipleSelectType[]>();
  const [txtEmail, setTxtEmail] = useState("");
  const [valueSelectRole, setValueSelectRole] = useState("");
  const [txtFullname, setTxtFullname] = useState("");
  const [txtGender, setTxtGender] = useState("");
  const [txtNoPhone, setTxtNoPhone] = useState("");
  const [txtBirthPlace, setTxtBirthPlace] = useState("");
  const [txtBirthDate, setTxtBirthDate] = useState<Date>();
  const [isActive, setIsActive] = useState<string>();
  // const [txtPassword, setTxtPassword] = useState("");
  // const [txtPicture, setTxtPicture] = useState("");
  const FormSchemaAddEdit = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    is_active: z.string().min(1, { message: 'Status is required field.' }).trim(),
    role: z.string().min(1, { message: 'Role is required field.' }).trim(),
    fullname: z.string().min(1, { message: 'Fullname is required field.' }).trim(),
  });
  const handleFormSubmitAddEdit = async (formData: FormData) => {
    formData.append("role", valueSelectRole);
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
        await StoreDataUser(createDtoData());
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

  return (
    <>
      <BreadcrumbListing listBc={listBreadcrumb} />

      <TableTopToolbar
        tblName="User List"
        tblDesc="Easily manage your team. View all users, adjust their access, and keep your system organized and secure."
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
        <DialogContent className="p-4 text-sm sm:max-w-lg" setOpenModal={() => closeModalAddEdit()} onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="justify-center gap-y-0">
            <DialogTitle className="text-base"><i className='bx bx-user-pin text-lg'></i> {addEditId ? "Edit" : "Add"} User Account</DialogTitle>
            <DialogDescription>Here form to handle user account data</DialogDescription>
          </DialogHeader>
          <form action={(formData) => handleFormSubmitAddEdit(formData)}>
            <ScrollArea type="always" className="h-[550px] md:h-auto lg:h-auto">
              <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-3 mb-3'>
                <div className="grid gap-2">
                  <Label className="gap-0" htmlFor="email">Email<span className="text-red-500">*</span></Label>
                  <div>
                    <Input value={txtEmail} onChange={(e) => setTxtEmail(e.target.value)} type="text" id="email" name="email" placeholder="Enter email address" />
                    {stateFormAddEdit.errors?.email && <ZodErrors err={stateFormAddEdit.errors?.email} />}
                  </div>
                </div>
                {/* <div className="grid gap-2">
                  <Label className="gap-0" htmlFor="password">Password<span className="text-red-500">*</span></Label>
                  <div>
                    <Input value={txtPassword} onChange={(e) => setTxtPassword(e.target.value)} type="text" id="password" name="password" placeholder="Enter password account" />
                  </div>
                </div> */}
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
                    {stateFormAddEdit.errors?.is_active && <ZodErrors err={stateFormAddEdit.errors?.is_active} />}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label onClick={() => openPopoverRole(true)} className="gap-0">Role<span className="text-red-500">*</span></Label>
                  <div>
                    <Popover open={openSelectRole} onOpenChange={openPopoverRole}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSelectRole}
                          className="w-full justify-between"
                          style={{ fontWeight: "normal" }}
                        >
                          {(datasRoles && valueSelectRole) ? datasRoles.find((x) => x.id.toString() === valueSelectRole)?.name
                            : <span className="font-normal text-muted-foreground">Select access role</span>}
                          <ChevronDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput value={inputSearchPovRole} onValueChange={(val) => {
                            onChangeSearchPovRole(val);
                          }} placeholder="Search roles..." className="h-8" />
                          <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                              {datasRoles && datasRoles.map((x) => (
                                <CommandItem
                                  key={x.id}
                                  value={x.id.toString()}
                                  onSelect={(currentValue) => {
                                    setValueSelectRole(currentValue === valueSelectRole ? "" : currentValue)
                                    setOpenSelectRole(false)
                                  }}
                                >
                                  {x.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      valueSelectRole === x.id.toString() ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {stateFormAddEdit.errors?.role && <ZodErrors err={stateFormAddEdit.errors?.role} />}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="gap-0" htmlFor="fullname">Fullname<span className="text-red-500">*</span></Label>
                  <div>
                    <Input value={txtFullname} onChange={(e) => setTxtFullname(e.target.value)} type="text" id="fullname" name="fullname" placeholder="Enter fullname account" />
                    {stateFormAddEdit.errors?.fullname && <ZodErrors err={stateFormAddEdit.errors?.fullname} />}
                  </div>
                </div>
                {/* <div className="grid gap-2">
                  <Label className="gap-0" htmlFor="profile_picture">Picture</Label>
                  <div>
                    <Input type="file" id="profile_picture" name="profile_picture" placeholder="Enter profile picture" />
                  </div>
                </div> */}
                <div className="grid gap-2">
                  <Label className="gap-0" htmlFor="gender">Gender</Label>
                  <div>
                    <Select value={txtGender} onValueChange={(val) => setTxtGender(val)} name="gender">
                      <SelectTrigger id="gender" className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="gap-0" htmlFor="no_phone">Phone Number</Label>
                  <div>
                    <Input value={txtNoPhone} onChange={(e) => setTxtNoPhone(e.target.value)} type="text" id="no_phone" name="no_phone" placeholder="Enter phone number" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="gap-0" htmlFor="birth_place">Birth Place</Label>
                  <div>
                    <Input value={txtBirthPlace} onChange={(e) => setTxtBirthPlace(e.target.value)} type="text" id="birth_place" name="birth_place" placeholder="Enter birth place" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="gap-0">Birth Date</Label>
                  <DatePicker dateVal={txtBirthDate} setDateVal={setTxtBirthDate} placeholder="Pick birth date" />
                </div>
              </div>

              <div className="grid gap-2 mb-4">
                <Label className="gap-0">Access Store</Label>
                <div>
                  <MultiSelect
                    options={storeAccessList || []}
                    onValueChange={setSelectedStoreAccess}
                    defaultValue={selectedStoreAccess}
                    placeholder="Select access store"
                    variant="secondary"
                  />
                  <p className="text-sm text-muted-foreground">
                    Choose multiple access stores to streamline user permissions.
                  </p>
                </div>
              </div>
            </ScrollArea>

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