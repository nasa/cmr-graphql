import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import moment from 'moment'
import {
  Button,
  Col,
  Row
} from 'react-bootstrap'

import { useSuspenseQuery } from '@apollo/client'

import { GET_ORDER_OPTION } from '../../operations/queries/getOrderOption'

import useAppContext from '../../hooks/useAppContext'

import errorLogger from '../../utils/errorLogger'

import Page from '../Page/Page'

/**
 * Renders a OrderOptionPreview component
 *
 * @component
 * @example <caption>Render a OrderOptionPreview</caption>
 * return (
 *   <OrderOptionPreview />
 * )
 */
const OrderOptionPreview = () => {
  const {
    savedDraft
  } = useAppContext()

  const { conceptId } = useParams()

  const navigate = useNavigate()

  const [retries, setRetries] = useState(0)

  const { data, refetch } = useSuspenseQuery(GET_ORDER_OPTION, {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { orderOption } = data

  useEffect(() => {
    const { revisionId: savedRevisionId } = savedDraft || {}
    if (
      (!orderOption && retries < 5)
      || (savedRevisionId && orderOption.revisionId !== savedRevisionId)) {
      refetch()
      setRetries(retries + 1)
    }

    if (retries >= 5) {
      errorLogger('Max retries allowed', 'OrderOptionPreview: getOrderOption Query')
      throw new Error('Order Option could not be loaded.')
    }
  }, [orderOption, retries])

  const {
    deprecated = false,
    description,
    form,
    name,
    revisionDate,
    scope,
    sortKey
  } = orderOption || {}

  const orderOptionItems = (title, value) => (
    <div className="list-inline fs-6 pb-4">
      <span className="list-inline-item fw-bold text-muted text-decoration-underline">
        {title}
        :
      </span>
      <span className="list-inline-item">
        {' '}
        {value}
        {' '}
      </span>
    </div>
  )

  const handleEdit = () => {
    navigate(`/order-options/${conceptId}/edit`)
  }

  return (
    <Page
      title={name}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: 'Order Options',
            to: '/order-options'
          },
          {
            label: name,
            active: true
          }
        ]
      }
    >
      <Row>
        <Col className="mb-5" md={12}>
          <Button
            className="btn btn-link fs-5 pb-3"
            type="button"
            variant="link"
            onClick={handleEdit}
          >
            Edit Order Option
          </Button>

          <Col className="p-3" md={12}>
            {orderOptionItems('Description', description)}

            {orderOptionItems('Last Updated', moment(revisionDate).format('LLLL'))}

            {orderOptionItems('Scope', scope)}

            {orderOptionItems('Deprecated', deprecated ? 'true' : 'false')}

            {orderOptionItems('Sort Key', sortKey || '<Blank Sort Key>')}

            <Col className="list-inline-item fw-bold text-muted text-decoration-underline">
              Form XML
              :
            </Col>
            <Col className="list-inline-item" md={12}>
              <pre>
                {form}
              </pre>
            </Col>
          </Col>

        </Col>
      </Row>

    </Page>
  )
}

export default OrderOptionPreview
