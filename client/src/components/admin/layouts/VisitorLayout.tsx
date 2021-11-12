import { useEffect, useState } from "react";
import axios from "axios";
import { FETCH } from "../../../FETCH";
import Switch from "@material-ui/core/Switch";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { emitEvent, subscribeToSocket } from "../../common/socket";

const MySwal = withReactContent(Swal);

const VisitorLayout = () => {
  const token = localStorage.getItem("token");

  const [visitorList, setVisitorList] = useState<any>([]);

  // Fetch liste de visitor
  const fetchData = () => {
    axios
      .get(`${FETCH}/visitor`)
      .then((res) => {
        setVisitorList(res.data);
      })
      .catch(function (erreur) {
        console.error(erreur);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    subscribeToSocket((args: string) => {
      if (args === "userupdate" || args === "visitorallowed") {
        fetchData();
      }
    });
  }, []);

  // Suppression de la musique
  // const handleDelete = (id) => {
  //   MySwal.fire({
  //     title: `Êtes-vous sûr de vouloir supprimer cette chanson?`,
  //     showCancelButton: true,
  //     confirmButtonText: "Valider",
  //     cancelButtonText: "Annuler",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       axios
  //         .delete(`${FETCH}/currentsongs/${id}`, {
  //           headers: {
  //             "x-access-token": token,
  //           },
  //         })
  //         .then(() => {
  //           Swal.fire("Suprimée!", "", "success");
  //         })
  //         .catch(function (error) {
  //           Swal.fire("Erreur!", "", "error");
  //         });
  //     }
  //   });
  // };

  const handleAllowed = (id: number) => {
    MySwal.fire({
      title: `Êtes-vous sûr de vouloir modifier la permission de ce visiteur ?`,
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        const index = visitorList.findIndex(
          (visitor: any) => id === visitor.id
        );
        const status = visitorList[index].isNotAllowed;

        axios
          .put(
            `${FETCH}/visitor/${id}`,
            { isNotAllowed: status === 1 ? 0 : 1 },
            {
              headers: {
                "x-access-token": token,
              },
            }
          )
          .then(() => {
            emitEvent("update", "visitorallowed");
            fetchData();
            Swal.fire("Modifié!", "", "success");
          })
          .catch(function (error) {
            Swal.fire("Erreur!", "", "error");
          });
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="w-full">
        <div className="flex justify-between mb-5">
          {/* bandeau Haut de tableau */}
        </div>
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr className="text-gray-500 dark:text-gray-50">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Pseudo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Uuid
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                  >
                    Vote
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                  >
                    Submit
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-400 dark:divide-white divide-y divide-gray-200">
                {visitorList.map((visitor: any) => (
                  <tr key={visitor.id}>
                    <td className=" py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium dark:text-white text-gray-900">
                            {visitor.pseudo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className=" py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium dark:text-white text-gray-900">
                            {visitor.uuid}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className=" py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="">
                          <div className="text-sm font-medium dark:text-white text-gray-900">
                            {visitor.countVoting}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className=" py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="">
                          <div className="text-sm font-medium dark:text-white text-gray-900">
                            {visitor.countsubmit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className=" py-4 whitespace-nowrap ">
                      <div className="flex items-center justify-center flex-wrap">
                        {/* <div
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer mx-2 my-1"
                          onClick={() => handleDelete(visitor.id)}
                        >
                          <BsFillTrashFill size={24} />
                        </div> */}
                        <div
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer mx-2 my-1"
                          onClick={() => handleAllowed(visitor.id)}
                        >
                          <Switch
                            checked={visitor.isNotAllowed ? false : true}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorLayout;
