import React, { Suspense, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { snakeCase } from 'lodash-es'
import {
  Badge,
  Breadcrumb,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import For from '../For/For'
import CustomToggle from '../CustomToggle/CustomToggle'
import CustomMenu from '../CustomMenu/CustomMenu'
import useAppContext from '../../hooks/useAppContext'

const PageHeader = ({
  additionalActions,
  breadcrumbs,
  pageType,
  primaryActions
}) => {
  const {
    pageTitle
  } = useAppContext()

  return (
    <header
      className={
        classNames(
          [
            'd-flex flex-column align-items-start',
            {
              'sr-only': pageType === 'primary',
              '': pageType !== 'primary'
            }
          ]
        )
      }
    >
      <Suspense fallback="Loading (breadcrumbs)...">
        {
          breadcrumbs.length > 0 && (
            <Breadcrumb>
              <For each={breadcrumbs}>
                {
                  ({ active, label, to }, i) => {
                    if (!label) return null

                    return (
                      <Breadcrumb.Item
                        key={`breadcrumb-link_${to}_${i}`}
                        active={active}
                        linkProps={{ to }}
                        linkAs={Link}
                      >
                        {label}
                      </Breadcrumb.Item>
                    )
                  }
                }
              </For>
            </Breadcrumb>
          )
        }
      </Suspense>

      <div className="d-flex w-100 align-items-center justify-content-between">
        <Suspense fallback="Loading...">
          <h2
            className="m-0 text-gray-200 fs-2"
            style={
              {
                fontWeight: 700,
                letterSpacing: '-0.015rem'
              }
            }
          >
            {pageTitle}
          </h2>
          {
            primaryActions && (
              <div className="d-flex flex-row">
                <For each={primaryActions}>
                  {
                    (
                      {
                        icon,
                        iconTitle,
                        onClick,
                        title: buttonTitle,
                        to,
                        variant
                      }
                    ) => {
                      if (to) {
                        return (
                          <Link
                            key={buttonTitle}
                            to={to}
                          >
                            <Button
                              className="ms-2"
                              as={Button}
                              size="sm"
                              Icon={icon}
                              iconTitle={iconTitle}
                              variant={variant}
                            >
                              {buttonTitle}
                            </Button>
                          </Link>
                        )
                      }

                      return (
                        <Button
                          className="ms-2"
                          size="sm"
                          key={buttonTitle}
                          Icon={icon}
                          iconTitle={iconTitle}
                          variant={variant}
                          onClick={onClick}
                        >
                          {buttonTitle}
                        </Button>
                      )
                    }
                  }
                </For>
                {
                  additionalActions && (
                    <Dropdown className="ms-2" align="end">
                      <DropdownToggle as={CustomToggle} id="dropdown-custom-components" />
                      <DropdownMenu as={CustomMenu}>
                        <For each={additionalActions}>
                          {
                            (
                              {
                                count: actionCount,
                                onClick: actionOnClick,
                                title: actionTitle
                              }
                            ) => (
                              <DropdownItem
                                className="d-flex flex-row align-items-center"
                                key={actionTitle}
                                eventKey={snakeCase(actionTitle)}
                                onClick={actionOnClick}
                              >
                                <span>{actionTitle}</span>
                                {
                                  actionCount !== null && (
                                    <Badge
                                      className="ms-2 text-secondary"
                                      pill
                                      bg="light-dark"
                                    >
                                      {actionCount}
                                    </Badge>
                                  )
                                }
                              </DropdownItem>
                            )
                          }
                        </For>
                      </DropdownMenu>
                    </Dropdown>
                  )
                }
              </div>
            )
          }
        </Suspense>
      </div>
    </header>
  )
}

PageHeader.defaultProps = {
  additionalActions: null,
  breadcrumbs: [],
  pageType: 'primary',
  primaryActions: []
}

PageHeader.propTypes = {
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

export default PageHeader
