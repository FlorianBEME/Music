import Accordion from "../../common/Accordion";
import { useState, useEffect, useRef } from "react";

function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function PopUpList({ popIsLoading, pops }) {
  const [dateNow, setdateNow] = useState();

  useEffect(() => {
    setdateNow(new Date());
    return () => {
      setdateNow();
    };
  }, []);

  useInterval(() => {
    setdateNow(new Date());
  }, 5000);

  return (
    <div className=" bg-white dark:bg-gray-700 shadow sm:rounded-lg px-4 py-5 sm:p-6">
      {popIsLoading
        ? pops.map((pop) => {
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
