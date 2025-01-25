import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import { NAVIGATION_DEMO } from "@/data/navigation";
import Link from "next/link";
import Collection from "@/components/Collection";

const TemplatesDropdown = () => {
  const renderContent = () => {
    return (
      <div className="w-full rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 text-sm relative bg-white dark:bg-neutral-900 py-6 px-4">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-medium text-neutral-800 dark:text-neutral-200 mb-4">
              Templates
            </h3>
            <div className="grid space-y-3">
              {NAVIGATION_DEMO.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                >
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {item.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <Collection />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="TemplatesDropdown">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "" : "text-opacity-90"}
                group px-3 py-1.5 border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 rounded-full inline-flex items-center text-sm text-gray-700 dark:text-neutral-300 font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span>Templates</span>
              <ChevronDownIcon
                className={`${
                  open ? "-rotate-180" : "text-opacity-70"
                } ml-2 h-4 w-4 text-neutral-400 group-hover:text-opacity-80 transition ease-in-out duration-150`}
                aria-hidden="true"
              />
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
              <Popover.Panel className="absolute left-1/2 z-50 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                {renderContent()}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default TemplatesDropdown;
