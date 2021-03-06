import React, { ReactElement } from "react";
import { Switch } from "@headlessui/react";

interface Props {
  checked: boolean;
  onchange: any;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function SwitchButton({
  checked,
  onchange,
}: Props): ReactElement {
  return (
    <Switch
      checked={checked}
      onChange={onchange}
      className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer  dark"
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute  w-full h-full rounded-md"
      />
      <span
        aria-hidden="true"
        className={classNames(
          checked ? "bg-indigo-600" : "bg-gray-200",
          "pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200"
        )}
      />
      <span
        aria-hidden="true"
        className={classNames(
          checked ? "translate-x-5" : "translate-x-0",
          "pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200"
        )}
      />
    </Switch>
  );
}
