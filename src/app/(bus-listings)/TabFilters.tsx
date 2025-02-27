"use client";

import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonThird from "@/shared/ButtonThird";
import Checkbox from "@/shared/Checkbox";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";

interface BusClass {
  id: number;
  name: string;
}

const TabFilters = () => {
  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [busClasses, setBusClasses] = useState<BusClass[]>([]);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchBusClasses = async () => {
      try {
        const response = await axios.get('api/guest/classes/get-name');
        if (response.data.status && response.data.data) {
          setBusClasses(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching bus classes:', error);
      }
    };

    fetchBusClasses();
  }, []);

  const handleChangeClass = (checked: boolean, id: number) => {
    const newSelectedClasses = checked
      ? [...selectedClasses, id]
      : selectedClasses.filter(classId => classId !== id);
    
    setSelectedClasses(newSelectedClasses);
  };

  const updateURL = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (selectedClasses.length > 0) {
      current.set('class_bus', selectedClasses.join('x'));
    } else {
      current.delete('class_bus');
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    
    router.replace(`${pathname}${query}` as any);
  };

  const handleClear = (closePopover?: () => void) => {
    setSelectedClasses([]);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete('class_bus');
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}` as any);
    if (closePopover) {
      closePopover();
    }
  };

  const renderXClear = () => {
    return (
      <span className="w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center ml-3 cursor-pointer">
        <XMarkIcon className="h-3 w-3" />
      </span>
    );
  };

  const renderDesktopFilter = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border border-neutral-300 dark:border-neutral-700 focus:outline-none 
              ${open ? "!border-primary-500 " : ""}
              ${!!selectedClasses.length ? "!border-primary-500 bg-primary-50" : ""}`}
            >
              <span>Kelas Bus {selectedClasses.length > 0 && `(${selectedClasses.length})`}</span>
              {!selectedClasses.length ? (
                <i className="las la-angle-down ml-2"></i>
              ) : (
                <span onClick={(e) => { 
                  e.stopPropagation(); 
                  setSelectedClasses([]); 
                  updateURL();
                }}>
                  {renderXClear()}
                </span>
              )}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div className="relative flex flex-col px-5 py-6 space-y-5">
                    {busClasses.map((item) => (
                      <div key={item.id} className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-all">
                        <Checkbox
                          name={item.name}
                          label={item.name}
                          defaultChecked={selectedClasses.includes(item.id)}
                          onChange={(checked) => handleChangeClass(checked, item.id)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                    <ButtonThird
                      onClick={() => handleClear(close)}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Clear
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={() => {
                        updateURL();
                        close();
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Apply
                    </ButtonPrimary>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderMobileFilter = () => {
    return (
      <div>
        <div
          className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-700 focus:outline-none cursor-pointer`}
          onClick={() => setisOpenMoreFilter(true)}
        >
          <span>
            Kelas Bus {selectedClasses.length > 0 && `(${selectedClasses.length})`}
          </span>
          {selectedClasses.length > 0 && (
            <span onClick={(e) => { 
              e.stopPropagation(); 
              setSelectedClasses([]); 
              updateURL();
            }}>
              {renderXClear()}
            </span>
          )}
        </div>

        <Transition appear show={isOpenMoreFilter} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={() => setisOpenMoreFilter(false)}
          >
            <div className="min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
              </Transition.Child>

              <span className="inline-block h-screen align-middle">&#8203;</span>
              
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white dark:bg-neutral-900 shadow-xl rounded-2xl">
                  <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-5">
                    Pilih Kelas Bus
                  </Dialog.Title>
                  <div className="space-y-4">
                    {busClasses.map((item) => (
                      <div key={item.id} className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-all">
                        <Checkbox
                          name={item.name}
                          label={item.name}
                          defaultChecked={selectedClasses.includes(item.id)}
                          onChange={(checked) => handleChangeClass(checked, item.id)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <ButtonThird
                      onClick={() => {
                        handleClear();
                        setisOpenMoreFilter(false);
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Clear
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={() => {
                        updateURL();
                        setisOpenMoreFilter(false);
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Apply
                    </ButtonPrimary>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };

  return (
    <div className="flex lg:space-x-4">
      <div className="hidden lg:block">
        {renderDesktopFilter()}
      </div>
      <div className="block lg:hidden">
        {renderMobileFilter()}
      </div>
    </div>
  );
};

export default TabFilters;
