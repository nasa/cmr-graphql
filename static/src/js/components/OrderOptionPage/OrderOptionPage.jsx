import React, { Suspense } from 'react'

import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import Page from '../Page/Page'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import OrderOption from '../OrderOption/OrderOption'
import PageHeader from '../PageHeader/PageHeader'
import { GET_ORDER_OPTION } from '../../operations/queries/getOrderOption'

const OrderOptionPageHeader = () => {
  const { conceptId } = useParams()

  const { data } = useSuspenseQuery(GET_ORDER_OPTION, {
    variables: {
      params: {
        conceptId
      }
    }
  })

  return (
    <PageHeader
      additionalActions={[]}
      breadcrumbs={
        [
          {
            label: 'Order Options',
            to: '/order-options'
          },
          {
            label: data.orderOption.name,
            active: true
          }
        ]
      }
      pageType="secondary"
      primaryActions={[]}
    />
  )
}

/**
 * Renders a OrderOptionPage component
 *
 * @component
 * @example <caption>Render a OrderOptionPage</caption>
 * return (
 *   <OrderOptionPage />
 * )
 */
const OrderOptionPage = () => (
  <Page
    pageType="secondary"
    header={<OrderOptionPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <OrderOption />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default OrderOptionPage
