"use client";

import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contentExtraClass?: string;
  contentPaddingClass?: string;
  children: React.ReactNode;
  animation?: string;
}

const Modal: React.FC<Props> = ({
  isOpen = false,
  onClose,
  children,
  contentExtraClass = "max-w-lg",
  contentPaddingClass = "p-6",
  animation = "bottom",
}) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useClickAway(modalRef, () => {
    if (isOpen) {
      onClose();
    }
  });

  const renderContent = () => {
    if (animation === "bottom") {
      return (
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className={`relative z-50 mx-auto ${contentExtraClass}`}
        >
          <div
            className={`${contentPaddingClass} bg-white dark:bg-neutral-800 rounded-2xl`}
          >
            {children}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`relative z-50 mx-auto ${contentExtraClass}`}
      >
        <div
          className={`${contentPaddingClass} bg-white dark:bg-neutral-800 rounded-2xl`}
        >
          {children}
        </div>
      </motion.div>
    );
  };

  if (!mounted) return null;

  return (
    <Dialog
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/40"
        aria-hidden="true"
      />
      {renderContent()}
    </Dialog>
  );
};

export default Modal;
