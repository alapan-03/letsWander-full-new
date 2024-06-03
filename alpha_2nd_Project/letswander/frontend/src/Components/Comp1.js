import { useEffect, useState, createContext, useContext } from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import Sec1 from "./Sec1";
import Sec2 from "./Sec2";
import Sec3 from "./Sec3";
import Sec4 from "./Sec4";
import Login from "./Login";
import Cookies from "universal-cookie";
import URL from "./rootUrl";
import Navbar from "./Navbar";
import Component1 from "./Component1";

// export const UserContext = createContext()

export default function Comp1(props) {
  const cookies = new Cookies();
  let token = null;
  token = cookies.get("token");

  // const [data, setData] = useState(null);
  const stringWithoutQuotes = token?.replace(/"/g, "");
  console.log(stringWithoutQuotes);

  const { dataId } = useParams();

  cookies.set("tourId", dataId);

  // console.log(dataId)

  const user = useContext(UserContext);

  // const [dataAvailable, setDataAvailable] = useState(null)
  let isData = cookies.get("token") != null ? true : false;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/tours/${dataId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${stringWithoutQuotes}`, // Include the token in the Authorization header
          },
        });
        if (response.ok) {
          const result = await response.json();
          // console.log(result.message)
          // console.log(result)
          cookies.set("guide1", result.message.guides[0]);
          cookies.set("guide2", result.message.guides[1]);
          setData(result.message);
        }

        console.log(cookies.get("token"));

        setTimeout(() => {
          if (cookies.get("token") != null) {
            isData = true;
          } else {
            isData = false;
          }
        }, 100);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataId]);

  // console.log(token)

  console.log(isData);

  // setTimeout(() => {

  return (
    <>
      {isData ? (
        <div>
          <Navbar />
          {/* <Component1/> */}
          <Sec1 data={data} />
          <Sec2 data={data} />
          <Sec3 data={data} />
          <Sec4 data={data} />
        </div>
      ) : (
        <Login />
      )}
    </>
  );
  // }, 100);
}
