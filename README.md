# react-drag-mobile-drawer

[![npm package][npm-badge]][npm]

> Mobile draggable drawer that falls back to modals on desktop

This is an updated **fork** of the original [react-drag-drawer](https://www.npmjs.com/package/react-drag-drawer) with some notable changes:

- New `<MobileDrawer/>` component based off [motion](https://motion.dev/) instead
- Supports React 18 OR React 19
- Added a `disableBackDrop` prop
- Updated dependencies for a much smaller bundle size
- Added TypeScript support

[npm-badge]: https://img.shields.io/npm/v/react-drag-mobile-drawer.png?style=flat-square
[npm]: https://www.npmjs.org/package/react-drag-mobile-drawer

[Live demo!](https://demo.parkaholic.sg)

# Install

```
$ npm i react-drag-mobile-drawer
```

# Usage

## 1. `<MobileDrawer/>` (🆕)

```js
import { MobileDrawer } from 'react-drag-mobile-drawer'

...

const [open, setOpen] = useState(false)

  return (
    <MobileDrawer
          open={open}
          onRequestClose={setOpen}
    >
          <div>
            A mobile drawer!
          </div>
        </MobileDrawer>
  )

```

### 2.1 API for `MobileDrawer`

| Param          | Type            | Functionality                                                                                                                                            | Required |
| -------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| children       | React.ReactNode | The content to render inside the drawer.                                                                                                                 | Yes      |
| open           | boolean         | Indicates whether the drawer is open or closed. Default: `false`.                                                                                        | Yes      |
| onRequestClose | () => void      | Callback function when the drawer has closed. Use this to maintain the controlling `open` state                                                          | Yes      |
| className      | string          | Additional class names for the drawer container. Default: `""`.                                                                                          | No       |
| closeThreshold | string          | The threshold at which the drawer should close when scrolled beyond its lower boundary, takes in any CSS value (e.g. `20px`, `2rem`). Default: `"20px"`. | No       |
| dragElastic    | DragElastic     | Controls the drag elasticity (how much the drawer can scroll beyond the boundaries) on the top and bottom edges. Default: `{ top: 0, bottom: 0.5 }`.     | No       |
| dragTransition | DragTransition  | Defines the drag transition behavior. Default: `{ bounceStiffness: 300, timeConstant: 150, bounceDamping: 30, power: 0.7 }`.                             | No       |
| parentElement  | HTMLElement     | The DOM element to which the drawer should be appended (portal target). Default: `document.body`.                                                        | No       |
| peakHeight     | string          | The height of the drawer when it's peeking, takes in any CSS value (e.g. `200px`, `20rem`). Default: `"200px"`.                                          | No       |

## 2. `<Drawer/>`

```js
import { Drawer } from 'react-drag-mobile-drawer' // Note the named export change here

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
      <div>Hey Im inside the drawer!</div>
    </Drawer>
  )
}
```

### 2.1 API for `Drawer`

| Param                 | Type     | functionality                                                                                                                                                                                     | required |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| allowClose            | Boolean  | block closing if allowClose={false}, default is true                                                                                                                                              | false    |
| children              | Node     | null                                                                                                                                                                                              | true     |
| containerElementClass | String   | className to be applied to the drawer container element                                                                                                                                           | false    |
| containerOpacity      | Number   | Controls the **container's opacity** (default 0.6)                                                                                                                                                | false    |
| direction             | String   | direction to translate drawer                                                                                                                                                                     | false    |
| disableBackDrop       | Boolean  | Disables the backdrop/background and allows for background scrolling (**Note:** There appears to be a bug with `webkit` browsers (Safari) which does causes this feature to not work as expected) | false    |
| dontApplyListeners    | Boolean  | skip applying internal event listeners to the dom                                                                                                                                                 | false    |
| getContainerRef       | Function | get container (overlay) ref                                                                                                                                                                       | false    |
| getModalRef           | Function | get modal (draggable element) ref                                                                                                                                                                 | false    |
| inViewportChange      | Function | detect when drawer is at top of viewport                                                                                                                                                          | false    |
| modalElementClass     | String   | className to be applied to top <Drawer> element                                                                                                                                                   | false    |
| notifyWillClose       | Function | notify consumer if the drawer will close at touch release                                                                                                                                         | false    |
| onDrag                | Function | invoked on drag                                                                                                                                                                                   | false    |
| onOpen                | Function | invoked on drawer focus                                                                                                                                                                           | false    |
| open                  | Boolean  | null                                                                                                                                                                                              | true     |
| onRequestClose        | Function | null                                                                                                                                                                                              | true     |
| parentElement         | Element  | block scrolls on element if you're not using body scrolling                                                                                                                                       | false    |

Example modal style

```css
.modal {
  outline: none;
  background: white;
  font-size: 1.6rem;
  width: 76rem;
  max-width: 90%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  z-index: 15;
  min-height: 47rem;

  will-change: transform;
  transform: translate3d(0, 0, 0);
}

@media (max-width: 768px) {
  .modal {
    width: 100%;
    max-width: 100%;
    margin-bottom: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
}
```

## License

MIT © [Teo Kai Xiang](https://github.com/Tkaixiang) (this maintained fork) and [Jack Hanford](http://jackhanford.com) (Original author)
