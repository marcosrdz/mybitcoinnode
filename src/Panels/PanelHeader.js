import React from 'react'
import { Col, Row, Container } from 'reactstrap'

const PanelHeader = ({ title, subtitle, showLoadingIndicator}) => {
    return (
        <Container>
            <Row>
                <Col md={5} className="align-self-end">
                <h3>
                    <strong>{title}     <small>{subtitle}</small></strong>     
                </h3>            
                </Col>
            </Row>
            <hr />
        </Container>
    )
}

export default PanelHeader