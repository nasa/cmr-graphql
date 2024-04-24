import React, { Suspense } from 'react'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '../../components/LoadingTable/LoadingTable'
import OrderOption from '../../components/OrderOptionPage/OrderOptionPage'
import Page from '../../components/Page/Page'

import useAppContext from '../../hooks/useAppContext'

const OrderOptionPage = () => {
  const { user } = useAppContext()
  const { providerId } = user

  return (
    <Page
      title={`${providerId} Order Options`}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: 'Order Options',
            to: '/order-options',
            active: true
          }
        ]
      }
      headerActions={
        [
          {
            label: 'New Order Option',
            to: 'new'
          }
        ]
      }
    >
      <ErrorBoundary>
        <Suspense fallback={<LoadingTable />}>
          <OrderOption />
        </Suspense>
      </ErrorBoundary>
    </Page>
  )
}

export default OrderOptionPage
