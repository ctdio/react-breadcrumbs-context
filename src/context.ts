import React from 'react'

import { Crumb } from './types'

interface BreadcrumbContext {
  crumbs: Crumb[]
  addCrumb: (crumb: Crumb) => void
  removeCrumb: (crumb: Crumb) => void
}

/* istanbul ignore next */
const defaultContext: BreadcrumbContext = {
  crumbs: [],
  // tslint:disable-next-line
  addCrumb: (crumb: Crumb) => {},
  // tslint:disable-next-line
  removeCrumb: (crumb: Crumb) => {}
}

const { Provider, Consumer } = React.createContext(defaultContext)

export { Provider, Consumer }
