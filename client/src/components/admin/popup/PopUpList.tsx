import Accordion from "../../common/Accordion";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FETCH } from "../../../FETCH";

const MySwal = withReactContent(Swal);

function useInterval(callback: Function, delay: number) {
  const savedCallback: any = useRef();
  // Remember the latest function.
  useEffect(() => {
    console.log(savedCallback);
    savedCallback.current = callback;
    console.log(callback);
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current !== undefined) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

type popType = {
  id: number;
  title: string;
  text_content: string;
  expire_at: string;
};

type PopUpProps = {
  popIsLoading: boolean;
  pops: any;
  refetch: Function;
};

function PopUpList({ popIsLoading, pops, refetch }: PopUpProps) {
  const [dateNow, setdateNow] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    setdateNow(new Date());
    return () => {
      setdateNow({});
    };
  }, []);

  useInterval(() => {
    let date = new Date();
    setdateNow(date);
  }, 5000);

  const deleteItem = (id: number) => {
    console.log(id);
    MySwal.fire({
      title: "Confirmation",
      text: "Êtes-vous sur de vouloir supprimer l'annonce?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je suis sur !",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${FETCH}/pop/${id}`, {
            headers: {
              "x-access-token": token,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              refetch();
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  };

  return (
    <div className=" bg-white dark:bg-gray-700 shadow sm:rounded-lg px-4 py-5 sm:p-6">
      {popIsLoading
        ? pops.map((pop: popType) => {
            return (
              <Accordion
                deleteItem={() => {
                  deleteItem(pop.id);
                }}
                key={pop.id}
                title={pop.title}
                text_content={pop.text_content}
                status={
                  dateNow
                    ? new Date(pop.expire_at) > dateNow
                      ? "en cours"
                      : "expiré"
                    : null
                }
              />
            );
          })
        : null}
    </div>
  );
}

export default PopUpList;
