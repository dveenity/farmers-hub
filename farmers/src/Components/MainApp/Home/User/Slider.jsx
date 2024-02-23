// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./Slider.css";

// import required modules
import { Autoplay, Pagination } from "swiper/modules";

//import icons
import { IoMdSpeedometer } from "react-icons/io";
import { FaHandshake } from "react-icons/fa";
import { MdOutlineSecurityUpdateGood } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const Slider = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 1000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="mySwiper">
      <SwiperSlide>
        <div>
          <IoMdSpeedometer />
          <span>Fast Delivery</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div>
          <FaHandshake />
          <span>Reliable</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div>
          <MdOutlineSecurityUpdateGood />
          <span>Order Status</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div>
          <IoChatboxEllipsesOutline />
          <span>Chat with sellers</span>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Slider;
