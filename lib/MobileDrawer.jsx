import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { convertToPixels } from "./utils/utils";
import { useLayoutEffect, useRef, useState, useCallback } from "react";
import debounce from "lodash.debounce";
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
  const drawerObserver = useRef(null);
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
    if (!drawerRef.current) return;

    drawerObserver.current = new ResizeObserver((entries) => {
      // console.log("resize observed!");
      // console.log("drawerRef.current", drawerRef.current);
      // console.log("internalOpen", internalOpen);
      // console.log("shouldClose", shouldClose.current);
      if (!drawerRef.current || shouldClose.current) return; // sometimes, the drawer might have exited but resizeObserver still calls
      debouncedCalculations();
    });

    drawerObserver.current.observe(drawerRef.current);

    () => {
      drawerObserver.current.disconnect();
    };
  }, [shouldRender]);

  useLayoutEffect(() => {
    if (open) setShouldRender(true);
    else if (!open && internalOpen) closeDrawer();
  }, [open]);

  useLayoutEffect(() => {
    if (!drawerRef.current || !shouldRender) return;
    debouncedCalculations();
  }, [shouldRender, parentElement, peakHeight, closeThreshold]);

  const debouncedCalculations = useCallback(
    debounce(() => {
      performCalculations();
    }, 50),
    [],
  );
  /**
   * Calculates the peakHeight, maximum upper scroll and closeThreshold in pixels
   * Triggers the opening process via openDrawerToPeeking()
   *
   * If the calculations differ/height differs, it will also move the drawer back to its "peak position"
   * This is to handle async/new content changes
   */
  const performCalculations = () => {
    const drawerHeight = drawerRef.current.scrollHeight;
    const peakHeightTemp = convertToPixels(peakHeight, parentElement);

    peakHeightPx.current =
      drawerHeight < peakHeightTemp ? drawerHeight : peakHeightTemp;
    closeThresholdPx.current = convertToPixels(closeThreshold, parentElement);

    getMaximumUpperScroll();
    getMaximumBottomScroll();

    // Check if we need to adjust back to "peeking" height because of SHORTER content
    // or if the content is now taller than the "peeking" height
    // console.log(Math.abs(getYTranslate(drawerRef.current)) > drawerHeight);
    // console.log(
    //   Math.abs(getYTranslate(drawerRef.current)) < peakHeightPx.current,
    // );
    if (
      Math.abs(getYTranslate(drawerRef.current)) > drawerHeight ||
      Math.abs(getYTranslate(drawerRef.current)) < peakHeightPx.current
    ) {
      openDrawerToPeeking(Math.random() * 1.1 + 1);
    }
  };

  /**
   * Calculates the maximum upper scroll value, defined as
   * (Height of the drawer - peakHeight), effectively hiding the drawer that is !peakHeight
   */
  const getMaximumUpperScroll = () => {
    // console.log("new maximum scrollheight:", drawerRef.current.scrollHeight);
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
  const openDrawerToPeeking = (epsilon = 0) => {
    setInternalOpen(true);

    // console.log("peeking", -peakHeightPx.current + epsilon);
    setDrawerAnimate({
      y: -peakHeightPx.current + epsilon,
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
    // console.log("closing");
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
    drawerObserver.current.disconnect();
    // console.log("close for real!");
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
            // console.log("maxScrollBottom", maximumScrollBottom);
            // console.log("maxScroll", maximumScroll);
            // console.log("drawerHeight", drawerRef.current.scrollHeight);
            // console.log("y", getYTranslate(drawerRef.current));
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
