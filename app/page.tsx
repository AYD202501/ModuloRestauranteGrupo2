import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, ShoppingCart, Undo, UtensilsCrossed, Beef } from "lucide-react";

import  Link  from "next/link";
import React from "react";

export default function Menu(){
  // Menu category data for mapping
  const menuCategories = [
    {
      title: "Desayunos",
      icon: <Coffee className="w-20 h-20" />,
    },
    {
      title: "Almuerzos",
      icon: <UtensilsCrossed className="w-20 h-20" />,
    },
    {
      title: "Cenas",
      icon: <Beef className="w-20 h-20" />,
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen">
      <div className="bg-white w-full max-w-[1920px] h-[1080px] relative">
        {/* Header */}
        <h1 className="absolute w-[878px] h-[104px] top-[111px] left-1/2 -translate-x-1/2 font-['Judson-Regular',Helvetica] font-normal text-black text-8xl text-center tracking-[0] leading-[144px] whitespace-nowrap">
          Menú
        </h1>

        {/* Menu Categories */}
        <div className="absolute top-[448px] left-1/2 -translate-x-1/2 flex gap-[99px]">
          {menuCategories.map((category, index) => (
            <Card
              key={index}
              className="w-[494px] h-[227px] bg-[#6e1e1e] rounded-[30px] overflow-hidden border-none shadow-none"
            >
              <CardContent className="p-0 h-full relative">
                <div className="absolute w-full top-1/2 -translate-y-1/2 left-0 flex justify-between items-center px-[45px]">
                  <h2 className="font-['Judson-Regular',Helvetica] font-normal text-white text-[65px] text-center tracking-[0] leading-[97.5px] whitespace-nowrap">
                    {category.title}
                  </h2>
                  <div className="flex justify-center items-center">
                    {category.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
      <div className="absolute w-full h-[182px] bottom-0 left-0 bg-[#476e6e]" />

        <Button asChild className="absolute w-[200px] h-[42px] top-5 right-[300px] bg-[#6e1e1e] rounded-[15px] text-white hover:bg-[#5a1818] flex items-center justify-center gap-4">
          <Link href="/Login" className="font-['Judson-Regular',Helvetica] font-normal text-[32px] text-center tracking-[0] leading-[48px] whitespace-nowrap">Login</Link>
        </Button>

        {/* Cart Button */}
        <Button className="absolute w-[200px] h-[42px] top-5 right-[33px] bg-[#6e1e1e] rounded-[15px] text-white hover:bg-[#5a1818] flex items-center justify-center gap-4">
          <ShoppingCart className="w-8 h-8" />
          <span className="font-['Judson-Regular',Helvetica] font-normal text-[32px] text-center tracking-[0] leading-[48px] whitespace-nowrap">
            Carrito
          </span>
        </Button>

        {/* Back Button */}
        <Button
          variant="ghost"
          className="absolute w-[42px] h-[42px] top-5 left-[33px] bg-[#6e1e1e] rounded-[15px] p-0 hover:bg-[#5a1818]"
        >
          <Undo className="w-[42px] h-[42px] text-white" />
        </Button>
      </div>
    </div>
  );
}