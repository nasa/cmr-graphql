import React, { Suspense } from 'react'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '../../components/LoadingTable/LoadingTable'
import OrderOptionList from '../../components/OrderOptionList/OrderOptionList'
import Page from '../../components/Page/Page'

import useAppContext from '../../hooks/useAppContext'

const OrderOptionListPage = () => {
  const { setPageTitle, user } = useAppContext()
  const { providerId } = user

  setPageTitle(`${providerId} Order Options`)

  return (
    <Page
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
          <OrderOptionList />
        </Suspense>
      </ErrorBoundary>
    </Page>
  )
}

export default OrderOptionListPage
