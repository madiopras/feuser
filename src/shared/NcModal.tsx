"use client";

import React, { FC, Fragment, ReactNode, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "@/shared/ButtonClose";
import Button from "@/shared/Button";

export interface NcModalProps {
  renderContent: () => ReactNode;
  renderTrigger?: (openModal: () => void) => ReactNode;
  contentExtraClass?: string;
  contentPaddingClass?: string;
  triggerText?: ReactNode;
  modalTitle?: ReactNode;
  isOpen?: boolean;
  onCloseModal?: () => void;
  modalSubtitle?: string;
}

const NcModal: FC<NcModalProps> = ({
  renderTrigger,
  renderContent,
  contentExtraClass = "max-w-screen-xl",
  contentPaddingClass = "py-4 px-6 md:py-5",
  triggerText = "Open Modal",
  modalTitle = "Modal title",
  isOpen,
  onCloseModal,
  modalSubtitle,
}) => {
  let [isOpenState, setIsOpenState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function closeModal() {
    if (typeof isOpen === "boolean") {
      onCloseModal && onCloseModal();
    } else {
      setIsOpenState(false);
    }
  }

  function openModal() {
    if (typeof isOpen === "boolean") {
      onCloseModal && onCloseModal();
    } else {
      setIsOpenState(true);
    }
  }

  const isOpenModal = typeof isOpen === "boolean" ? isOpen : isOpenState;

  if (!mounted) return null;

  return (
    <div className="nc-NcModal">
      {renderTrigger && renderTrigger(openModal)}
      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/50 dark:bg-opacity-80" aria-hidden="true" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`inline-block w-full ${contentExtraClass} my-5 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-neutral-800 dark:border dark:border-neutral-700 shadow-xl rounded-2xl sm:my-8`}
              >
                <div className={contentPaddingClass}>
                  {modalTitle && (
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold text-neutral-900 dark:text-neutral-200 md:text-2xl"
                    >
                      {modalTitle}
                    </Dialog.Title>
                  )}
                  {modalSubtitle && (
                    <Dialog.Description
                      as="span"
                      className="text-sm text-neutral-500 dark:text-neutral-400"
                    >
                      {modalSubtitle}
                    </Dialog.Description>
                  )}
                  {renderContent()}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default NcModal;
