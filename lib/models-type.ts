export type TableThModel = {
  key: string; // must be colomn name table
  name: string;
  key_sort: string;
  IsVisible?: boolean;
};

export type TableShortList = {
  key: string;
  sort?: "asc" | "desc" | "";
}

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
}

export type CommonParams = {
  curPage?: number;
  perPage?: number;
}

export type PaginateResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}