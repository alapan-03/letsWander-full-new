import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/autoplay";
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from "react-router-dom";

export default function Component3(props) {

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
  

    return(
        <>
        <div className="section-3">
                <p>Best Seller </p>
            {/* <div className="bestSeller"> */}
            
            <Swiper slidesPerView={windowWidth > 900 ? 2 : 1} autoplay={{
                         delay: 5500,
                         disableOnInteraction: false,
                        }}
                        spaceBetween={30} navigation={true} modules={[Autoplay,Navigation]} className="mySwiper">

                {

                    
                // props.apiData[0]?.bestSelling && 
                props.apiData?.map((data)=>(
                    data.bestSelling && 
                    <SwiperSlide className="swiperBestSeller">
                {/* <div> */}
                <Link key={data._id} to={`${data._id}`}> 
                    <img src={data.bestSelling && data.image}></img><br/>
                    <span>{data.bestSelling && data.name}</span>
                </Link>
                    
                {/* </div> */}
                </SwiperSlide>
                ))}

                </Swiper>

            {/* </div> */}
        </div>
        </>
    )
}