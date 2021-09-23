import React from "react";
import { Fragment } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";
import AdminRoutes from "../../router/listRoute/AdminRoutes";
import { useHistory } from "react-router-dom";

const AdminNavBar = () => {
  let history = useHistory();

  const disconect = () => {
    localStorage.removeItem("token");
    history.push("/");
  };

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                {/*logo haut gauche*/}
                {/*<div className="flex-shrink-0 flex items-center">*/}
                {/*<img*/}
                {/*    className="block lg:hidden h-8 w-auto"*/}
                {/*    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"*/}
                {/*    alt="Workflow"*/}
                {/*/>*/}
                {/*<img*/}
                {/*    className="hidden lg:block h-8 w-auto"*/}
                {/*    src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"*/}
                {/*    alt="Workflow"*/}
                {/*/>*/}
                {/*</div>*/}

                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {AdminRoutes.filter((item) => item.redirect === false).map(
                    (item) => (
                      <NavLink
                        to={item.path}
                        key={item.name}
                        className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium "
                        activeClassName="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </NavLink>
                    )
                  )}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  onClick={() => {
                    disconect();
                  }}
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Deconnexion
                  {/* <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
                </button>
                {/* Profile dropdown */}
                {/* <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </Menu.Button>
                  </div> */}
                {/* <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={
                                active
                                  ? "bg-gray-100"
                                  : "block px-4 py-2 text-sm text-gray-700"
                              }
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition> */}
                {/* </Menu> */}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Disclosure.Panel className="sm:hidden">
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="mt-3 space-y-1">
                  {AdminRoutes.filter((item) => item.redirect === false).map(
                    (item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        {item.name}
                      </NavLink>
                    )
                  )}
                  <div
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      disconect();
                    }}
                  >
                    Deconnexion
                  </div>
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default AdminNavBar;
