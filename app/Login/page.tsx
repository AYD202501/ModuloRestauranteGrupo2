// app/login/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular autenticación con delay
    setTimeout(() => {
      // Redireccionar al dashboard sin autenticación real
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen">
      <div className="bg-white w-full h-screen relative flex">
        {/* Left side - Image */}
        <div className="w-[932px] h-full relative overflow-hidden">
          <img
            className="absolute w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            alt="Restaurant food"
            src="https://img.hogar.mapfre.es/wp-content/uploads/2018/09/hamburguesa-sencilla.jpg"
          />
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 flex flex-col items-center justify-center px-16 bg-gradient-to-br from-gray-50 to-white">
          {/* Restaurant name */}
          <h1 className="w-full mb-12 [font-family:'Judson-Regular',Helvetica] font-normal text-black text-7xl text-center tracking-[0] leading-[120px] drop-shadow-sm">
            Restaurante LLMC
          </h1>

          {/* Login heading */}
          <h2 className="w-full mb-12 [font-family:'Judson-Regular',Helvetica] font-normal text-gray-700 text-5xl text-center tracking-[0] leading-[80px]">
            Inicio de Sesión
          </h2>

          {/* Login form */}
          <form onSubmit={handleLogin} className="w-full max-w-[775px]">
            {/* Username field */}
            <div className="flex items-center mb-8">
              <label className="w-[241px] [font-family:'Judson-Regular',Helvetica] font-normal text-black text-2xl text-right tracking-[0] leading-9 mr-5">
                Usuario:
              </label>
              <Input
                className="w-[485px] h-12 bg-white border-2 border-gray-200 rounded-[25px] shadow-sm hover:border-gray-300 focus:border-[#8B3A3A] focus:ring-2 focus:ring-[#8B3A3A]/20 transition-all duration-200"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@restaurant.com"
                required
              />
            </div>

            {/* Password field */}
            <div className="flex items-center mb-8">
              <label className="w-[241px] [font-family:'Judson-Regular',Helvetica] font-normal text-black text-2xl text-right tracking-[0] leading-9 mr-5">
                Contraseña:
              </label>
              <Input
                className="w-[485px] h-12 bg-white border-2 border-gray-200 rounded-[25px] shadow-sm hover:border-gray-300 focus:border-[#8B3A3A] focus:ring-2 focus:ring-[#8B3A3A]/20 transition-all duration-200"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                required
              />
            </div>

            {/* Login button */}
            <div className="flex justify-center mt-8">
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-[525px] h-[76px] bg-[#8B3A3A] hover:bg-[#6d2e2e] active:bg-[#5a2525] rounded-[38px] [font-family:'Judson-Regular',Helvetica] font-normal text-white text-[32px] tracking-[0] leading-[48px] shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Iniciando...
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end mt-4">
              <a
                href="#"
                className="[font-family:'Judson-Regular',Helvetica] font-normal text-[#0066cc] hover:text-[#0052a3] text-xl tracking-[0] leading-[30px] transition-colors duration-200 hover:underline"
              >
                ¿Se le olvidó su contraseña?
              </a>
            </div>

            <Separator className="my-12" />

            <div className="flex justify-center">
              <Button asChild
                variant="outline"
                className="w-[525px] h-[76px] bg-black hover:bg-gray-800 active:bg-gray-900 rounded-[38px] [font-family:'Judson-Regular',Helvetica] font-normal text-white text-[32px] tracking-[0] leading-[48px] border-none shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Link href="/registro">Crear Cuenta</Link>
              </Button>
            </div>
          </form>

          {/* Quick access info */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm max-w-[775px] w-full">
            <div className="text-center">
              <p className="font-semibold mb-2 text-gray-700">Credenciales de prueba:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                <div>
                  <strong>Admin:</strong> admin@restaurant.com
                </div>
                <div>
                  <strong>Usuario:</strong> user@restaurant.com
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">Contraseña para ambos: password123</p>
            </div>
          </div>

          {/* Quick dashboard access */}
          <div className="mt-6">
            <Button asChild variant="ghost" className="text-gray-500 hover:text-gray-700">
              <Link href="/dashboard">
                Ir directamente al Dashboard →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}