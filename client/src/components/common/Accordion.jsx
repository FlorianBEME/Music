import { useState } from "react";
import { Transition } from "@tailwindui/react";
import { AiOutlineArrowDown } from "react-icons/ai";
import { AiOutlineArrowUp } from "react-icons/ai";

function Accordion({ title, text_content, status }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <section className="">
        <article className="border-b dark:bg-gray-700">
          <div className="">
            <header
              className="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="dark:text-white font-thin text-xl">
                {title} ({status})
              </span>

              <div className="text-black dark:text-white rounded-full border border-grey w-7 h-7 flex items-center justify-center">
                {/* <!-- icon by feathericons.com --> */}
                {isOpen ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
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
              {/* <header className="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
                    <span className="text-indigo font-thin text-xl">
                    Lorem ipsum dolor sit amet
                    </span>
                    <div className="rounded-full border border-indigo w-7 h-7 flex items-center justify-center bg-indigo">
                    <svg
                        aria-hidden="true"
                        data-reactid="281"
                        fill="none"
                        height="24"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewbox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                    </div>
                </header> */}
              <div className="px-8 py-5 p text-grey-darkest">
                <p>{text_content}</p>
              </div>
            </div>
          </article>
        </Transition>
      </section>
    </div>
  );
}

export default Accordion;
