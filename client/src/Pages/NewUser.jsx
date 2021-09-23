import { useState } from "react";
import axios from "axios";
import { FETCH } from "../FETCH";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";

const NewUser = () => {
  let history = useHistory();

  const [pseudo, setPseudo] = useState(null);
  const enterInMusicRequest = () => {
    const newUuid = uuidv4();
    axios
      .post(`${FETCH}/visitor`, {
        pseudo: pseudo,
        isNotAllowed: false,
        uuid: newUuid,
      })
      .then((res) => {
        localStorage.setItem("usInfoMusic", res.data.uuid);
        history.push("/");
      })
      .catch(() => {});
    // vide l'input
  };

  return (
    <div>
      <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <img
              class="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Music Request
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              <a
                href="#"
                class="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Renseigner un pseudonyme
              </a>
            </p>
          </div>
          <div class="mt-8 space-y-6">
            <input type="hidden" name="remember" value="true" />
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="email-address" class="sr-only">
                  pseudonyme
                </label>
                <input
                  onChange={(e) => {
                    setPseudo(e.target.value);
                  }}
                  id="pseudo"
                  name="pseudo"
                  type="text"
                  autocomplete="pseudo"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Pseudo"
                />
              </div>
            </div>

            <div>
              <button
                onClick={() => {
                  enterInMusicRequest();
                }}
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                Entrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
