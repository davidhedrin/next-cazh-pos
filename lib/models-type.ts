export type TableThModel = {
  key: string; // must be colomn name table
  name: string;
};

export type FormState = {
  title?: string,
  errors?: {
    [key: string]: string[] | undefined;
  };
  success?: boolean;
  message?: string;
};