interface DragElastic {
  top: number;
  bottom: number;
}

interface DragTransition {
  bounceStiffness: number;
  timeConstant: number;
  bounceDamping: number;
  power: number;
}

interface MobileDrawerProps {
  /**
   * The content to render inside the drawer.
   */
  children: React.ReactNode;

  /**
   * Indicates whether the drawer is open or closed. Default: `false`.
   */
  open: boolean;

  /**
   * Callback function when the drawer has closed. Use this to maintain the controlling `open` state.
   */
  onRequestClose: () => void;

  /**
   * Additional class names for the drawer container. Default: `""`.
   */
  className?: string;

  /**
   * The threshold at which the drawer should close when scrolled beyond its lower boundary,
   * takes in any CSS value (e.g. `20px`, `2rem`). Default: `"20px"`.
   */
  closeThreshold?: string;

  /**
   * Controls the drag elasticity (how much the drawer can scroll beyond the boundaries) on the top and bottom edges.
   * Default: `{ top: 0, bottom: 0.5 }`.
   */
  dragElastic?: DragElastic;

  /**
   * Defines the drag transition behavior.
   * Default: `{ bounceStiffness: 300, timeConstant: 150, bounceDamping: 30, power: 0.7 }`.
   */
  dragTransition?: DragTransition;

  /**
   * The DOM element to which the drawer should be appended (portal target).
   * Default: `document.body`.
   */
  parentElement?: HTMLElement;

  /**
   * The height of the drawer when it's peeking, takes in any CSS value (e.g. `200px`, `20rem`).
   * Default: `"200px"`.
   */
  peakHeight?: string;
}

class MobileDrawer extends React.Component<MobileDrawerProps> {}

export { MobileDrawer };
