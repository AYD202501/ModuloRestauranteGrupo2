// app/dashboard/layout.tsx
'use client'

import { Sidebar } from "@/components/sidebar";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener información del usuario actual
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const users = await response.json();
        // Por simplicidad, usar el primer usuario ADMIN como usuario actual
        const adminUser = users.find((u: User) => u.role === 'ADMIN') || users[0];
        setCurrentUser(adminUser);
      } else {
        // Fallback a usuario mock si la API falla
        setCurrentUser({
          id: 'mock-admin',
          name: "Administrator",
          email: "admin@restaurant.com", 
          role: "ADMIN"
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // Fallback a usuario mock
      setCurrentUser({
        id: 'mock-admin',
        name: "Administrator",
        email: "admin@restaurant.com", 
        role: "ADMIN"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar skeleton */}
        <div className="w-64 bg-[#6e1e1e] h-screen flex flex-col">
          <div className="p-6 border-b border-[#5a1818]">
            <div className="h-6 bg-[#8B3A3A] rounded animate-pulse"></div>
          </div>
          <div className="p-6 border-b border-[#5a1818]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#8B3A3A] rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[#8B3A3A] rounded w-20 animate-pulse"></div>
                <div className="h-3 bg-[#8B3A3A] rounded w-16 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-[#8B3A3A] rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Main content skeleton */}
        <main className="flex-1 overflow-auto p-8">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        userRole={currentUser.role}
        userName={currentUser.name || currentUser.email}
        userEmail={currentUser.email}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}