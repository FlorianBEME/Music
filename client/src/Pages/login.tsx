import { useState } from "react";
import Axios from "axios";
import { FETCH } from "../FETCH";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();
export default function Login() {
  const [UserName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const notifyError = () => {
    toast.error("Password ou Nom invalide!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const login = async (e: any) => {
    e.preventDefault();
    if (UserName && userPassword) {
      await Axios.post(`${FETCH}/login`, {
        user_name: UserName,
        user_password: userPassword,
      })
        .then((res) => res.data)
        .then((data) => {
          let infoUser = JSON.stringify(data.result[0]);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", infoUser);
          document.location.reload();
        })
        .catch((err) => {
          console.error(err);
          notifyError();
        });
    } else {
      notifyError();
    }
  };

  const onChangeName = (e: any) => {
    setUserName(e.target.value);
  };
  const onChangePassword = (e: any) => {
    setUserPassword(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connection
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              login(e);
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Nom
              </label>
              <div className="mt-1">
                <input
                  onChange={(e) => {
                    e.preventDefault();
                    onChangeName(e);
                  }}
                  id="nom"
                  name="nom"
                  type="nom"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  onChange={(e) => {
                    onChangePassword(e);
                  }}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
