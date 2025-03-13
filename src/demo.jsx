import { PureComponent } from "react";
import { createRoot } from "react-dom/client";
import { Drawer, MobileDrawer } from "../lib";
import * as styles from "./styles";

class Demo extends PureComponent {
  state = {
    regular: false,
    sidebarLeft: false,
    sidebarRight: false,
    asyncHeight: false,
    crazyStyle: false,
    mobileStyle: false,
    test: 100,
    changeText: "I am a mobile drawer!",
  };

  toggle = (type, value) => (event) => {
    if (type === "mobileStyle") {
      setTimeout(() => {
        this.setState({ test: 10 });
      }, 5000);
      setTimeout(() => {
        this.setState({ changeText: "hello!" });
      }, 5000);
    }

    this.setState((state) => {
      return {
        [type]: value,
      };
    });
  };

  render() {
    const {
      regular,
      sidebarLeft,
      sidebarRight,
      asyncHeight,
      crazyStyle,
      mobileStyle,
    } = this.state;

    return (
      <div className={`${styles.Reset} ${styles.Container}`}>
        <h1>React Drag Mobile Drawer</h1>
        <div style={{ display: "flex" }}>
          <img
            src={
              "https://img.shields.io/npm/v/react-drag-mobile-drawer.png?style=flat-square"
            }
            style={{ cursor: "pointer" }}
            onClick={() => {
              window.location.href =
                "https://www.npmjs.com/package/react-drag-mobile-drawer";
            }}
          />
          <img
            src={
              "https://badgen.net/github/release/tkaixiang/react-drag-mobile-drawer"
            }
            style={{ cursor: "pointer", marginLeft: "1ch" }}
            onClick={() => {
              window.location.href =
                "https://github.com/Tkaixiang/react-drag-mobile-drawer";
            }}
          />
        </div>

        <Info>
          <code>react-drag-mobile-drawer</code> is a lightweight, performant,
          drawer/modal component that can be dragged around smoothly (much like
          a mobile drawer).
          <br />
          <br />
          <u>
            <b>Note:</b>
          </u>{" "}
          This is an updated fork of the original{" "}
          <a href="https://github.com/hanford/react-drag-drawer">
            react-drag-drawer
          </a>{" "}
          with some notable changes: <br />- New <code>MobileDrawer</code>{" "}
          component based off <a href="https://motion.dev/">motion</a> instead{" "}
          <br />
          - Supports React 18 OR React 19
          <br />- Added a <code>disableBackDrop</code> prop <br />
          - Updated dependencies for a much smaller bundle size <br />- Added
          TypeScript support
        </Info>

        <div className={styles.Break} />

        <Info>
          <h1>
            <code>&lt;MobileDrawer/&gt;</code> Example 🆕
          </h1>
          <div className={styles.Break} />
          An example draggable mobile drawer that can be opened to full screen.
          Similar to drawers on apps such as Google Maps.
          <br />
          <br />
          Will animate back to its "Peeking Height" if any of the props change,
          or if the height of the drawer changes
        </Info>
        <button
          onClick={this.toggle("mobileStyle", true)}
          className={styles.Toggle}
        >
          Mobile Drawer
        </button>
        <pre className={styles.Code}>
          {`import { MobileDrawer } from 'react-drag-mobile-drawer'
...
<MobileDrawer
  open={mobileStyle}
  onRequestClose={this.toggle("mobileStyle", false)}
>
  <div className={styles.MobileStyles}>
    <span>I am a mobile drawer!</span>
    <button
      className={styles.Toggle}
      onClick={this.toggle("mobileStyle", false)}
    >
      Close drawer
    </button>
  </div>
</MobileDrawer>
...
export const MobileStyles = css\`
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  height: 400px;
  width: 100vw;
\`;
        `}
        </pre>

        <div className={styles.Break} />

        <h1>
          <code>&lt;Drawer/&gt;</code> Examples
        </h1>

        <div className={styles.Break} />

        <button
          onClick={this.toggle("regular", true)}
          className={styles.Toggle}
        >
          Open example
        </button>
        <pre className={styles.Code}>
          {`import { Drawer } from 'react-drag-mobile-drawer'

..

toggle = () => {
  let { toggle } = this.state

  this.setState({ toggle: !toggle })
}

render () {
  const { open } = this.state

  return (
    <Drawer
      open={open}
      onRequestClose={this.toggle}
    >
      <div>Hey Im inside a drawer!</div>
    </Drawer>
  )
}
        `}
        </pre>
        <div className={styles.Break} />

        <Info>
          <code>&lt;Drawer/&gt;</code> uses native HTML5 scrolling to remain
          performant and to properly respond to async data / components
        </Info>
        <button
          onClick={this.toggle("asyncHeight", true)}
          className={styles.Toggle}
        >
          Async height
        </button>
        <div className={styles.Break} />

        <Info>
          You can also use <code>&lt;Drawer/&gt;</code> to build sidebars by
          simply changing the <code>direction</code> prop
        </Info>
        <button
          onClick={this.toggle("sidebarLeft", true)}
          className={styles.Toggle}
        >
          Left Sidebar
        </button>
        <pre className={styles.Code}>
          {`import { Drawer } from 'react-drag-mobile-drawer'

..

<Drawer
  open={true}
  onRequestClose={this.toggle}
  direction='left'
>
  <div>Hey Im inside a drawer!</div>
</Drawer>
        `}
        </pre>

        <Info>Sidebar can be displayed also on the right side</Info>
        <button
          onClick={this.toggle("sidebarRight", true)}
          className={styles.Toggle}
        >
          Right Sidebar
        </button>
        <pre className={styles.Code}>
          {`import { Drawer } from 'react-drag-mobile-drawer'

..

<Drawer
  open={true}
  onRequestClose={this.toggle}
  direction='right'
>
  <div>Hey Im inside a drawer!</div>
</Drawer>
        `}
        </pre>
        <div className={styles.Break} />

        <Info>
          <code>&lt;Drawer/&gt;</code> assumes nothing about your styles and is
          left entirely up to you how you want to style it
        </Info>
        <button
          onClick={this.toggle("crazyStyle", true)}
          className={styles.Toggle}
        >
          Different style
        </button>
        <pre className={styles.Code}>
          {`import { Drawer } from 'react-drag-mobile-drawer'

..

<Drawer
  open={true}
  onRequestClose={this.toggle}
  modalElementClass={myCustomDrawerClassName}
>
  <div>Hey Im inside a drawer!</div>
</Drawer>
        `}
        </pre>

        <div className={styles.Break} />

        <Info>
          You can conditionally apply event listeners by using the
          dontApplyListeners prop
        </Info>
        <pre className={styles.Code}>
          {`import { Drawer } from 'react-drag-mobile-drawer'

..

<Drawer
  open={true}
  onRequestClose={this.toggle}
  dontApplyListeners={true}
>
  <div>Hey Im inside a drawer!</div>
</Drawer>
        `}
        </pre>
        <div className={styles.Break} />

        <Info>
          <code>&lt;Drawer/&gt;</code> has a{" "}
          <a
            target="_blank"
            href="https://github.com/Tkaixiang/react-drag-mobile-drawer"
            rel="noreferrer"
          >
            small but extensive API
          </a>{" "}
          that allows for some very cool customizations. The code for this
          website can be found{" "}
          <a
            href="https://github.com/Tkaixiang/react-drag-mobile-drawer/blob/main/src/demo.jsx"
            target="_blank"
            rel="noreferrer"
          >
            on github.
          </a>
        </Info>

        <pre className={styles.Code}>
          {`import { Drawer } from 'react-drag-mobile-drawer'

..

<Drawer
  onRequestClose={() => {}}
  onDrag={() => {}}
  onOpen={() => {}}
  notifyWillClose={willIClose => console.log({ willIClose })}
  allowClose={true}
  modalElementClass='card'
  containerElementClass='my-shade'
  parentElement={document.body} // element to be appended to
  direction='bottom'
  inViewportChange={atTopOfViewport => console.log({ atTopOfViewport })}
  getModalRef={ref => console.log({ ref })}
  getContainerRef={ref => console.log({ ref })}
>
  <div>Hey Im inside a drawer!</div>
</Drawer>
        `}
        </pre>

        <Drawer
          open={regular}
          onRequestClose={this.toggle("regular", false)}
          modalElementClass={styles.ModalElement}
        >
          <div className={styles.Card}>
            I'm in a drawer!
            <button
              className={styles.Toggle}
              onClick={this.toggle("regular", false)}
            >
              Close drawer
            </button>
          </div>
        </Drawer>

        <Drawer
          open={sidebarLeft}
          onRequestClose={this.toggle("sidebarLeft", false)}
          modalElementClass={styles.Sidebar}
          direction="left"
        >
          <div className={styles.Card}>
            I'm a sidebar drawer
            <button
              className={styles.Toggle}
              onClick={this.toggle("sidebarLeft", false)}
            >
              Close drawer
            </button>
          </div>
        </Drawer>

        <Drawer
          open={sidebarRight}
          onRequestClose={this.toggle("sidebarRight", false)}
          modalElementClass={styles.Sidebar}
          direction="right"
        >
          <div className={styles.Card}>
            I'm a sidebar drawer
            <button
              className={styles.Toggle}
              onClick={this.toggle("sidebarRight", false)}
            >
              Close drawer
            </button>
          </div>
        </Drawer>

        <Drawer
          open={crazyStyle}
          onRequestClose={this.toggle("crazyStyle", false)}
          modalElementClass={styles.CrazyStyle}
        >
          <div className={styles.Card}>
            I'm full screen height because of some style changes
            <button
              className={styles.Toggle}
              onClick={this.toggle("crazyStyle", false)}
            >
              Close drawer
            </button>
          </div>
        </Drawer>

        <AsyncHeightDrawer
          open={asyncHeight}
          onRequestClose={this.toggle("asyncHeight", false)}
          modalElementClass={styles.HugeList}
        />

        <MobileDrawer
          open={mobileStyle}
          onRequestClose={this.toggle("mobileStyle", false)}
        >
          <div className={styles.MobileStyles}>
            <span>{this.state.changeText}</span>
            {Array.from({ length: this.state.test }).map((_, index) => (
              <div key={index}>{index}</div>
            ))}
            <button
              className={styles.Toggle}
              onClick={this.toggle("mobileStyle", false)}
            >
              Close drawer
            </button>
          </div>
        </MobileDrawer>
      </div>
    );
  }
}

const Info = ({ children }) => (
  <p className={styles.InfoComponent}>{children}</p>
);

class AsyncHeightDrawer extends PureComponent {
  state = {
    asyncData: [],
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.open === false && nextProps.open === true) {
      setTimeout(() => {
        const newArray = new Array(500).fill(true);

        this.setState({ asyncData: newArray });
      }, 200);
    }

    if (nextProps.open === false && this.props.open) {
      this.setState({ asyncData: [] });
    }
  }

  render() {
    return (
      <Drawer {...this.props}>
        <div className={styles.Card}>
          <button className={styles.Toggle} onClick={this.props.onRequestClose}>
            Close drawer
          </button>
          <br />
          <div className={styles.Content}>
            {this.state.asyncData.length === 0 ? (
              <div>Loading...</div>
            ) : (
              this.state.asyncData.map((_, index) => (
                <div key={index}>{index}</div>
              ))
            )}
          </div>
        </div>
      </Drawer>
    );
  }
}

const root = createRoot(document.querySelector("#root"));
root.render(<Demo />);
