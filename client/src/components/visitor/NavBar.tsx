/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import ThemeSelect from "../common/ThemeSelect";
import { TextScrollingBanner } from "./textScrollingBanner";

type NavBarProps = {
  active_music_request: boolean;
  active_wall_picture: boolean;
  changeComponent: Function;
  textBanner: String | null;
};

export default function NavBar({
  active_music_request,
  changeComponent,
  active_wall_picture,
  textBanner,
}: NavBarProps) {
  return (
    <Popover className=" ">
      <div className="md:flex px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
        {/* mobile view */}
        <div className="grid grid-cols-6 gap-2 -my-2 md:hidden  w-full">
          <div className="flex justify-center">
            <Popover.Button className="w-12/12 h-11  bg-indigo-600 dark:bg-gray-600 rounded-md p-2 inline-flex items-center justify-center text-white dark:text-white hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <div className="col-span-4 w-12/12  ">
            {textBanner ? <TextScrollingBanner text={textBanner} /> : null}
          </div>
          <div className="flex justify-center items-center">
            <ThemeSelect />
          </div>
        </div>

        {/* desktop view */}
        <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
          <Popover.Group as="nav" className="flex space-x-10">
            {active_music_request ? (
              <div
                onClick={() => {
                  changeComponent("music");
                }}
                className="text-base font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                Music Request
              </div>
            ) : null}
            {active_wall_picture ? (
              <div
                onClick={() => {
                  changeComponent("picture");
                }}
                className="text-base font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                Wall Picture
              </div>
            ) : null}
            <div
              onClick={() => {
                changeComponent("announcement");
              }}
              className="text-base font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              Annonces
            </div>
          </Popover.Group>
          <div className="flex items-center md:ml-12 cursor-pointer">
            <ThemeSelect />
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="z-50 absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
        >
          <div className="dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50 dark:divide-gray-600">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                {/* <div>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Workflow"
                  />
                </div> */}
                <div className="-mr-2 flex justify-between w-full items-center">
                  <Popover.Button className=" dark:text-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className="py-6 px-5">
              <div className="flex flex-col space-y-3">
                {active_music_request ? (
                  <div
                    className="text-base text-gray-900 hover:text-gray-700 dark:text-white cursor-pointer"
                    onClick={() => {
                      changeComponent("music");
                    }}
                  >
                    <Popover.Button>Music Request</Popover.Button>
                  </div>
                ) : null}
                {active_wall_picture ? (
                  <div
                    className="text-base  text-gray-900 hover:text-gray-700 dark:text-white cursor-pointer"
                    onClick={() => {
                      changeComponent("picture");
                    }}
                  >
                    <Popover.Button> Wall Picture</Popover.Button>
                  </div>
                ) : null}
                <div
                  className="text-base  text-gray-900 hover:text-gray-700 dark:text-white cursor-pointer"
                  onClick={() => {
                    changeComponent("announcement");
                  }}
                >
                  <Popover.Button> Annonces</Popover.Button>
                </div>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
