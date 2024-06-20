## Prerequisites

[Node.js](http://nodejs.org/) >= v16 must be installed.

## Installation

- Running `npm install` in the component's root directory will install everything you need for development.

## Demo Development Server

- First build the component first using `npm run build` which will create `/dist`
- `npm run dev` will run a development server with the component's demo app using vite. Check the console for the link to it
  _Note:_ There is _no_ hot refresh when you make an edit to the component, you _have_ to run `npm run build` each time to update the component. Though the demo app will automatically refresh once you update the component

## Building the library

- `npm run build` will build the component for publishing to npm and also bundle the demo app.

- `npm run publishPublic` will publish the application to npm

## Building the demo

- `npm run build-demo` will build the demo application.
