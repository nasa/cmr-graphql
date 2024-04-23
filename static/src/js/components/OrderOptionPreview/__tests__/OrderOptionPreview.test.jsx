import { render, screen } from '@testing-library/react'
import React, { Suspense } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import * as router from 'react-router'
import userEvent from '@testing-library/user-event'

import AppContext from '../../../context/AppContext'
import OrderOptionPreview from '../OrderOptionPreview'
import { GET_ORDER_OPTION } from '../../../operations/queries/getOrderOption'

import errorLogger from '../../../utils/errorLogger'

vi.mock('../../../utils/errorLogger')

const setup = ({
  overrideMocks = false
}) => {
  const mockOrderOption = {
    conceptId: 'OO1200000099-MMT_2',
    deprecated: true,
    description: 'Mock order option description',
    form: 'Mock form',
    name: 'Mock order option',
    nativeId: '1234-abcd-5678-efgh',
    revisionDate: '2024-04-16T18:20:12.124Z',
    revisionId: '1',
    scope: 'PROVIDER',
    sortKey: 'Mock',
    __typename: 'OrderOption'

  }
  const mocks = [{
    request: {
      query: GET_ORDER_OPTION,
      variables: {
        params: {
          conceptId: 'OO12000000-MMT_2'
        }
      }
    },
    result: {
      data: {
        orderOption: mockOrderOption
      }
    }
  }]
  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        }
      }
    }
    >
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <MemoryRouter initialEntries={['/order-options/OO12000000-MMT_2']}>
          <Routes>
            <Route
              path="/order-options"
            >
              <Route
                path=":conceptId"
                element={
                  (
                    <Suspense>
                      <OrderOptionPreview />
                    </Suspense>
                  )
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </AppContext.Provider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('OrderOptionPreview', () => {
  describe('when getting order option results in a success', () => {
    test('renders the order options', async () => {
      setup({})
      await waitForResponse()

      expect(screen.getByText('Mock order option description')).toBeInTheDocument()
      expect(screen.getByText('PROVIDER')).toBeInTheDocument()
      expect(screen.getByText('Mock form')).toBeInTheDocument()
    })
  })

  describe('when the order option could not be returned after 5 tries', () => {
    test('calls error logger', async () => {
      const refetch = vi.fn()
      const refetchRequest = {
        request: {
          query: GET_ORDER_OPTION,
          variables: {
            params: {
              conceptId: 'OO12000000-MMT_2'
            }
          }
        },
        result: {
          data: {
            orderOption: null
          },
          fetch: refetch
        }
      }
      setup({
        overrideMocks: [
          refetchRequest,
          refetchRequest,
          refetchRequest,
          refetchRequest,
          refetchRequest,
          refetchRequest
        ]
      })

      // Need to wait for response 5 times so it can fetch the response 5 time
      await waitForResponse()
      await waitForResponse()
      await waitForResponse()
      await waitForResponse()
      await waitForResponse()
      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Max retries allowed', 'OrderOptionPreview: getOrderOption Query')
    })
  })

  describe('when the order does not have SortKey and Deprecated ', () => {
    test('render false for Deprecated and Blank name for SortKey', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_ORDER_OPTION,
            variables: {
              params: {
                conceptId: 'OO12000000-MMT_2'
              }
            }
          },
          result: {
            data: {
              orderOption: {
                conceptId: 'OO1200000099-MMT_2',
                deprecated: null,
                description: 'Mock order option description',
                form: 'Mock form',
                name: 'Mock order option',
                nativeId: '1234-abcd-5678-efgh',
                revisionDate: '2024-04-16T18:20:12.124Z',
                revisionId: '1',
                scope: 'PROVIDER',
                sortKey: null,
                __typename: 'OrderOption'
              }
            }
          }
        }
        ]
      })

      await waitForResponse()

      expect(screen.getByText('<Blank Sort Key>')).toBeInTheDocument()
      expect(screen.getByText('false')).toBeInTheDocument()
    })
  })

  describe('when clicking on Edit Order Option link', () => {
    test('should navigate to /order-option/OO12000000-MMT_2/edit', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({})

      await waitForResponse()

      const editLink = screen.getByRole('button', { name: 'Edit Order Option' })

      await user.click(editLink)

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/order-options/OO12000000-MMT_2/edit')
    })
  })
})
