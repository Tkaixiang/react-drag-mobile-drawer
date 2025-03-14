import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { convertToPixels } from "./utils/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./MobileDrawer.css";
import { getYTranslate } from "./mobileDrawerHelpers";

export const MobileDrawer = ({
  // sorted properties:
  children,
  className = "",
  closeThreshold = "20px",
  dragElastic = { top: 0, bottom: 0.5 },
  dragTransition = {
    bounceStiffness: 400,
    timeConstant: 150,
    bounceDamping: 30,
    power: 0.8,
  },
  onRequestClose,
  open = false,
  parentElement = document.body,
  peakHeight = "200px",
}) => {
  const drawerRef = useRef(null);
  const shouldClose = useRef(false);
  const peakHeightPx = useRef(0);
  const closeThresholdPx = useRef(0);
  const [drawerAnimate, setDrawerAnimate] = useState({ y: 0 });
  const [shouldRender, setShouldRender] = useState(false); // controls whether the drawer is rendered
  const [internalOpen, setInternalOpen] = useState(false); // tracks whether the drawer is opened/not
  const [maximumScroll, setMaximumScroll] = useState(0);
  const [maximumScrollBottom, setMaximumScrollBottom] = useState(0);

  useLayoutEffect(() => {
    if (open) setShouldRender(true);

    if (!drawerRef.current) return;
    // this will pass once internalOpen=true and the drawer has rendered

    performCaluclations(); // perform calculations again on any parentElement, peakHeight, closeThreshold changes
    if (open && !internalOpen) {
      openDrawerToPeeking();
    } else if (!open && internalOpen) {
      closeDrawer();
    }
  }, [open, shouldRender, children, parentElement, peakHeight, closeThreshold]);

  /**
   * Calculates the peakHeight, maximum upper scroll and closeThreshold in pixels
   * Triggers the opening process via openDrawerToPeeking()
   *
   * If the calculations differ/height differs, it will also move the drawer back to its "peak position"
   * This is to handle async/new content changes
   */
  const performCaluclations = () => {
    peakHeightPx.current = convertToPixels(peakHeight, parentElement);
    closeThresholdPx.current = convertToPixels(closeThreshold, parentElement);

    // Check if we need to adjust back to "peeking" height because of SHORTER content
    if (
      Math.abs(getYTranslate(drawerRef.current)) >
      drawerRef.current.scrollHeight
    ) {
      openDrawerToPeeking(0.1);
    }

    getMaximumUpperScroll();
    getMaximumBottomScroll();
  };

  /**
   * Calculates the maximum upper scroll value, defined as
   * (Height of the drawer - peakHeight), effectively hiding the drawer that is !peakHeight
   */
  const getMaximumUpperScroll = () => {
    const upperScroll = -drawerRef.current.scrollHeight;
    setMaximumScroll(upperScroll);
    return upperScroll;
  };

  /**
   * Calculates the maximum bottom scroll value, defined as
   * (Height of the drawer - peakHeight), effectively hiding the drawer that is !peakHeight
   */
  const getMaximumBottomScroll = () => {
    const bottomScroll = -peakHeightPx.current;
    setMaximumScrollBottom(bottomScroll);
    return bottomScroll;
  };

  /**
   * Opens the drawer to its "peeking height"
   */
  const openDrawerToPeeking = (epislon = 0) => {
    setInternalOpen(true);

    setDrawerAnimate({
      y: -peakHeightPx.current + epislon,
      // you might be wondering, why the fk are we adding an epislon here?
      // this is because even though the y value might be currently different, Motion does not seem to actually "animate" the component back to its peakHeight
    });
  };

  const shouldWeCloseDrawer = (e, info) => {
    const yValue = getYTranslate(drawerRef.current);

    if (yValue < -peakHeightPx.current + closeThresholdPx.current) return;

    closeDrawer();
  };

  const closeDrawer = () => {
    setInternalOpen(false);
    setDrawerAnimate({ y: 0 });
    shouldClose.current = true; // we will only close when the animation is complete
  };

  // ======================================================
  // ================ Animation Callbacks =================
  // ======================================================
  const checkIfCloseForReal = () => {
    // We will only call the close function and unrender only once the drawer close animation has completed
    if (!shouldClose.current) return;
    shouldClose.current = false;
    if (onRequestClose) onRequestClose();
    setShouldRender(false);
  };

  return createPortal(
    <>
      {shouldRender && (
        <motion.div
          ref={drawerRef}
          className={`DrawerClass ${className}`}
          initial={{ y: 0 }}
          animate={drawerAnimate}
          onAnimationComplete={(latest) => {
            checkIfCloseForReal();
          }}
          onDragEnd={(e, info) => {
            shouldWeCloseDrawer(e, info);
          }}
          drag="y"
          dragElastic={dragElastic}
          dragTransition={dragTransition}
          dragConstraints={{
            bottom: maximumScrollBottom,
            top: maximumScroll,
          }}
        >
          {children}
        </motion.div>
      )}
    </>,
    parentElement,
  );
};
