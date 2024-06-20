## react-drag-mobile-drawer

[![npm package][npm-badge]][npm]

> Mobile draggable drawer that falls back to modals on desktop

This is an updated **fork** of the original [react-drag-drawer](https://www.npmjs.com/package/react-drag-drawer) with some additional APIs and updated dependencies, namely:

- Added a `disableBackDrop` prop option
- Updated dependencies to use `preact` instead for a much smaller bundle size

[npm-badge]: https://img.shields.io/npm/v/react-drag-mobile-drawer.png?style=flat-square
[npm]: https://www.npmjs.org/package/react-drag-mobile-drawer

[Live demo!](https://demo.parkaholic.sg)

## Install

```
$ npm i react-drag-mobile-drawer
```

## Usage

```js
import Drawer from 'react-drag-mobile-drawer'

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

## API

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
| parentElement         | ref      | block scrolls on element if you're not using body scrolling                                                                                                                                       | false    |

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
