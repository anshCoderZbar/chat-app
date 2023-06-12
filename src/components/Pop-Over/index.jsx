import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";

export const PopOver = ({ isOpen, setIsOpen, children }) => {
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div className="relative  -mx-6" ref={popoverRef}>
      <Popover className="flex justify-center w-screen">
        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="z-10 mt-3 w-screen sm:min-w-min max-w-sm lg:max-w-3xl">
            <div className="overflow-hidden border border-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="gap-8 px-5 py-5 ">{children}</div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
};
