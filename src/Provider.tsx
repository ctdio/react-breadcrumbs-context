import React, { Component, ReactElement } from 'react'
import { Provider } from './context'

import { Crumb } from './types'

interface Props {
  children: ReactElement<any> | ReactElement<any>[]
}

interface State {
  crumbs: Crumb[]
}

/**
 * Wrap the base Provider with breadcrumb management implementation
 */
class BreadcrumbsProvider extends Component<Props, State> {
  state = {
    crumbs: []
  }

  addCrumb = (crumb: Crumb) => {
    // use function version of set state
    // to get accurate tracking between state
    this.setState(({ crumbs: prevCrumbs }) => ({
      crumbs: [...prevCrumbs, crumb]
    }))
  }

  removeCrumb = (crumbToRemove: Crumb) => {
    this.setState(({ crumbs: prevCrumbs }) => {
      let crumbIndex: number | undefined

      for (let i = 0; i < prevCrumbs.length; i++) {
        const { title, path } = prevCrumbs[i]
        if (crumbToRemove.title === title && crumbToRemove.path === path) {
          crumbIndex = i
          break
        }
      }

      let crumbs

      if (crumbIndex !== undefined) {
        crumbs = [...prevCrumbs]
        crumbs.splice(crumbIndex, 1)
      } else {
        crumbs = prevCrumbs
      }

      return { crumbs }
    })
  }

  render() {
    const { crumbs } = this.state
    const { children } = this.props

    const context = {
      crumbs,
      addCrumb: this.addCrumb,
      removeCrumb: this.removeCrumb
    }

    return <Provider value={context}>{children}</Provider>
  }
}

export { BreadcrumbsProvider }
