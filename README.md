# react-breadcrumbs-context

[![Build Status](https://travis-ci.org/charlieduong94/react-breadcrumbs-context.svg?branch=master)](https://travis-ci.org/charlieduong94/react-breadcrumbs-context)
[![Coverage Status](https://coveralls.io/repos/github/charlieduong94/react-breadcrumbs-context/badge.svg?branch=master)](https://coveralls.io/github/charlieduong94/react-breadcrumbs-context?branch=master)

A lightweight, router agnostic implementation of breadcrumbs using the
[Context API](https://reactjs.org/docs/context.html) introduced in
React 16. Unlike other breadcrumb implementations, this module
does not automatically render breadcrumbs for you, giving you
the flexibility of rendering breadcrumbs for your app however you like.

## Installation

```bash
npm i react-breadcrumbs-context
```

```bash
yarn add react-breadcrumbs-context
```

## Usage

This module exposes a provider, consumer, and higher order component
that can be used for managing breadcrumbs.

```js
import {
  BreadcrumbsProvider,
  BreadcrumbsConsumer,
  withBreadcrumb
} from 'react-breadcrumbs-context'
```

Components rendered using the `withBreadcrumb` higher order component
within a `BreadcrumbsProvider` will register their breadcrumb
with the provider upon render. Upon dismount, the component will
deregister the crumb from the provider.

The `BreadcrumbsConsumer` can then be used to use the crumbs to
render out the data needed.

Below is a basic example.

```jsx
const crumb = { title: 'Page', path: '/' }

// upon render, this component will register crumb with
// the provider
const MyPage = withBreadCrumb(crumb)(() => <h1> Hello world! </h1>)

const App = () => (
  <BreadcrumbsProvider>
    <BreadcrumbsConsumer>
      {({ crumbs }) => {
        console.log(crumbs) // will output [ { title: 'Page', path: '/' } ]
        return <h1> First crumb title is {crumbs[0].title} </h1>
      }}
    </BreadcrumbsConsumer>
    <MyPage />
  </BreadcrumbsProvider>
)
```

## Typescript Support

This module exposes Typescript typings. If needed, you can get the
`Crumb` type from this module.

```typescript
import { Crumb } from 'react-breadcrumbs-context'
```
