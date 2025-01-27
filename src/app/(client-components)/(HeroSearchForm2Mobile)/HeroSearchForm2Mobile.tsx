"use client";

import React, { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ButtonSubmit from "./ButtonSubmit";
import { useTimeoutFn } from "react-use";
import BusSearchForm from "./(bus-search-form)/BusSearchForm";
import { usePathname } from "next/navigation";

interface BusSearchFormRef {
  handleSubmit: () => Promise<void>;
  handleReset: () => void;
}

const HeroSearchForm2Mobile = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const busSearchFormRef = useRef<BusSearchFormRef>(null);
  let [, , resetIsShowingDialog] = useTimeoutFn(() => setShowDialog(true), 1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cek halaman checkout setelah component mounted
  const isCheckoutPage = pathname?.startsWith("/checkout");

  useEffect(() => {
    if (isCheckoutPage) return;

    const handleScroll = () => {
      setIsTop(window.pageYOffset < 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCheckoutPage]);

  if (!mounted) return null;
  if (isCheckoutPage) return null;

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      if (busSearchFormRef.current) {
        await busSearchFormRef.current.handleSubmit();
        closeModal();
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (busSearchFormRef.current) {
      busSearchFormRef.current.handleReset();
    }
    setShowDialog(false);
    resetIsShowingDialog();
  };

  const renderButtonOpenModal = () => {
    return (
      <button
        onClick={openModal}
        className="relative flex items-center w-full border border-neutral-200 dark:border-neutral-6000 px-4 py-2 pr-11 rounded-full shadow-lg"
      >
        <MagnifyingGlassIcon className="flex-shrink-0 w-5 h-5" />

        <div className="ml-3 flex-1 text-left overflow-hidden">
          <span className="block font-medium text-sm">Pergi kemana?</span>
          <span className="block mt-0.5 text-xs font-light text-neutral-500 dark:text-neutral-400 ">
            <span className="line-clamp-1">
              Cari Tiket • Mudah • Cepat
            </span>
          </span>
        </div>

        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-6000 dark:text-neutral-300">
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="block w-4 h-4"
            fill="currentColor"
          >
            <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
          </svg>
        </span>
      </button>
    );
  };

  return (
    <div className="HeroSearchForm2Mobile">
      <div
        className={`fixed inset-x-0 top-0 h-16 bg-white dark:bg-neutral-900 lg:hidden ${
          isTop ? "hidden" : ""
        }`}
      >
        <div className="container h-full">
          <div className="flex items-center justify-between w-full h-full">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 flex items-center space-x-3 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-full shadow hover:shadow-lg"
            >
              <MagnifyingGlassIcon className="flex-shrink-0 w-5 h-5" />
              <div className="flex-grow text-left">
                <span className="block font-medium text-sm">Mau kemana?</span>
                <span className="block mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  Cari tujuan anda...
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
      {renderButtonOpenModal()}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="HeroSearchFormMobile__Dialog relative z-max"
          onClose={closeModal}
        >
          <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
            <div className="flex h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out transition-transform"
                enterFrom="opacity-0 translate-y-52"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in transition-transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-52"
              >
                <Dialog.Panel className="relative h-full overflow-hidden flex-1 flex flex-col">
                  {showDialog && (
                    <Tab.Group manual>
                      {/* Header dengan gradient background */}
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-4">
                        <div className="flex items-center justify-between">
                          <button className="p-2" onClick={closeModal}>
                            <XMarkIcon className="w-5 h-5 text-white" />
                          </button>
                          <h2 className="text-xl font-bold">Pesan Tiket Bus</h2>
                          <div className="w-5" /> {/* Untuk alignment */}
                        </div>
                        <p className="text-sm text-white/80 mt-1 text-center">
                          Temukan jadwal perjalanan terbaik untuk Anda
                        </p>
                      </div>

                      {/* Area yang bisa di-scroll */}
                      <div className="flex-1 overflow-y-auto">
                        <Tab.Panels className="py-4 px-1.5 sm:px-4">
                          <Tab.Panel>
                            <div className="transition-opacity animate-[myblur_0.4s_ease-in-out]">
                              <BusSearchForm ref={busSearchFormRef} />
                            </div>
                          </Tab.Panel>
                        </Tab.Panels>
                      </div>

                      {/* Footer tetap di bawah */}
                      <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
                        <div className="px-4 py-3 flex justify-between items-center">
                          <button
                            type="button"
                            className="text-neutral-500 underline text-sm"
                            onClick={handleReset}
                          >
                            Reset
                          </button>
                          <ButtonSubmit 
                            onClick={handleSearch}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="inline-flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Mencari...
                              </span>
                            ) : (
                              "Cari Jadwal"
                            )}
                          </ButtonSubmit>
                        </div>
                      </div>
                    </Tab.Group>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default HeroSearchForm2Mobile;
