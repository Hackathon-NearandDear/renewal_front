import { Settings } from "react-slick";

export const sliderSettings: Settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  responsive: [
    {
      breakpoint: 9999,
      settings: {
        slidesToShow: 1.5,
        slidesToScroll: 1,
        arrows: true,
      },
    },
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      },
    },
  ],
};
