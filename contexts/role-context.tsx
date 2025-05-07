// contexts/RoleContext.tsx
import { RoleMenus } from "@prisma/client";
import React, { createContext, useContext, useState } from "react";

type RoleContextType = {
  roleMenus: RoleMenus[];
  setRoleMenus: (menus: RoleMenus[]) => void;
};

const RoleContext = createContext<RoleContextType>({
  roleMenus: [],
  setRoleMenus: () => {},
});

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [roleMenus, setRoleMenus] = useState<RoleMenus[]>([]);

  return (
    <RoleContext.Provider value={{ roleMenus, setRoleMenus }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
