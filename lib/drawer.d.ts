interface DrawerProps {
  /**
   * Block closing if set to false. Default is true.
   */
  allowClose?: boolean;

  /**
   * The children elements of the drawer.
   * This is a required property.
   */
  children: React.ReactNode;

  /**
   * Class name to be applied to the drawer container element.
   */
  containerElementClass?: string;

  /**
   * Controls the container's opacity (default is 0.6).
   */
  containerOpacity?: number;

  /**
   * The direction in which to translate the drawer.
   */
  direction?: string;

  /**
   * Disables the backdrop/background and allows for background scrolling.
   * Note: There appears to be a bug with WebKit browsers (Safari) which causes this feature to not work as expected.
   */
  disableBackDrop?: boolean;

  /**
   * Skip applying internal event listeners to the DOM.
   */
  dontApplyListeners?: boolean;

  /**
   * Function to get the container (overlay) ref.
   */
  getContainerRef?: () => React.RefObject<HTMLDivElement>;

  /**
   * Function to get the modal (draggable element) ref.
   */
  getModalRef?: () => React.RefObject<HTMLDivElement>;

  /**
   * Function to detect when the drawer is at the top of the viewport.
   */
  inViewportChange?: () => void;

  /**
   * Class name to be applied to the top modal element.
   */
  modalElementClass?: string;

  /**
   * Notify the consumer if the drawer will close at touch release.
   */
  notifyWillClose?: () => void;

  /**
   * Invoked on drag.
   */
  onDrag?: () => void;

  /**
   * Invoked when the drawer is focused.
   */
  onOpen?: () => void;

  /**
   * Indicates whether the drawer is open.
   * This is a required property.
   */
  open: boolean;

  /**
   * Invoked when a request to close the drawer is made.
   * This is a required property.
   */
  onRequestClose: () => void;

  /**
   * Blocks scrolls on the specified element if you're not using body scrolling.
   */
  parentElement?: React.RefObject<HTMLElement>;
}

class Drawer extends React.Component<DrawerProps> {}

export { Drawer };
