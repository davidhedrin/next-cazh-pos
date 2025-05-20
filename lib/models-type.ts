export type TableThModel = {
  key: string; // must be colomn name table
  name: string;
  key_sort: string;
  IsVisible?: boolean;
};

export type TableShortList = {
  key: string;
  sort?: "asc" | "desc" | "";
};

export type FormState = {
  title?: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
  success?: boolean;
  message?: string;
};

export type BreadcrumbModel = {
  name: string;
  url?: string;
};

export type CommonParams = {
  curPage?: number;
  perPage?: number;
};

export type PaginateResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GroupAppsMenu = {
  groupName: string;
  menus: AppSidebarMenu[];
};

export type AppSidebarMenu = {
  title: string;
  url: string;
  icon?: string;
  slug: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  isActive?: boolean;
  items?: AppSidebarMenu[];
};

export type UploadFileRespons = {
  status: boolean;
  message?: string | null;
  filename?: string | null;
  path?: string | null;
}