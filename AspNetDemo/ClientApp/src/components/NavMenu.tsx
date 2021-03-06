﻿import * as React from "react";
import { Link } from "react-router-dom";
import { Glyphicon, Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./NavMenu.css";

export class NavMenu extends React.Component<{}, {}> {
    public displayName = NavMenu.toString();

  public render() {
    return (
      <Navbar inverse fixedTop fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={"/"}>AspNetDemo</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to={"/"} exact>
              <NavItem>
                <Glyphicon glyph="home" /> Koti
              </NavItem>
            </LinkContainer>
            <LinkContainer to={"/stationsearch"}>
                <NavItem>
                    <Glyphicon glyph="th-list" /> Asemahaku
                </NavItem>
            </LinkContainer>
            <LinkContainer to={"/routesearch"}>
                <NavItem>
                    <Glyphicon glyph="th-list" /> Reittihaku
                </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
