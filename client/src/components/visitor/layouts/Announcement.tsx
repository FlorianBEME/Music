import { FETCH } from "../../../FETCH";
import axios from "axios";
import { useEffect, useState } from "react";
import Accordion from "../../common/Accordion";
import { subscribeToSocket } from "../../common/socket";

export interface IAppProps {}

export function Announcement(props: IAppProps) {
  const [pops, setPops] = useState([]);
  const [isLoadingPop, setIsLoadingPop] = useState(false);

  const fetchPop = () => {
    axios
      .get(`${FETCH}/pop`)
      .then((res) => {
        setPops(res.data);
        setIsLoadingPop(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchPop();
  }, []);

  // socket;
  useEffect(() => {
    subscribeToSocket((args: string) => {
      if (args === "pop") {
        console.log("je recoit");
        fetchPop();
      }
    });
  }, []);

  console.log(pops);

  return (
    <div className="w-full">
      {isLoadingPop ? (
        pops.length > 0 ? (
          pops.map((pop: any) => {
            return (
              <div key={pop.id}>
                <Accordion
                  date={pop.send_at}
                  title={pop.title}
                  text_content={pop.text_content}
                  status={null}
                  deleteItem={undefined}
                />
              </div>
            );
          })
        ) : (
          <div className="dark:text-white text-black flex justify-center">
            {" "}
            Aucune annonces
          </div>
        )
      ) : null}
    </div>
  );
}
