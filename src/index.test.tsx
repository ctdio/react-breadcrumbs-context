import React, { Component } from 'react'
import { mount } from 'enzyme'
import uuidV4 from 'uuid/v4'

import {
  BreadcrumbsProvider,
  BreadcrumbsConsumer,
  withBreadcrumb,
  Crumb
} from './index'

interface TestComponentProps {
  str: string
}

const TestComponent = (props: any) => <div />
const TestComponentWithProps = (props: TestComponentProps) => <div />

class Dismounter extends Component {
  state = {
    mounted: true
  }

  componentDidMount() {
    setImmediate(() => this.setState({ mounted: false }))
  }

  render() {
    return this.state.mounted ? this.props.children : null
  }
}

test('should register breadcrumbs with addCrumb', () => {
  const testCrumb: Crumb = {
    title: uuidV4(),
    path: uuidV4()
  }

  const wrapper = mount(
    <BreadcrumbsProvider>
      <BreadcrumbsConsumer>
        {props => <TestComponent {...props} />}
      </BreadcrumbsConsumer>
    </BreadcrumbsProvider>
  )

  const { addCrumb }: any = wrapper.find(TestComponent).props()
  addCrumb(testCrumb)
  wrapper.update()

  const { crumbs }: any = wrapper.find(TestComponent).props()
  expect(crumbs).toEqual([testCrumb])
})

test('should push track crumbs in order they were added', () => {
  const testCrumbB: Crumb = {
    title: uuidV4(),
    path: uuidV4()
  }

  const testCrumbA: Crumb = {
    title: uuidV4(),
    path: uuidV4()
  }

  const wrapper = mount(
    <BreadcrumbsProvider>
      <BreadcrumbsConsumer>
        {props => <TestComponent {...props} />}
      </BreadcrumbsConsumer>
    </BreadcrumbsProvider>
  )

  const { addCrumb }: any = wrapper.find(TestComponent).props()
  addCrumb(testCrumbA)
  addCrumb(testCrumbB)
  wrapper.update()

  const { crumbs }: any = wrapper.find(TestComponent).props()

  expect(crumbs).toEqual([testCrumbA, testCrumbB])
})

test('should remove crumbs using removeCrumb', () => {
  const testCrumb: Crumb = {
    title: uuidV4(),
    path: uuidV4()
  }

  const wrapper = mount(
    <BreadcrumbsProvider>
      <BreadcrumbsConsumer>
        {props => <TestComponent {...props} />}
      </BreadcrumbsConsumer>
    </BreadcrumbsProvider>
  )

  const { addCrumb }: any = wrapper.find(TestComponent).props()
  addCrumb(testCrumb)
  wrapper.update()

  const { crumbs: crumbsA }: any = wrapper.find(TestComponent).props()
  expect(crumbsA).toEqual([testCrumb])

  const { removeCrumb }: any = wrapper.find(TestComponent).props()
  removeCrumb(testCrumb)
  wrapper.update()

  const { crumbs: crumbsB }: any = wrapper.find(TestComponent).props()

  expect(crumbsB).toEqual([])
})

test('should automatically add breadcrumb upon render when using withBreadcrumb HOC', () => {
  const testCrumb: Crumb = {
    title: uuidV4(),
    path: uuidV4()
  }

  const TestComponentWithBreadcrumb = withBreadcrumb(testCrumb)(TestComponent)

  let trackedCrumbs

  mount(
    <BreadcrumbsProvider>
      <TestComponentWithBreadcrumb />
      <BreadcrumbsConsumer>
        {({ crumbs }) => {
          trackedCrumbs = crumbs
          return null
        }}
      </BreadcrumbsConsumer>
    </BreadcrumbsProvider>
  )

  expect(trackedCrumbs).toEqual([testCrumb])
})

test('should automatically remove breadcrumb upon unmount when using withBreadcrumb HOC', async () => {
  const testCrumbA: Crumb = {
    title: uuidV4(),
    path: uuidV4()
  }

  const testCrumbB: Crumb = {
    title: uuidV4(),
    path: uuidV4()
  }

  const TestComponentWithBreadcrumbA = withBreadcrumb(testCrumbA)(TestComponent)
  const TestComponentWithBreadcrumbB = withBreadcrumb(testCrumbB)(TestComponent)

  let trackedCrumbs

  const wrapper = mount(
    <BreadcrumbsProvider>
      <TestComponentWithBreadcrumbA />
      <Dismounter>
        <TestComponentWithBreadcrumbB />
      </Dismounter>
      <BreadcrumbsConsumer>
        {({ crumbs }) => {
          trackedCrumbs = crumbs
          return null
        }}
      </BreadcrumbsConsumer>
    </BreadcrumbsProvider>
  )

  expect(trackedCrumbs).toEqual([testCrumbA, testCrumbB])

  await new Promise(resolve => setImmediate(resolve))
  wrapper.update()

  expect(trackedCrumbs).toEqual([testCrumbA])
})

test('should allow for breadcrumb data to be derived from props', async () => {
  const testCrumbA: Crumb = {
    title: uuidV4(),
    path: uuidV4()
  }
  const testCrumbB: Crumb = {
    title: uuidV4(),
    path: uuidV4()
  }

  const TestComponentWithBreadcrumbA = withBreadcrumb(testCrumbA)(TestComponent)
  const TestComponentWithBreadcrumbB = withBreadcrumb(testCrumbB)(TestComponent)

  let trackedCrumbs

  const wrapper = mount(
    <BreadcrumbsProvider>
      <TestComponentWithBreadcrumbA />
      <Dismounter>
        <TestComponentWithBreadcrumbB />
      </Dismounter>
      <BreadcrumbsConsumer>
        {({ crumbs }) => {
          trackedCrumbs = crumbs
          return null
        }}
      </BreadcrumbsConsumer>
    </BreadcrumbsProvider>
  )

  expect(trackedCrumbs).toEqual([testCrumbA, testCrumbB])

  await new Promise(resolve => setImmediate(resolve))
  wrapper.update()

  expect(trackedCrumbs).toEqual([testCrumbA])
})

test('should allow for props to be derived from wrapped component', async () => {
  const str = uuidV4()

  const TestComponentWithBreadcrumb = withBreadcrumb<TestComponentProps>(
    ({ str }) => ({
      title: str,
      path: str
    })
  )(TestComponentWithProps)

  let trackedCrumbs

  mount(
    <BreadcrumbsProvider>
      <TestComponentWithBreadcrumb str={str} />
      <BreadcrumbsConsumer>
        {({ crumbs }) => {
          trackedCrumbs = crumbs
          return null
        }}
      </BreadcrumbsConsumer>
    </BreadcrumbsProvider>
  )

  expect(trackedCrumbs).toEqual([{ title: str, path: str }])
})
