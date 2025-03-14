import { Component } from "react";
import { Motion, spring, presets } from "react-motion";
import PropTypes from "prop-types";
import { InView } from "react-intersection-observer";
import { createPortal } from "react-dom";
import "./Drawer.css";

import {
  isDirectionBottom,
  isDirectionTop,
  isDirectionLeft,
  isDirectionRight,
  isClientSide,
} from "./helpers";

export class Drawer extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    disableBackDrop: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.element,
    ]),
    onRequestClose: PropTypes.func,
    onDrag: PropTypes.func,
    onOpen: PropTypes.func,
    inViewportChange: PropTypes.func,
    allowClose: PropTypes.bool,
    notifyWillClose: PropTypes.func,
    direction: PropTypes.string,
    modalElementClass: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    containerOpacity: PropTypes.number,
    containerElementClass: PropTypes.string,
    getContainerRef: PropTypes.func,
    getModalRef: PropTypes.func,
    dontApplyListeners: PropTypes.bool,
    id: PropTypes.string,
  };

  static defaultProps = {
    notifyWillClose: () => {},
    onOpen: () => {},
    onDrag: () => {},
    inViewportChange: () => {},
    onRequestClose: () => {},
    getContainerRef: () => {},
    getModalRef: () => {},
    containerOpacity: 0.6,
    direction: "bottom",
    parentElement: document.body,
    allowClose: true,
    dontApplyListeners: false,
    disableBackDrop: false,
    containerElementClass: "",
    modalElementClass: "",
  };

  state = {
    open: this.props.open,
    thumb: 0,
    start: 0,
    position: 0,
    touching: false,
    listenersAttached: false,
  };

  MAX_NEGATIVE_SCROLL = 20;
  SCROLL_TO_CLOSE = 75;
  ALLOW_DRAWER_TRANSFORM = true;

  componentDidMount() {
    if (this.props.direction === "y")
      console.warn(
        "Direction prop is now takes up or down, y is no longer supported!",
      );
    if (this.props.direction === "x")
      console.warn(
        "Direction prop is now takes left or right, x is no longer supported!",
      );
  }

  componentDidUpdate(prevProps, nextState) {
    // in the process of closing the drawer
    if (!this.props.open && prevProps.open) {
      this.removeListeners();

      setTimeout(() => {
        this.setState(() => {
          return {
            open: false,
          };
        });
      }, 300);
    }

    if (this.drawer) {
      this.getNegativeScroll(this.drawer);
    }

    // in the process of opening the drawer
    if (this.props.open && !prevProps.open) {
      this.props.onOpen();

      this.setState(() => {
        return {
          open: true,
        };
      });
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  attachListeners = (drawer) => {
    const { dontApplyListeners, getModalRef, direction } = this.props;
    const { listenersAttached } = this.state;

    // only attach listeners once as this function gets called every re-render
    if (!drawer || listenersAttached || dontApplyListeners) return;

    this.drawer = drawer;
    getModalRef(drawer);

    this.drawer.addEventListener("touchend", this.release);
    this.drawer.addEventListener("touchmove", this.drag);
    this.drawer.addEventListener("touchstart", this.tap);

    let position = 0;

    if (isDirectionRight(direction)) {
      position = drawer.scrollWidth;
    }

    this.setState({ listenersAttached: true, position }, () => {
      setTimeout(() => {
        // trigger reflow so webkit browsers calculate height properly 😔
        // https://bugs.webkit.org/show_bug.cgi?id=184905
        this.drawer.style.display = "none";
        void this.drawer.offsetHeight;
        this.drawer.style.display = "";
      }, 300);
    });
  };

  removeListeners = () => {
    if (!this.drawer) return;

    this.drawer.removeEventListener("touchend", this.release);
    this.drawer.removeEventListener("touchmove", this.drag);
    this.drawer.removeEventListener("touchstart", this.tap);

    this.setState({ listenersAttached: false });
  };

  tap = (event) => {
    const { pageY, pageX } = event.touches[0];

    const start =
      isDirectionBottom(this.props.direction) ||
      isDirectionTop(this.props.direction)
        ? pageY
        : pageX;

    // reset NEW_POSITION and MOVING_POSITION
    this.NEW_POSITION = 0;
    this.MOVING_POSITION = 0;

    this.setState(() => {
      return {
        thumb: start,
        start: start,
        touching: true,
      };
    });
  };

  drag = (event) => {
    const { direction } = this.props;
    const { thumb, start, position } = this.state;
    const { pageY, pageX } = event.touches[0];

    const movingPosition =
      isDirectionBottom(direction) || isDirectionTop(direction) ? pageY : pageX;
    const delta = movingPosition - thumb;
    const newPosition = isDirectionBottom(direction)
      ? position + delta
      : position - delta;

    if (newPosition > 0 && this.ALLOW_DRAWER_TRANSFORM) {
      // stop android's pull to refresh behavior
      event.preventDefault();

      this.props.onDrag({ newPosition });
      // we set this, so we can access it in shouldWeCloseDrawer. Since setState is async, we're not guranteed we'll have the
      // value in time
      this.MOVING_POSITION = movingPosition;
      this.NEW_POSITION = newPosition;

      let positionThreshold = 0;

      if (isDirectionRight(direction)) {
        positionThreshold = this.drawer.scrollWidth;
      }

      if (newPosition < positionThreshold && this.shouldWeCloseDrawer()) {
        this.props.notifyWillClose(true);
      } else {
        this.props.notifyWillClose(false);
      }

      // not at the bottom
      if (this.NEGATIVE_SCROLL < newPosition) {
        this.setState(() => {
          return {
            thumb: movingPosition,
            position:
              positionThreshold > 0
                ? Math.min(newPosition, positionThreshold)
                : newPosition,
          };
        });
      }
    }
  };

  release = (event) => {
    const { direction } = this.props;

    this.setState(() => {
      return {
        touching: false,
      };
    });

    if (this.shouldWeCloseDrawer()) {
      this.hideDrawer();
    } else {
      let newPosition = 0;

      if (isDirectionRight(direction)) {
        newPosition = this.drawer.scrollWidth;
      }

      this.setState(() => {
        return {
          position: newPosition,
        };
      });
    }
  };

  getNegativeScroll = (element) => {
    const { direction } = this.props;
    const size = this.getElementSize();

    if (isDirectionBottom(direction) || isDirectionTop(direction)) {
      this.NEGATIVE_SCROLL =
        size - element.scrollHeight - this.MAX_NEGATIVE_SCROLL;
    } else {
      this.NEGATIVE_SCROLL =
        size - element.scrollWidth - this.MAX_NEGATIVE_SCROLL;
    }
  };

  hideDrawer = () => {
    const { allowClose, onRequestClose, direction } = this.props;

    let defaultPosition = 0;

    if (isDirectionRight(direction)) {
      defaultPosition = this.drawer.scrollWidth;
    }

    if (allowClose === false) {
      // if we aren't going to allow close, let's animate back to the default position
      return this.setState(() => {
        return {
          position: defaultPosition,
          thumb: 0,
          touching: false,
        };
      });
    }

    this.setState(() => {
      return {
        position: defaultPosition,
        touching: false,
      };
    });

    // cleanup
    this.removeListeners();
    onRequestClose();
  };

  shouldWeCloseDrawer = () => {
    const { start: touchStart } = this.state;
    const { direction } = this.props;

    let initialPosition = 0;

    if (isDirectionRight(direction)) {
      initialPosition = this.drawer.scrollWidth;
    }

    if (this.MOVING_POSITION === initialPosition) return false;

    if (isDirectionRight(direction)) {
      return (
        this.NEW_POSITION < initialPosition &&
        this.MOVING_POSITION - touchStart > this.SCROLL_TO_CLOSE
      );
    } else if (isDirectionLeft(direction)) {
      return (
        this.NEW_POSITION >= initialPosition &&
        touchStart - this.MOVING_POSITION > this.SCROLL_TO_CLOSE
      );
    } else if (isDirectionTop(direction)) {
      return (
        this.NEW_POSITION >= initialPosition &&
        touchStart - this.MOVING_POSITION > this.SCROLL_TO_CLOSE
      );
    } else {
      return (
        this.NEW_POSITION >= initialPosition &&
        this.MOVING_POSITION - touchStart > this.SCROLL_TO_CLOSE
      );
    }
  };

  getDrawerTransform = (value) => {
    const { direction } = this.props;
    if (isDirectionBottom(direction)) {
      return { transform: `translate3d(0, ${value}px, 0)` };
    } else if (isDirectionTop(direction)) {
      return { transform: `translate3d(0, -${value}px, 0)` };
    } else if (isDirectionLeft(direction)) {
      return { transform: `translate3d(-${Math.abs(value)}px, 0, 0)` };
    } else if (isDirectionRight(direction)) {
      return { transform: `translate3d(${value}px, 0, 0)` };
    }
  };

  getElementSize = () => {
    if (isClientSide()) {
      return isDirectionBottom(this.props.direction) ||
        isDirectionTop(this.props.direction)
        ? window.innerHeight
        : window.innerWidth;
    }
  };

  getPosition(hiddenPosition) {
    const { position } = this.state;
    const { direction } = this.props;

    if (isDirectionRight(direction)) {
      return hiddenPosition - position;
    } else {
      return position;
    }
  }

  inViewportChange = (inView) => {
    this.props.inViewportChange(inView);

    this.ALLOW_DRAWER_TRANSFORM = inView;
  };

  preventDefault = (event) => event.preventDefault();
  stopPropagation = (event) => event.stopPropagation();

  render() {
    const {
      id,
      containerElementClass,
      containerOpacity,
      getContainerRef,
      direction,
      disableBackDrop,
    } = this.props;

    const open = this.state.open && this.props.open;

    // If drawer isn't open or in the process of opening/closing, then remove it from the DOM
    // also, if we're not client side we need to return early because createPortal is only
    // a clientside method
    if ((!this.state.open && !this.props.open) || !isClientSide()) {
      return null;
    }

    const { touching } = this.state;

    const springPreset = isDirectionLeft(direction)
      ? { damping: 17, stiffness: 120 }
      : { damping: 20, stiffness: 300 };

    const animationSpring = touching ? springPreset : presets.stiff;

    const hiddenPosition = this.getElementSize();

    const position = this.getPosition(hiddenPosition);

    // Style object for the container element
    let containerStyle = {
      backgroundColor: disableBackDrop
        ? "rgba(255,255,255, 0)"
        : `rgba(55, 56, 56, ${open ? containerOpacity : 0})`,
      pointerEvents: disableBackDrop ? "none" : "auto",
    };

    // If direction is right, we set the overflowX property to 'hidden' to hide the x scrollbar during
    // the sliding animation
    if (isDirectionRight(direction)) {
      containerStyle = {
        ...containerStyle,
        overflowX: "hidden",
      };
    }

    return createPortal(
      <Motion
        style={{
          translate: spring(open ? position : hiddenPosition, animationSpring),
        }}
        defaultStyle={{
          translate: hiddenPosition,
        }}
      >
        {({ translate }) => {
          return (
            <div
              id={id}
              style={containerStyle}
              onClick={() => {
                if (!disableBackDrop) {
                  this.hideDrawer();
                }
              }}
              className={`Container ${containerElementClass} `}
              ref={getContainerRef}
            >
              <InView
                className="HaveWeScrolled"
                onChange={this.inViewportChange}
              />

              <div
                onClick={this.stopPropagation}
                style={{
                  ...this.getDrawerTransform(translate),
                  pointerEvents: "auto",
                }}
                ref={this.attachListeners}
                className={this.props.modalElementClass || ""}
              >
                {this.props.children}
              </div>
            </div>
          );
        }}
      </Motion>,
      this.props.parentElement,
    );
  }
}
