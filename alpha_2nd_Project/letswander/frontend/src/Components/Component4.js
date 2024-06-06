import React, { useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

export default function Component4(props) {
  const [uniqueThemes, setUniqueThemes] = useState(new Set());

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

  useEffect(() => {
    // Extract unique themes from apiData
    const themes = props.apiData?.map((data) => data.theme);
    const uniqueThemesSet = new Set(themes);

    // Update state with unique themes
    setUniqueThemes(uniqueThemesSet);
  }, [props.apiData]);

  return (
    <>
      <div className="section-4">
        <p className="exp-themes">Explore Themes</p>
        {/* <div className="bestSeller"> */}

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
          {[...uniqueThemes].map((theme) => (
            <SwiperSlide key={theme}>
              <div>
                <p className="themes">{theme}</p>
                <br />
                {props.apiData
                  .filter((data) => data.theme === theme)
                  .slice(0, 1)
                  .map((data) => (
                    <Link key={data._id} to={`${data._id}`}>
                      <div key={data._id}>
                        <img src={data.image} alt={theme} />
                        <br />
                        <p>
                          {/* Add additional details or description if needed */}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
