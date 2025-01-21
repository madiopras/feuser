import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import logoLightImg from "@/images/logo-sumatra-dark.png";
import logoImg from "@/images/logo-sumatra.png";

export interface LogoProps {
  img?: StaticImageData; // Gambar default untuk mode terang
  imgLight?: StaticImageData; // Gambar untuk mode gelap
  className?: string; // Kelas tambahan untuk styling
}

const Logo: React.FC<LogoProps> = ({
  img = logoImg,
  imgLight = logoLightImg,
  className = "w-24",
}) => {
  return (
    <Link href="/" className={`ttnc-logo inline-block ${className}`}>
      {/* Logo untuk mode terang */}
      {img && (
        <Image
          className={`block max-h-12 ${imgLight ? "dark:hidden" : ""}`}
          src={img}
          alt="Logo"
          priority // Memastikan logo dimuat lebih cepat
        />
      )}

      {/* Logo untuk mode gelap */}
      {imgLight && (
        <Image
          className="hidden max-h-12 dark:block"
          src={imgLight}
          alt="Logo-Light"
          priority
        />
      )}
    </Link>
  );
};

export default Logo;
