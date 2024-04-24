import React, { useEffect } from 'react'
import moment from 'moment'
import {
  Button,
  Col,
  Row
} from 'react-bootstrap'

import { useSuspenseQuery } from '@apollo/client'

import { useNavigate, useParams } from 'react-router'
import { GET_ORDER_OPTION } from '../../operations/queries/getOrderOption'
import useAppContext from '../../hooks/useAppContext'

const OrderOption = () => {
  const {
    // savedDraft
    setPageTitle
  } = useAppContext()

  const { conceptId } = useParams()

  const navigate = useNavigate()

  const { data } = useSuspenseQuery(GET_ORDER_OPTION, {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { orderOption } = data

  const {
    deprecated = false,
    description,
    form,
    revisionDate,
    name,
    scope,
    sortKey
  } = orderOption

  useEffect(() => {
    setPageTitle(name)
  }, [name])

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

  // UseEffect(() => {
  //   const { revisionId: savedRevisionId } = savedDraft || {}
  //   if (
  //     (!orderOption && retries < 5)
  //     || (savedRevisionId && orderOption.revisionId !== savedRevisionId)) {
  //     refetch()
  //     setRetries(retries + 1)
  //   }

  //   if (retries >= 5) {
  //     errorLogger('Max retries allowed', 'OrderOptionPreview: getOrderOption Query')
  //     setError('Order Option could not be loaded.')
  //   }
  // }, [orderOption, retries])

  return (
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
  )
}

export default OrderOption
