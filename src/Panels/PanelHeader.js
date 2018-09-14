import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import { PulseLoader } from 'react-spinners'

const PanelHeader = ({ title, subtitle, showLoadingIndicator}) => {
    return (
        <Container>
            <Row>
                <Col md={5} className="align-self-end">
                <h3>
                    <strong>{title}     <small>{subtitle}</small></strong>     
                </h3>            
                </Col>
                <Col md={7} className="text-center text-md-right">
                    <PulseLoader sizeUnit={"px"} size={10} color={'#9B9B9B'} loading={showLoadingIndicator} />
                </Col>
            </Row>
            <hr />
        </Container>
    )
}

export default PanelHeader