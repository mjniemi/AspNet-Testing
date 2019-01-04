import * as React from "react";
import { Col, Grid, Row } from "react-bootstrap";
import { NavMenu } from "./NavMenu";

export class Layout extends React.Component<{}, {}> {
    public displayName = Layout.toString();

    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <Grid fluid>
            <Row>
                <Col sm={3}>
                <NavMenu />
                </Col>
                <Col sm={9}>
                {this.props.children}
                </Col>
            </Row>
            </Grid>
        );
    }
}
