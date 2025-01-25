"use client";
import { Card, CardContent } from "@/components/ui/card";
import coverImage from "@/public/images/all-img/user-cover.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import User from "@/public/images/avatar/user.png";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { GlassWater, Wifi, AirVent, Popcorn, PlugZap, Tv } from "lucide-react";
import { Label } from "@/components/ui/label";
const RouteList = () => {
  return (
    <Fragment>
      <Card className="mt-6 rounded-t-2xl">
        <CardContent className="p-0">
          <div
            className="relative h-[50px] lg:h-[200px] rounded-t-2xl w-full object-cover bg-no-repeat"
            style={{ backgroundImage: `url(${coverImage.src})` }}
          >
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="col-span-2 text-xs lg:text-sm font-medium text-default-100 dark:text-default-900 pb-1.5">
                  Sumatra Bus 94
              </div>
              <div className="text-xs lg:text-sm font-medium text-default-100 dark:text-default-900 pb-1.5">
                  Sisa Kursi : 34
              </div>
            </div>
          
            <div className="flex flex-col justify-between h-full p-6">
              <div>
                
                <div className="text-xl lg:text-2xl font-semibold text-primary-foreground mb-1">
                  20.00 - 08.00 (1h)
                </div>
                <div className="text-xs lg:text-sm font-medium text-default-100 dark:text-default-900 pb-1.5">
                  Terminal Medan - Shelter Pekanbaru
                </div>
              </div>
              <div className="flex justify-between pt-4 divide-x divide-primary-foreground">
                <div>
                  <div className="text-xl font-semibold text-primary-foreground">
                    Rp. 120.000
                  </div>
                </div>
                <div className="pl-4">
                  <div className="text-sm text-default-200">Sisa Kursi</div>
                  <div className="text-xl font-semibold text-primary-foreground">
                    34
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 lg:gap-8 pt-7 lg:pt-5 pb-4 px-6">
            <Label>Fasilitas:</Label>
            <GlassWater className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <AirVent className="w-4 h-4" />
            <Popcorn className="w-4 h-4" />
            <PlugZap className="w-4 h-4" />
            <Tv className="w-4 h-4" />
          </div>

          <div className="flex justify-end px-6 pb-4">
            <button className="bg-primary-foreground text-white py-2 px-4 rounded-lg hover:bg-primary-700">
              Pilih
            </button>
          </div>
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default RouteList;
