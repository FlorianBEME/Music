import React, { ReactElement } from "react";

interface Props {
  action: Function;
  text: String;
}

export default function CommonButton({ action, text }: Props): ReactElement {
  return (
    <div>
      <button
        onClick={() => {
          action();
        }}
        // text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {text}
      </button>
    </div>
  );
}
