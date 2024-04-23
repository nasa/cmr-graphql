import React, { useLayoutEffect, useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { Navigate, createBrowserRouter } from 'react-router-dom'

import { useLazyQuery } from '@apollo/client'
import DraftsPage from './pages/DraftsPage/DraftsPage'
import SearchPage from './pages/SearchPage/SearchPage'
import HomePage from './pages/HomePage/HomePage'
import ManageCollectionAssociation from './pages/ManageCollectionAssociation/ManageCollectionAssociation'

import AuthCallbackContainer from './components/AuthCallbackContainer/AuthCallbackContainer'
import AuthRequiredContainer from './components/AuthRequiredContainer/AuthRequiredContainer'
import CollectionAssociationSearch from './components/CollectionAssociationSearch/CollectionAssociationSearch'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Layout from './components/Layout/Layout'
import LoadingBanner from './components/LoadingBanner/LoadingBanner'
import Notifications from './components/Notifications/Notifications'
import OrderOptionListPage from './pages/OrderOptionListPage/OrderOptionListPage'
import OrderOptionPreview from './components/OrderOptionPreview/OrderOptionPreview'
import OrderOptionForm from './components/OrderOptionForm/OrderOptionForm'
import Page from './components/Page/Page'
import PublishPreview from './components/PublishPreview/PublishPreview'
import REDIRECTS from './constants/redirectsMap/redirectsMap'
import RevisionList from './components/RevisionList/RevisionList'
import TemplateForm from './components/TemplateForm/TemplateForm'
import TemplateList from './components/TemplateList/TemplateList'
import TemplatePreview from './components/TemplatePreview/TemplatePreview'

import '../css/index.scss'

import errorLogger from './utils/errorLogger'
import getPermittedUser from './utils/getPermittedUser'

import useAppContext from './hooks/useAppContext'
import useNotificationsContext from './hooks/useNotificationsContext'

import { GET_ACLS } from './operations/queries/getAcls'

import withProviders from './providers/withProviders/withProviders'

/**
 * Renders the `App` component
 *
 * @component
 * @example <caption>Renders a `App` component</caption>
 * return (
 *   <App />
 * )
 */
export const App = () => {
  useLayoutEffect(() => {
    document.body.classList.remove('is-loading')
  }, [])

  const { addNotification } = useNotificationsContext()

  const {
    user, setProviderId, setProviderIds
  } = useAppContext()

  const { uid } = user

  const permittedUser = getPermittedUser(user)

  const [getProviders] = useLazyQuery(GET_ACLS, {
    variables: {
      params: {
        permittedUser,
        target: 'PROVIDER_CONTEXT'
      }
    },
    onCompleted: (getProviderData) => {
      const { acls } = getProviderData
      const { items } = acls

      if (items.length > 0) {
        const providerList = items.map(({ acl }) => acl.provider_identity.provider_id)

        setProviderIds(providerList)

        // Check if user does not have providerId
        // and set it to the first providerId if available
        const { providerId } = user
        if (!providerId && providerList.length > 0) {
          setProviderId(providerList[0])
        }
      }
    },
    onError: (getProviderError) => {
      // Todo: Hackish, we really only want to call getProviders if uid is not null
      // Seems to be re-fetching whenever uid changes
      if (uid) {
        // Send the error to the errorLogger
        errorLogger(getProviderError, 'Error fetching providers')
        addNotification({
          message: 'An error occurred while fetching providers.',
          variant: 'danger'
        })
      }
    }
  })

  useEffect(() => {
    if (uid) {
      getProviders()
    }
  }, [user])

  const router = createBrowserRouter([
    {
      path: '/',
      exact: true,
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <HomePage />
        }
      ]
    },
    {
      path: '/auth_callback',
      exact: true,
      element: <Layout />,
      children: [
        {
          path: '/auth_callback',
          element: <AuthCallbackContainer />
        }
      ]
    },
    ...Object.keys(REDIRECTS).map((redirectKey) => ({
      path: redirectKey,
      element: <Navigate replace to={`/${REDIRECTS[redirectKey]}`} />
    })),
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          element: <AuthRequiredContainer />,
          children: [
            {
              path: ':type',
              element: <SearchPage />
            },
            {
              path: ':type/:conceptId',
              element: <PublishPreview />
            },
            {
              path: ':type/:conceptId/:revisionId',
              element: <PublishPreview />
            },
            {
              path: '/:type/:conceptId/collection-association',
              element: <ManageCollectionAssociation />
            },
            {
              path: '/:type/:conceptId/collection-association-search',
              element: <CollectionAssociationSearch />
            },
            {
              path: '/:type/:conceptId/:revisionId/collection-association-search',
              element: <CollectionAssociationSearch />
            },
            {
              path: '/:type/:conceptId/revisions',
              element: <RevisionList />
            },
            {
              path: '/:type/:conceptId/revisions/:revisionId',
              element: <PublishPreview isRevision />
            },
            // TODO This is the only place we use a wild card here. Should we do that elsewhere or remove it here to match the other nested routes?
            {
              path: '/drafts/:draftType/*',
              element: <DraftsPage />
            },
            {
              path: '/order-options',
              element: <OrderOptionList />
            },
            {
              path: '/order-options/:conceptId',
              element: <OrderOptionPreview />
            },
            {
              path: 'templates/:templateType',
              element: <TemplateList />
            },
            {
              path: 'templates/:templateType/new',
              element: <TemplateForm />
            },
            {
              path: 'templates/:templateType/:id',
              element: <TemplatePreview />
            },
            {
              path: 'templates/:templateType/:id/:sectionName',
              element: <TemplateForm />
            },
            {
              path: 'templates/:templateType/:id/:sectionName/:fieldName',
              element: <TemplateForm />
            }
          ]
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    },
    {
      path: '/404',
      element: <Page title="404 Not Found" pageType="secondary">Not Found :(</Page>
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
      <Notifications />
    </>
  )
}

export default withProviders(App)
