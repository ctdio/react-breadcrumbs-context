import React, { Component, ComponentType } from 'react'

import { BreadcrumbsConsumer } from './Consumer'
import { Crumb } from './types'

interface Props {
  crumb: Crumb
  addCrumb: (crumb: Crumb) => void
  removeCrumb: (crumb: Crumb) => void
  replaceCrumb: (oldCrumb: Crumb, newCrumb: Crumb) => void
}

/**
 * Helper component for registering breadcrumbs when
 * rendering a component using the withCrumbs HOC
 */
class WithBreadcrumbWrapper extends Component<Props> {
  constructor(props: Props) {
    super(props)

    const { addCrumb, crumb } = props
    addCrumb(crumb)
  }

  componentWillUnmount() {
    const { crumb, removeCrumb } = this.props
    removeCrumb(crumb)
  }

  componentDidUpdate(prevProps: Props) {
    const { crumb, replaceCrumb } = this.props
    if (
      prevProps.crumb.title !== crumb.title ||
      prevProps.crumb.path !== crumb.path
    ) {
      replaceCrumb(prevProps.crumb, crumb)
    }
  }

  render() {
    return this.props.children
  }
}

export const withBreadcrumb = <PropsType extends {} = any>(
  crumb: Crumb | ((props: PropsType) => Crumb)
) => (WrappedComponent: ComponentType<PropsType>) => (props: PropsType) => (
  <BreadcrumbsConsumer>
    {({ addCrumb, removeCrumb, replaceCrumb }) => (
      <WithBreadcrumbWrapper
        crumb={typeof crumb === 'function' ? crumb(props) : crumb}
        addCrumb={addCrumb}
        removeCrumb={removeCrumb}
        replaceCrumb={replaceCrumb}
      >
        <WrappedComponent {...props} />
      </WithBreadcrumbWrapper>
    )}
  </BreadcrumbsConsumer>
)
