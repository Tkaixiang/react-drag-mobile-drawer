import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { convertToPixels } from "./utils/utils";
import { useLayoutEffect, useRef, useState } from "react";
import "./MobileDrawer.css";

export const MobileDrawer = ({
  // sorted properties:
  children,
  className = "",
  closeThreshold = "20px",
  dragElastic = { top: 0, bottom: 0.5 },
  dragTransition = {
    bounceStiffness: 300,
    timeConstant: 150,
    bounceDamping: 30,
    power: 0.7,
  },
  onRequestClose,
  open = false,
  parentElement = document.body,
  peakHeight = "200px",
}) => {
  const drawerRef = useRef(null);
  const shouldClose = useRef(false);
  const shouldAppear = useRef(false);
  const initialY = useRef(0);
  const peakHeightPx = useRef(0);
  const closeThresholdPx = useRef(0);
  const [drawerAnimate, setDrawerAnimate] = useState({ opacity: 0, bottom: 0 });
  const [shouldRender, setShouldRender] = useState(false); // controls whether the drawer is rendered
  const [internalOpen, setInternalOpen] = useState(false); // tracks whether the drawer is opened/not
  const [maximumScroll, setMaximumScroll] = useState(0);

  useLayoutEffect(() => {
    if (open) setShouldRender(true);

    if (!drawerRef.current) return;
    // this will pass once internalOpen=true and the drawer has rendered

    performCaluclations(); // perform calculations again on any parentElement, peakHeight, closeThreshold changes
    if (open && !internalOpen) {
      // should only move drawer to peeking if it isn't already opened
      openDrawerToPeeking();
    } else if (!open && internalOpen) {
      closeDrawer();
    }
  }, [open, shouldRender, parentElement, peakHeight, closeThreshold]);

  /**
   * Calculates the peakHeight, maximum upper scroll and closeThreshold in pixels
   * Triggers the opening process via openDrawerToPeeking()
   */
  const performCaluclations = () => {
    peakHeightPx.current = convertToPixels(peakHeight, parentElement);
    closeThresholdPx.current = convertToPixels(closeThreshold, parentElement);
    initialY.current =
      (parentElement === document.body
        ? window.innerHeight
        : parentElement.offsetHeight) - peakHeightPx.current;

    getMaximumUpperScroll();
  };

  /**
   * Calculates the maximum upper scroll value, defined as
   * (Height of the drawer - peakHeight), effectively hiding the drawer that is !peakHeight
   */
  const getMaximumUpperScroll = () => {
    setMaximumScroll(-(drawerRef.current.scrollHeight - peakHeightPx.current));
  };

  /**
   * Opens the drawer to its "peeking height"
   */
  const openDrawerToPeeking = () => {
    setInternalOpen(true);
    // First moves the drawer to its "hiding" position (since it is rendered in the middle by default)
    setDrawerAnimate({
      bottom: -drawerRef.current.scrollHeight,
      opacity: 0,
      transition: { duration: 0 },
    });

    // This should result in a negative value
    // bottom: -300px means that 300px of the drawer is hidden
    // Hence, the peakHeightpx is effectively stating how much of the drawer is visible
    shouldAppear.current = true;
    // Acts as a "Green Flag" to tell checkIfOpenForReal() to move the drawer to its peeking height
  };

  const shouldWeCloseDrawer = (e, info) => {
    const { top } = drawerRef.current.getBoundingClientRect();
    if (top < initialY.current + closeThresholdPx.current) return;

    closeDrawer();
  };

  const closeDrawer = () => {
    setInternalOpen(false);
    setDrawerAnimate({ opacity: 0, bottom: -drawerRef.current.scrollHeight });
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

  const checkIfOpenForReal = () => {
    // We will only open once the initial hiding process is completed
    if (!shouldAppear.current) return;
    shouldAppear.current = false;
    setDrawerAnimate({
      bottom: -drawerRef.current.scrollHeight + peakHeightPx.current,
      opacity: 1,
    });
  };

  return createPortal(
    <>
      {shouldRender && (
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
          dragElastic={dragElastic}
          dragTransition={dragTransition}
          dragConstraints={{
            bottom: 0,
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
