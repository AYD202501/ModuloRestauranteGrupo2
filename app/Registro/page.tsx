import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Undo2 } from "lucide-react";

import  Link  from "next/link";
import React from "react";

export default function Registro(){
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full h-screen relative flex">
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-5 left-8 w-[42px] h-[42px] rounded-[15px] bg-[#6e1e1e]"
            aria-label="Go back"
          >
            <Undo2 className="w-6 h-6" />
          </Button>

          <div className="w-full max-w-[775px] mb-16">
            <h1 className="[font-family:'Judson-Regular',Helvetica] font-normal text-black text-8xl text-center tracking-[0] leading-[144px] whitespace-nowrap">
              Registro
            </h1>
          </div>

          <Card className="border-none shadow-none w-full max-w-[775px]">
            <CardContent className="p-0 space-y-8">
              <div className="flex items-center">
                <label className="w-[241px] [font-family:'Judson-Regular',Helvetica] font-normal text-black text-2xl text-right tracking-[0] leading-9 whitespace-nowrap pr-5">
                  Usuario:
                </label>
                <Input
                  className="w-[485px] h-12 bg-[#d9d9d9] rounded-[50px] shadow-[0px_4px_4px_#00000040] opacity-50"
                  aria-label="Usuario"
                />
              </div>

              <div className="flex items-center">
                <label className="w-[241px] [font-family:'Judson-Regular',Helvetica] font-normal text-black text-2xl text-right tracking-[0] leading-9 whitespace-nowrap pr-5">
                  Contraseña:
                </label>
                <Input
                  type="password"
                  className="w-[485px] h-12 bg-[#d9d9d9] rounded-[50px] shadow-[0px_4px_4px_#00000040] opacity-50"
                  aria-label="Contraseña"
                />
              </div>

              <div className="flex items-center">
                <label className="w-[300px] [font-family:'Judson-Regular',Helvetica] font-normal text-black text-2xl text-right tracking-[0] leading-9 whitespace-nowrap pr-5">
                  Confirmar Contraseña:
                </label>
                <Input
                  type="password"
                  className="w-[485px] h-12 bg-[#d9d9d9] rounded-[50px] shadow-[0px_4px_4px_#00000040] opacity-50"
                  aria-label="Confirmar Contraseña"
                />
              </div>

              <div className="flex justify-center mt-10">
                <Button className="w-[525px] h-[76px] bg-[#1e6e6e] hover:bg-[#175858] rounded-full [font-family:'Judson-Regular',Helvetica] font-normal text-white text-[32px] tracking-[0] leading-[48px]">
                  Crear Cuenta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-[804px] h-screen">
          <img className="w-full h-full object-cover" alt="Food image" src="https://myplate-prod.azureedge.us/sites/default/files/styles/medium/public/2020-11/SkilletPastaDinner_527x323.jpg?itok=QIx-r8dj"/>
        </div>
      </div>
    </div>
  );
}