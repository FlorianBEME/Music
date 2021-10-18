import Accordion from "../../common/Accordion";
import { useState, useEffect, useRef } from "react";

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
};

function PopUpList({ popIsLoading, pops }: PopUpProps) {
  const [dateNow, setdateNow] = useState({});

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

  return (
    <div className=" bg-white dark:bg-gray-700 shadow sm:rounded-lg px-4 py-5 sm:p-6">
      {popIsLoading
        ? pops.map((pop: popType) => {
            return (
              <Accordion
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
