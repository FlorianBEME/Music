import React, { ReactElement } from "react";

interface Props {
  action: Function;
}

export default function AllDeleteButton({ action }: Props): ReactElement {
  return (
    <div>
      <button
        onClick={() => {
          action();
        }}
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md dark:text-red-100 dark:bg-red-700 dark:hover:bg-red-900   text-red-700  bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Tout supprimer
      </button>
    </div>
  );
}
