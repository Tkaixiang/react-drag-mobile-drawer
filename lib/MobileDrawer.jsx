import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { convertToPixels } from "./utils/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./MobileDrawer.css";

export const MobileDrawer = ({
  peakHeight = "200px",
  closeThreshold = "20px",
  open = false,
  onRequestClose,
  className,
  children,
}) => {
  const drawerRef = useRef(null);
  const containerRef = useRef(null);
  const shouldClose = useRef(false);
  const shouldAppear = useRef(false);
  const initialY = useRef(0);
  const peakHeightPx = useRef(0);
  const closeThresholdPx = useRef(0);
  const [drawerAnimate, setDrawerAnimate] = useState({ opacity: 0, bottom: 0 });
  const [maximumScroll, setMaximumScroll] = useState(0);

  useLayoutEffect(() => {
    if (!drawerRef.current || !containerRef.current) return;

    peakHeightPx.current = convertToPixels(peakHeight, containerRef.current);
    closeThresholdPx.current = convertToPixels(
      closeThreshold,
      containerRef.current,
    );
    initialY.current = containerRef.current.offsetHeight - peakHeightPx.current;

    getMaximumUpperScroll();
    setToPeekValue();
  }, [open, peakHeight, closeThreshold]);

  const shouldWeCloseDrawer = (e, info) => {
    const { top } = drawerRef.current.getBoundingClientRect();
    if (top < initialY.current + closeThresholdPx.current) return;

    setDrawerAnimate({ opacity: 0, bottom: -drawerRef.current.scrollHeight });
    shouldClose.current = true; // we will only close when the animation is complete
  };

  const checkIfCloseForReal = () => {
    // We will only call the close function if the drawer close animation has completed
    if (!shouldClose.current) return;
    shouldClose.current = false;
    if (onRequestClose) onRequestClose();
  };

  const checkIfOpenForReal = () => {
    // We will only open once the initial hiding process is completed
    if (!shouldAppear.current) return;
    shouldAppear.current = false;
    setDrawerAnimate({
      bottom: -drawerRef.current.scrollHeight + peakHeightPx.current,
      opacity: 1,
    });
  };

  const setToPeekValue = () => {
    // We should first set it to a value that hides the drawer entirely
    setDrawerAnimate({
      bottom: -drawerRef.current.scrollHeight,
      opacity: 0,
      transition: { duration: 0 },
    });

    // This should result in a negative value
    // bottom: -300px means that 300px of the drawer is hidden
    // Hence, the peakHeightpx is effectively stating how much of the drawer is visible
    shouldAppear.current = true; // We will only open once the above animation has completed
  };

  const getMaximumUpperScroll = () => {
    setMaximumScroll(-(drawerRef.current.scrollHeight - peakHeightPx.current));
  };

  return createPortal(
    <>
      {open && (
        <div ref={containerRef} className="Container">
          <motion.div
            ref={drawerRef}
            className={`DrawerClass ${className}`}
            initial={{ opacity: 0 }}
            animate={drawerAnimate}
            onAnimationComplete={(latest) => {
              checkIfCloseForReal();
              checkIfOpenForReal();
            }}
            onDragEnd={(e, info) => {
              shouldWeCloseDrawer(e, info);
            }}
            drag="y"
            dragElastic={{ top: 0, bottom: 0.5 }}
            dragTransition={{
              bounceStiffness: 300,
              timeConstant: 150,
              bounceDamping: 30,
              power: 0.8,
            }}
            dragConstraints={{
              bottom: 0,
              top: maximumScroll,
            }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </>,
    document.body,
  );
};
