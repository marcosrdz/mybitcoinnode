import React from 'react'
import { Col, Row, PageHeader } from 'react-bootstrap'
import { PulseLoader } from 'react-spinners'

const PanelHeader = ({ title, subtitle, showLoadingIndicator}) => {
    return (
        <PageHeader>
          <Row className="show-grid">
            <Col xs={12} md={10}>
                {title} <small> {subtitle}</small>
              </Col>
            <Col xsHidden md={2}>
                <PulseLoader sizeUnit={"px"} size={10} color={'#9B9B9B'} loading={showLoadingIndicator} />
            </Col>
          </Row>
        </PageHeader>
    )
}

export default PanelHeader