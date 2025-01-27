import rightImg from "@/images/about-hero-right.png";
import nextSvg from "@/public/next.svg";
import vercelSvg from "@/public/vercel.svg";
import thirteenSvg from "@/public/thirteen.svg";
import React, { FC } from "react";
import SectionFounder from "./SectionFounder";
import SectionOurFeatures from "@/components/SectionOurFeatures";
import SectionHowItWork from "@/components/SectionHowItWork";
import SectionHero from "./SectionHero";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import BackgroundSection from "@/components/BackgroundSection";
import SectionClientSay from "@/components/SectionClientSay";
import SectionSubscribe2 from "@/components/SectionSubscribe2";

export interface PageAboutProps {}

const PageAbout: FC<PageAboutProps> = ({}) => {
  return (
    <div className={`nc-PageAbout overflow-hidden relative`}>
      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />

      <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
        <SectionHero
          rightImg={rightImg}
          heading="👋 Tentang Sumatra Bus"
          btnText=""
          subHeading="Sumatra Bus adalah platform pemesanan tiket bus online terkemuka di Sumatra dan Indonesia. Kami menyediakan layanan reservasi tiket bus yang cepat, aman, dan terpercaya untuk berbagai jurasan dengan beragam pilihan kelas dan armada."
        />

        <div className="relative py-16">
          <BackgroundSection />
          <SectionHowItWork
            data={[
              {
                id: 1,
                title: "Cari Rute & Jadwal",
                desc: "Temukan jurusan tujuan dan pilih jadwal yang sesuai",
                img: rightImg
              },
              {
                id: 2,
                title: "Pilih Kursi & Bayar",
                desc: "Pilih tempat duduk favorit Anda dan lakukan pembayaran",
                img: rightImg
              },
              {
                id: 3,
                title: "E-Ticket & Boarding",
                desc: "Dapatkan tiket digital dan tunjukkan saat boarding",
                img: rightImg
              }
            ]}
          />
        </div>

        <div className="relative py-16">
          <BackgroundSection />
          <SectionClientSay 
            data={[
              {
                id: 1,
                clientName: "Budi Santoso",
                clientAddress: "Medan",
                content: "Pelayanan cepat dan armada nyaman. Sangat recommended!"
              },
              {
                id: 2,
                clientName: "Ani Wijaya", 
                clientAddress: "Jakarta",
                content: "Aplikasi mudah digunakan, tiket langsung bisa diprint"
              }
            ]}
          />
        </div>

        <SectionSubscribe2 />
      </div>
    </div>
  );
};

export default PageAbout;
