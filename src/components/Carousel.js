import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

export default function Carousel({ items, disableDotsControls }) {
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
        disableDotsControls={disableDotsControls}
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

Carousel.propTypes = {
  items: PropTypes.array,
  disableDotsControls: PropTypes.bool,
};

Carousel.defaultProps = {
  disableDotsControls: false,
  items: [],
};

export const RenderCarousel = ({ images, detailed }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const imgEl = images.map((file, index) => (
      <CardMedia
        key={index}
        component="img"
        height={detailed ? "796px" : "500px"}
        width={detailed ? "700px" : "500px"}
        image={file}
        alt="post caption"
        sx={{ objectFit: "cover" }}
      />
    ));
    setItems(imgEl);
  }, [images, detailed]);

  return <Carousel disableDotsControls={true} items={items} />;
};
