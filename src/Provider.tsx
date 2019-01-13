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

  findCrumb = (crumb: Crumb, crumbs: Crumb[]): number | undefined => {
    for (let i = 0; i < crumbs.length; i++) {
      const { title, path } = crumbs[i];
      if (crumb.title === title && crumb.path === path) {
        return i;
      }
    }

    return undefined;
  }

  removeCrumb = (crumbToRemove: Crumb) => {
    this.setState(({ crumbs: prevCrumbs }) => {
      const crumbIndex = this.findCrumb(crumbToRemove, prevCrumbs);

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

  replaceCrumb = (crumbToReplace: Crumb, crumbReplacement: Crumb) => {
    this.setState(({ crumbs: prevCrumbs }) => {
      const crumbIndex = this.findCrumb(crumbToReplace, prevCrumbs);

      let crumbs

      if (crumbIndex !== undefined) {
        crumbs = [...prevCrumbs];
        crumbs.splice(crumbIndex, 1, crumbReplacement);
      } else {
        crumbs = prevCrumbs;
      }

      return { crumbs };
    })
  }

  render() {
    const { crumbs } = this.state
    const { children } = this.props

    const context = {
      crumbs,
      addCrumb: this.addCrumb,
      removeCrumb: this.removeCrumb,
      replaceCrumb: this.replaceCrumb
    }

    return <Provider value={context}>{children}</Provider>
  }
}

export { BreadcrumbsProvider }
