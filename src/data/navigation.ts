import { MegamenuItem, NavItemType } from "@/shared/Navigation/NavigationItem";
import ncNanoId from "@/utils/ncNanoId";
import { Route } from "@/routers/types";


const otherPageChildMenus: NavItemType[] = [
  { id: ncNanoId(), href: "/blog", name: "Syarat & Ketentuan" },
  { id: ncNanoId(), href: "/blog", name: "Kebijakan & Privasi" },
  { id: ncNanoId(), href: "/blog", name: "FAQ" },
  { id: ncNanoId(), href: "/blog", name: "Cek Pengiriman" },
  { id: ncNanoId(), href: "/blog", name: "Refund Tiket" },
  { id: ncNanoId(), href: "/blog", name: "Reschedule Tiket" },
  { id: ncNanoId(), href: "/about", name: "Metode Pembayaran" },
  { id: ncNanoId(), href: "/contact", name: "Hubungi Kami" },
  { id: ncNanoId(), href: "/login", name: "Masuk" },
  { id: ncNanoId(), href: "/signup", name: "Daftar" },
];

const templatesChildrenMenus: NavItemType[] = [
  //
  { id: ncNanoId(), href: "/blog", name: "Tiket Bus" },
  { id: ncNanoId(), href: "/blog", name: "Pengiriman" },
  // { id: ncNanoId(), href: "/checkout", name: "Checkout" },
  // { id: ncNanoId(), href: "/pay-done", name: "Pay done" },
  // //
  // { id: ncNanoId(), href: "/author", name: "Author page" },
  // { id: ncNanoId(), href: "/account", name: "Account page" },
  // //
  // {
  //   id: ncNanoId(),
  //   href: "/subscription",
  //   name: "Subscription",
  // },
];

export const NAVIGATION_DEMO: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Home",
  },
  {
    id: ncNanoId(),
    href: "#",
    name: "Armada Bus",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/blog",
        name: "SHD Bus",
      },
      //
      {
        id: ncNanoId(),
        href: "/blog",
        name: "VIP Bus",
      },

      //
      {
        id: ncNanoId(),
        href: "/blog",
        name: "Mini Bus",
      },
    ],
  },
  {
    id: ncNanoId(),
    href: "/blog",
    name: "Cara Pesan",
    type: "dropdown",
    children: templatesChildrenMenus,
  },
  {
    id: ncNanoId(),
    href: "/about",
    name: "Tentang Kami",
  },

  {
    id: ncNanoId(),
    href: "/blog",
    name: "Layanan Pelanggan",
    type: "dropdown",
    children: otherPageChildMenus,
  },
];
