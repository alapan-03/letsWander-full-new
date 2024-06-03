import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import search from "./../Assets/search.png";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { useReducer } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import Navbar from "./Navbar";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyD94aJZKNp1dzOjRyD3cMtLxcHzSyaWE5U",
  authDomain: "letswander-6110c.firebaseapp.com",
  projectId: "letswander-6110c",
  storageBucket: "letswander-6110c.appspot.com",
  messagingSenderId: "745673402765",
  appId: "1:745673402765:web:a103e63d0e25a86311b5c4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Component1(props) {
  let cookies = new Cookies();
  const photo = cookies.get("photo");

  // console.log(photo)

  const [data, setData] = useState("");
  const [search, setSearch] = useState();
  const [filteredData, setFilteredData] = useState(data);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  const userName = cookies.get("username");
  // console.log(props.apiData[0])

  const signOutFunc = async () => {
    try {
      await signOut(auth);
      console.log("Signed out");
      cookies.remove("token");
      cookies.remove("photo");
      cookies.remove("username");
      localStorage.removeItem("userName");
      window.location.reload();
      localStorage.removeItem("notificationShown");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  // console.log(search)

  //     let filter;

  //     const handleSearchChange = (e) => {
  //         const searchValue = e.target.value.toLowerCase();
  //         setSearch(searchValue);

  // filter = props?.apiData?.filter(el =>
  //     el.name.toLowerCase().startsWith(search) || el.price.toString().includes(search)

  // )
  //     // setFilteredData(filter)
  //     }

  // const filter = props.apiData?.filter((dataa) =>
  //     dataa.name
  //       ?.toLowerCase()
  //       .replace(/\s+/g, "")
  //       .includes(search?.toLowerCase().replace(/\s+/g, ""))
  //   );

  useEffect(() => {
    if (search?.trim() === "") {
      setFilteredData([]);
    } else if (props.apiData) {
      const filter = props?.apiData?.filter((data) =>
        data?.name
          ?.toLowerCase()
          .replace(/\s+/g, "")
          .includes(search?.toLowerCase().replace(/\s+/g, ""))
      );
      setFilteredData(filter);
    }
  }, [search, props.apiData]);

  console.log(filteredData);
  return (
    <div>
      <div className="section-2">
        <Navbar />

        <div className="s2-cont-outer">
          <div className="s2-cont">
            <p className="s2-cont-p">
              It is Better to Travel Well Than to Arrive
            </p>
            <div className="searchBar">
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                className="search"
                placeholder="Hey traveller, where do you want to go?"
              ></input>
              {/* <button>
                <img src={search} />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="searched-result-cont">
        {filteredData.length > 0 && <p className="res-txt">Searched Results</p>}
        {filteredData && (
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
            {filteredData &&
              filteredData.length > 0 &&
              filteredData.map(
                (data) => (
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
                            <p>{data.domestic && data.domestic}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                )
                //   </Link>
              )}
          </Swiper>
        )}
      </div>
    </div>
  );
}
