export interface IAppProps {}

export function App(props: IAppProps) {
  return (
    <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Texte Bannière
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
          <p>Modifier le texte de la bannière</p>
        </div>
        <div className="">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <fieldset className="space-y-5">
              <legend className="sr-only">Notifications</legend>
              <div className="relative flex items-start">
                <div className="flex items-center h-5"></div>
              </div>
            </fieldset>
            <button
              type="submit"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-5  sm:w-auto sm:text-sm"
            >
              Modifier
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
