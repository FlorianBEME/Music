import { useState } from "react";
import { Transition } from "@tailwindui/react";
import { AiOutlineArrowDown } from "react-icons/ai";
import { AiOutlineArrowUp } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import moment from "moment";

type AccordionProps = {
  title: string;
  text_content: string;
  status: string | null;
  deleteItem: any;
  date: Date | null;
};

function Accordion({
  title,
  text_content,
  status,
  deleteItem,
  date,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (date != null) {
    console.log(date.getTime);
  }

  return (
    <section className="min-w-7xl">
      <article className="border-b dark:bg-gray-700 w-full">
        <div className="w-full">
          <header className="flex justify-between items-center p-5 pl-8 pr-8 select-none">
            <span className="dark:text-white font-thin text-xl">
              {title} {status ? `(${status})` : null}
            </span>
            <div className="flex space-x-2 items-center">
              <div className="text-black dark:text-gray-300 text-xs">
                {date ? moment(date).format("DD-MM-YYYY HH:mm:ss") : null}
              </div>
              {deleteItem === undefined ? null : (
                <div
                  onClick={() => {
                    deleteItem();
                  }}
                  className="text-black dark:text-white w-7 h-7 flex items-center justify-center cursor-pointer"
                >
                  {/* <!-- icon by feathericons.com --> */}
                  <BsFillTrashFill size={20} />
                </div>
              )}

              <div
                onClick={() => setIsOpen(!isOpen)}
                className="text-black dark:text-white rounded-full border border-grey w-7 h-7 flex items-center justify-center cursor-pointer "
              >
                {/* <!-- icon by feathericons.com --> */}
                {isOpen ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
              </div>
            </div>
          </header>
        </div>
      </article>

      <Transition
        show={isOpen}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <article className="border-b dark:bg-gray-600 dark:text-gray-100">
          <div className="">
            <div className="px-8 py-5 p text-grey-darkest">
              <p>{text_content}</p>
            </div>
          </div>
        </article>
      </Transition>
    </section>
  );
}

export default Accordion;
