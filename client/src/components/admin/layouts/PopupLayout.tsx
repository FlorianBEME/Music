import PopUpForm from "../popup/PopUpForm";
import PopUpList from "../popup/PopUpList";
import axios from "axios";
import { FETCH } from "../../../FETCH";
import { useEffect, useState } from "react";

export default function PopupLayout() {
  const [pops, setPops] = useState([]);
  const [popIsLoading, setPopIsLoading] = useState(false);

  const fetchPopUp = () => {
    axios
      .get(`${FETCH}/pop`)
      .then((res) => {
        setPopIsLoading(true);
        setPops(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchPopUp();
  }, []);

  return (
    <div className="space-y-5">
      <PopUpForm
        submit={() => {
          fetchPopUp();
        }}
      />
      <PopUpList pops={pops} popIsLoading={popIsLoading} />
    </div>
  );
}
