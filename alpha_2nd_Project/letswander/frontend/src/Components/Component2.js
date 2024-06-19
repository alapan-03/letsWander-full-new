import swPic from "./../Assets/swiper-pic.jpg";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import URL from "./rootUrl";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cookies from "universal-cookie";
import url from "./rootUrl";
import CustomToast from "./CustomToast";

export default function Component2(props) {
  const cookie = new cookies();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showCustomToast2, setShowCustomToast2] = useState(false)

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  let token = cookie.get("token");

  const [data, setData] = useState(null);
  const stringWithoutQuotes = token && token.replace(/"/g, "");

  useEffect(() => {
    if (!token) {
      console.error("Token not found in localStorage");
      // return;
    }

    console.log(URL);

    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/api/v1/tours?name=${props.data}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${stringWithoutQuotes}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setData(result.data);
          props.apiData(result.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.data, token]);

  // useEffect(() => {
  // if (!token) {
  //   console.error("Token not found in localStorage");
  // }

  console.log(cookie.get("sessionId"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionId = cookie.get("sessionId");
        const tourId = cookie.get("tourId");

        if (!sessionId || !tourId) {
          console.error("Missing sessionId or tourId in cookies");
          return;
        }

        const response = await fetch(`${URL}/api/v1/users/verifyStripe2`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${stringWithoutQuotes}`,
          },
          body: JSON.stringify({ sessionId, tourId }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        localStorage.removeItem("hasShownToastSession");
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (cookie.get("sessionId")) {
      fetchData();
    }
  }, [URL, stringWithoutQuotes, cookie]);

  setTimeout(() => {
    cookie.remove("sessionId");
  }, 2000);

  // const notify = () => {
  useEffect(() => {
    const token = Cookies.get("token");
    const notificationShown = localStorage.getItem("notificationShown");

    if (token && !notificationShown) {
      // toast("Successfully logged in");
      localStorage.setItem("notificationShown", "true");
    } else if (!token && !notificationShown) {
      // toast("Successfully logged out!");
      localStorage.setItem("notificationShown", "true");
    }
  }, [token]);
  // }


  
  useEffect(() => {
    const handleSessionIdChange = () => {
      const currentSessionId = cookie.get("sessionId");
      const previousSessionId = localStorage.getItem("previousSessionId");

      if (currentSessionId && currentSessionId !== previousSessionId) {
        setShowCustomToast2(true);
        localStorage.setItem("previousSessionId", currentSessionId);

        // Hide the toast after 5 seconds
        setTimeout(() => {
          setShowCustomToast2(false);
        }, 5000);
      }
    };

    handleSessionIdChange(); // Check on initial load
    window.addEventListener("storage", handleSessionIdChange);

    return () => {
      window.removeEventListener("storage", handleSessionIdChange);
    };
  }, []);


  return (
    <>
      <div>
        {/* <button onClick={notify}>Notify</button> */}
        {showCustomToast2 && (
        <CustomToast message="Payment successful" isError={false}/>
      )}
      </div>

      <div className="s3-grid">
        <div className="s3-inner-cont">
          <div className="s3-g-item1">
            <p className="dom-txt">International</p>

            <Swiper
              autoplay={{
                delay: 5500,
                disableOnInteraction: false,
              }}
              spaceBetween={30}
              navigation={true}
              slidesPerView={
                windowWidth > 1300
                  ? 4
                  : windowWidth > 1050
                  ? 3
                  : windowWidth > 650
                  ? 2
                  : 1
              }
              modules={[Autoplay, Navigation]}
              className="mySwiper"
            >
              {data &&
                data.map(
                  (data) =>
                    !data.domestic && (
                      // <SwiperSlide onClick={()=>{props.dataId(data._id)}}>
                      <SwiperSlide>
                        <Link key={data._id} to={`${data._id}`}>
                          <div className="inner-sw-div">
                            <img src={data.image} />
                            <div className="inner-2-sw-div">
                              <p>{data.name}</p>
                              <div className="inner-2-sw-div2">
                                <p>Starting from</p>
                                <p>${data.price}</p>
                                {/* <p>{data.domestic && data.domestic}</p> */}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    )
                  //   </Link>
                )}
            </Swiper>
          </div>

          <div className="s3-g-item1">
            <p className="dom-txt">Domestic</p>
            <Swiper
              slidesPerView={
                windowWidth > 1300
                  ? 4
                  : windowWidth > 1050
                  ? 3
                  : windowWidth > 650
                  ? 2
                  : 1
              }
              autoplay={{
                delay: 5500,
                disableOnInteraction: false,
              }}
              spaceBetween={30}
              navigation={true}
              modules={[Autoplay, Navigation]}
              className="mySwiper"
            >
              {data &&
                data.map(
                  (data) =>
                    data.domestic && (
                      <SwiperSlide>
                        <Link key={data._id} to={`${data._id}`}>
                          <div className="inner-sw-div">
                            <img src={data.image} />
                            <div className="inner-2-sw-div">
                              <p>{data.name}</p>
                              <div className="inner-2-sw-div2">
                                <p>Starting from</p>
                                <p>${data.price}</p>
                                {/* <p>{data.domestic && data.domestic}</p> */}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    )
                )}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}
