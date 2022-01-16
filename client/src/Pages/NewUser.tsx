import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";

import { FETCH } from "../FETCH";
import { emitEvent } from "../components/common/socketio/SocketPublicComponent";

const NewUser = () => {
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("usInfoMusic")) {
      history.push("/app");
    }
    return () => {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pseudo, setPseudo] = useState(null);

  const enterInMusicRequest = async () => {
    const newUuid = uuidv4();
    axios
      .post(`${FETCH}/visitor`, {
        pseudo: pseudo,
        isNotAllowed: false,
        uuid: newUuid,
        countVoting: 0,
      })
      .then((res) => {
        let usInfoMusic = {
          id: res.data.id,
          uuid: res.data.uuid,
          pseudo: res.data.pseudo,
          uuidEvent: res.data.uuidEvent,
        };
        localStorage.setItem("usInfoMusic", JSON.stringify(usInfoMusic));
        emitEvent("update", "user-add", res.data);
        history.push("/app");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Music Request
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Renseigner un pseudonyme
              </span>
            </p>
          </div>
          <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              enterInMusicRequest().then(() => {
                history.push("/app");
              });
            }}
          >
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  pseudonyme
                </label>
                <input
                  onChange={(e: any) => {
                    setPseudo(e.target.value);
                  }}
                  id="pseudo"
                  name="pseudo"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Pseudo"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                Entrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
