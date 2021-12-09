import { Fragment } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { NavLink } from "react-router-dom";
import AdminRoutes from "../../router/listRoute/AdminRoutes";
import { useHistory } from "react-router-dom";
import ThemeSelect from "../common/ThemeSelect";

const AdminNavBar = () => {
  let history = useHistory();

  const disconect = () => {
    localStorage.removeItem("token");
    history.push("/");
  };

  return (
    <Disclosure
      as="nav"
      className="bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-700"
    >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {AdminRoutes.filter((item) => item.redirect === false).map(
                    (item: any) => (
                      <NavLink
                        to={item.path}
                        key={item.name}
                        className="inline-flex items-center px-1 pt-1 border-b-2 border-gray-500 text-sm font-medium dark:text-white"
                        activeClassName="dark:border-white dark:text-white border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </NavLink>
                    )
                  )}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                <ThemeSelect />
                <button
                  onClick={() => {
                    disconect();
                  }}
                  type="button"
                  className="bg-white dark:bg-transparent dark:text-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Deconnexion
                  {/* <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
                </button>
              </div>
              {/* Mobile menu button */}
              <div className="w-full flex items-center sm:hidden justify-between">
                <Disclosure.Button className="bg-white dark:bg-gray-600 dark:text-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                <ThemeSelect />
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
                <div className="mt-3 space-y-1 flex flex-col items-start">
                  {AdminRoutes.filter((item) => item.redirect === false).map(
                    (item) => (
                      <Disclosure.Button className="">
                        <NavLink
                          key={item.name}
                          to={item.path}
                          className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        >
                          {item.name}
                        </NavLink>
                      </Disclosure.Button>
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
