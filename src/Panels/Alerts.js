import React from 'react'
import { Alert } from 'reactstrap'

const Alerts = ({ color, title, subtitle, bottomComponent }) => {
    return (
        <React.Fragment>
        <Alert color={color}>
            <h4>{title}</h4>
            <p>
            {subtitle}
            </p>
            <p>
            {bottomComponent}
            </p>
          </Alert>
        </React.Fragment>
    )
}

export default Alerts
