import { useState } from "react";

import IconButton from "@mui/material/IconButton";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

export default function Carousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const slidePrev = () => setActiveIndex(activeIndex - 1);
  const slideNext = () => setActiveIndex(activeIndex + 1);
  const syncActiveIndex = ({ item }) => setActiveIndex(item);

  return (
    <>
      <AliceCarousel
        items={items}
        responsive={{
          0: { items: 1 },
        }}
        disableButtonsControls
        activeIndex={activeIndex}
        onSlideChanged={syncActiveIndex}
      />
      <div className="b-refs-buttons">
        <IconButton
          onClick={slidePrev}
          style={{ position: "absolute", top: "50%", left: 10 }}
          disabled={activeIndex <= 0}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton
          onClick={slideNext}
          style={{ position: "absolute", top: "50%", right: 10 }}
          disabled={activeIndex === items.length - 1}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </>
  );
}
