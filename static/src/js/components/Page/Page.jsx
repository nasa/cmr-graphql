import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import './Page.scss'
// Import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import PageHeader from '../PageHeader/PageHeader'

/**
 * @typedef {Object} PrimaryAction
 * @property {ReactNode} icon The icon for the action.
 * @property {Function} onClick The onClick callback for the action.
 * @property {String} title The label for the action.
 * @property {String} to The location to be passed to react router.
 * @property {String} variant The Bootstrap variant for the button".
 */

/**
 * @typedef {Object} AdditionalAction
 * @property {Function} onClick The onClick callback for the action.
 * @property {String} count The label for the action.
 * @property {String} to The location to be passed to react router.
 */

/**
 * @typedef {Object} Breadcrumb
 * @property {String} label The label for the header action.
 * @property {String} to The location to be set when clicked.
 * @property {Boolean} active A boolean flag to trigger the active state
 */

/**
 * @typedef {Object} PageProps
 * @property {Array.<AdditionalAction>} additionalActions The additional header actions, displayed in a dripdown list.
 * @property {Array.<Breadcrumb>} breadcrumbs The page content.
 * @property {ReactNode} children The page content.
 * @property {Array.<PrimaryAction>} primaryActions The primary actions displayed in the header.
 * @property {String} pageType A string representing the type of page.
 * @property {String} secondaryTitle A secondary title.
 * @property {String} title A string of text to serve as the page title.
 */

/*
 * Renders a `For` component.
 *
 * The component is used to create a page
 *
 * @param {PageProps} props
 *
 * @component
 * @example <caption>Render a page</caption>
 * return (
 *   <Page
 *      title="This is a title"
 *      pageType="primary"
 *      headerActions={[{ label: 'Action Label', to="/action/location" }]}
 *   >
 *      <div>This is some page content</div>
 *   </Page>
 * )
 */
const Page = ({
  breadcrumbs,
  children,
  pageType,
  primaryActions,
  header,
  additionalActions
}) => (
  <div className="w-100 overflow-hidden">
    <Container fluid className="mx-0 mb-5">
      <Row className="py-3 mb-0">
        <Col className="px-5 pt-0">
          <Suspense fallback=":)">
            {header}
          </Suspense>
        </Col>
      </Row>
      <Row>
        <Col className="px-5 mt-4">
          <Suspense fallback="Loading (page.children)...">
            {children}
          </Suspense>
        </Col>
      </Row>
    </Container>
  </div>
)

Page.defaultProps = {
  additionalActions: null,
  breadcrumbs: [],
  pageType: 'primary',
  primaryActions: []
}

Page.propTypes = {
  additionalActions: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      onClick: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired
  ),
  // Disabling the following rule to allow undefined to be passed as a value in the array
  // eslint-disable-next-line react/forbid-prop-types
  breadcrumbs: PropTypes.array,
  children: PropTypes.node.isRequired,
  pageType: PropTypes.string,
  primaryActions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.func,
      iconTitle: PropTypes.string,
      title: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      to: PropTypes.string,
      variant: PropTypes.string.isRequired
    }).isRequired
  )
}

export default Page
