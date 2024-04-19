import React, { Suspense } from 'react'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '../../components/LoadingTable/LoadingTable'
import OrderOptionList from '../../components/OrderOptionList/OrderOptionList'
import Page from '../../components/Page/Page'

import useAppContext from '../../hooks/useAppContext'

const OrderOptionListPage = () => {
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
    >
      <ErrorBoundary>
        <Suspense fallback={<LoadingTable />}>
          <OrderOptionList />
        </Suspense>
      </ErrorBoundary>
    </Page>
  )
}

export default OrderOptionListPage
