import { useState, useReducer } from "react";
import emi from "./../Assets/emi-pay-list.svg";
import Cookies from "universal-cookie";
import AdditionalDetails from "./AdditionalDetails";

export default function Sec1(props) {
  const cookies = new Cookies();

  const [isBooked, setIsBooked] = useState(false);
  const [result2, setResult2] = useState([]);

  
  function setIsBook() {
    // cookies.set("isBookPressed", true)
    setIsBook(true);
  }

  let flag = false;
  function dispDetails() {
    let duck = document.getElementsByClassName("detail-outer")[0];
    let sec1 = document.getElementsByClassName("sec-1")[0];
    let body = document.querySelector("body");
    result2 && setResult2(props.data);

    if (!flag) {
      duck.style.display = "none";
      duck.style.position = "fixed";
      duck.style.zIndex = "10";
      duck.style.display = "flex";
      duck.style.justifyContent = "center";
      duck.style.alignItems = "center";
    //   body.style.display = "none"
      flag = !flag;
    } else {
      duck.style.display = "none";
      flag = !flag;
    }
  }

  return (
    <>
      {props.data && (
        <div className="sec-1">
          <div className="buynow-outer-cont">
            <div className="s1-cont1">
              <p>Let's enjoy {props.data.name}</p>
              <p>
                {props.data.duration - 1} nights / {props.data.duration} days
              </p>
            </div>

            <button onClick={dispDetails}>Book</button>
          </div>

          <div className="s1-cont2">
            <div>
              <p>Starting From</p>
              <div>
                <p>
                  <s>${props.data.price + 170}</s>
                </p>
                <p>${props.data.price}</p>
              </div>
              <p>Per person on Twin Sharing</p>
              <p>
                <img src={emi}></img>Easy No Cost EMI Starts from $
                {(props.data.price / 12).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="detail-outer">
        <AdditionalDetails data={result2} />
      </div>
    </>
  );
}
