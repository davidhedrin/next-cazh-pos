import { MutipleSelectType } from "@/components/multi-select";

export type DtoRoles = {
  id: number | null;
  slug_name: string;
  name?: string;
  business_id?: number;
  is_active?: boolean;
  role_menus: DtoModuleAccess[];
}

export type DtoModuleAccess = {
  id?: number | null;
  menu_id: number;
  menu_slug: string;
  menu_name?: string | null;
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  is_selected?: boolean;
};

export type DtoStoreInfo = {
  id: number | null;
  name: string;
  desc?: string | null;
  address?: string | null;
  no_tlp?: string | null;
  email?: string | null;
  is_active?: boolean;
}

export type DtoUserAccount = {
  id: number | null;
  email: string;
  role_id: number | null;
  is_active_user?: boolean;

  id_account: number | null;
  fullname?: string | null;
  image?: string | null;
  image_file?: File | null;
  no_phone?: string | null;
  gender?: string | null;
  birth_date?: Date | null;
  birth_place?: string | null;

  store_access: MutipleSelectType[];
}