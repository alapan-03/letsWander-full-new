import { SwiperSlide } from "swiper/react";

import { Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";

export default function Sec2(props) {
  // console.log(props.data.inclusions)
  return (
    <>
      <div className="sec2">
        <div>
          <div>
            {props.data && (
              <Swiper
                slidesPerView={1}
                autoplay={{
                  delay: 5500,
                  disableOnInteraction: false,
                }}
                spaceBetween={30}
                navigation={true}
                modules={[Autoplay, Navigation]}
                className="mySwiper mySwiper-sec2"
              >
                {props.data.images &&
                  props.data.images.map((imgs) => (
                    <SwiperSlide className="sec2-swiper">
                      <img src={imgs} />
                    </SwiperSlide>
                  ))}
              </Swiper>
            )}
          </div>
        </div>

        <div className="overview-cont">
          {/* <div> */}
          <div className="overview">
            <p>👉 Package Overview</p>
            <p>{props.data.overview}</p>
          </div>

          {/* </div> */}

          <div className="sec2-info">
            <div>
              <p>
                🕒Duration: &nbsp;{props.data.duration - 1} nights /{" "}
                {props.data.duration} days
              </p>
              <p>
                <span>📌&nbsp;Places to visit:</span>
                <br></br>
                {props.data.places &&
                  props.data.places.map((pl, index) => (
                    <span key={index}>
                      {props.data.placeDuration &&
                        props.data.placeDuration[index] && (
                          <>
                            <span>
                              {" "}
                              &nbsp;{props.data.placeDuration[index]}N&nbsp;
                            </span>
                            <span>{pl}&nbsp; | &nbsp;</span>
                          </>
                        )}
                    </span>
                  ))}
              </p>
              <p></p>
              <p></p>
            </div>

            <div>
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
