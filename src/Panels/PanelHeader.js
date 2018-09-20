import React from 'react'
import { Col, Row, Container } from 'reactstrap'

const PanelHeader = ({ title, subtitle, rightComponent}) => {
    return (
        <Container>
            <Row>
                <Col md={9} className="align-self-end">
                <h3>
                    <strong>{title}     <small>{subtitle}</small></strong>     
                </h3>            
                </Col>
                <Col md={3} className="align-self-end text-right">
                {rightComponent}        
                </Col>
            </Row>
            <hr />
        </Container>
    )
}

export default PanelHeader