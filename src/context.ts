import React from 'react'

import { Crumb } from './types'

interface BreadcrumbContext {
  crumbs: Crumb[]
  addCrumb: (crumb: Crumb) => void
  removeCrumb: (crumb: Crumb) => void
  replaceCrumb: (oldCrumb: Crumb, newCrumb: Crumb) => void
}

/* istanbul ignore next */
const defaultContext: BreadcrumbContext = {
  crumbs: [],
  // tslint:disable-next-line
  addCrumb: (crumb: Crumb) => {},
  // tslint:disable-next-line
  removeCrumb: (crumb: Crumb) => {},
  // tslint:disable-next-line
  replaceCrumb: (oldCrumb: Crumb, newCrumb: Crumb) => {}
}

const { Provider, Consumer } = React.createContext(defaultContext)

export { Provider, Consumer }
