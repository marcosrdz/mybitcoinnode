import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import { PulseLoader } from 'react-spinners'

const PanelHeader = ({ title, subtitle, showLoadingIndicator}) => {
    return (
        <Container>
            <Row>
                <Col>
                    <Row>
                        <Col xs="6" sm="2">
                            <h1>{title}</h1>
                        </Col>
                        <Col  xs="6" sm="2">
                            <h6>{subtitle}</h6>
                        </Col>
                    </Row>
                </Col>
                <Col sm="1">
                    <PulseLoader sizeUnit={"px"} size={10} color={'#9B9B9B'} loading={showLoadingIndicator} />
                </Col>
            </Row>
        </Container>
    )
}

export default PanelHeader