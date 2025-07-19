
'use client'

import { Button } from "@/components/ui/button";
import {Users, Package, BarChart3, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userRole: string;
  userName: string;
  userEmail: string;
}

export function Sidebar({ userRole, userName }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard/transacciones",
      icon: BarChart3,
      label: "Transacciones",
      roles: ["ADMIN", "USER"]
    },
    {
      href: "/dashboard/productos", 
      icon: Package,
      label: "Productos",
      roles: ["ADMIN", "USER"]
    },
    {
      href: "/dashboard/usuarios",
      icon: Users, 
      label: "Usuarios",
      roles: ["ADMIN"]
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="w-64 bg-[#6e1e1e] h-screen flex flex-col">
      {/* Header del sidebar */}
      <div className="p-6 border-b border-[#5a1818]">
        <h1 className="text-white text-xl font-bold">Restaurante LLMC</h1>
      </div>

      {/* Información del usuario */}
      <div className="p-6 border-b border-[#5a1818]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#8B3A3A] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">{userName}</p>
            <p className="text-gray-300 text-xs">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Menu de navegación */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-[#8B3A3A] text-white" 
                      : "text-gray-300 hover:bg-[#5a1818] hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-[#5a1818]">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#5a1818]"
          onClick={() => {
            // Aquí puedes agregar la función de logout
            window.location.href = '/Login';
          }}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}