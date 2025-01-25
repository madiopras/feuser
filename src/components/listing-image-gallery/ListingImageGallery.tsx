"use client";

import "./styles/index.css";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import type { ListingGalleryImage } from "./utils/types";
import { useLastViewedPhoto } from "./utils/useLastViewedPhoto";
import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import LikeSaveBtns from "../LikeSaveBtns";
import { Route } from "next";
import Modal from "./components/Modal";
import SharedModal from "./components/SharedModal";

const PHOTOS: string[] = [
  "https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
  "https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/6438752/pexels-photo-6438752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
];

export const DEMO_IMAGE: ListingGalleryImage[] = [...PHOTOS].map(
  (item, index): ListingGalleryImage => {
    return {
      id: index,
      url: item,
    };
  }
);

export function getNewParam({
  value,
  paramName = "photoId",
}: {
  value: string | number;
  paramName?: string;
}) {
  const params = new URLSearchParams();
  params.set(paramName, String(value));
  return params.toString();
}

interface Props {
  images?: ListingGalleryImage[];
  onClose?: () => void;
  isShowModal?: boolean;
}

const ListingImageGallery: React.FC<Props> = ({
  images = [],
  onClose,
  isShowModal,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const thisPathname = usePathname();
  const photoId = searchParams?.get("photoId");
  let index = Number(photoId);

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(0);
  useEffect(() => {
    setCurIndex(index);
  }, [index]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function changePhotoId(newVal: number) {
    if (newVal > index) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurIndex(newVal);
    router.push(`${thisPathname}/?${getNewParam({ value: newVal })}` as Route);
  }

  if (!mounted || !isShowModal) return null;

  return (
    <Dialog
      static
      open={true}
      onClose={() => onClose?.()}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 z-30 bg-black/70" aria-hidden="true" />
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={() => onClose?.()}
        navigation={true}
      />
    </Dialog>
  );
};

export default ListingImageGallery;
