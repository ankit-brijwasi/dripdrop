import { useEffect } from "react";

const useScrollLoader = (callback) => {
  useEffect(() => {
    let debounceTimer;

    const handleScroll = () => {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        if (isScrollAtBottom()) {
          callback();
        }
      }, 200);
    };

    const isScrollAtBottom = () => {
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;

      return scrollTop + windowHeight >= documentHeight;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callback]);
};

export default useScrollLoader;
