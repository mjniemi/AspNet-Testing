import * as React from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { StationSearch } from "./components/StationSearch";
import { RouteSearch } from "./components/RouteSearch";

interface IState {
    selectedStation: string;
}

export default class App extends React.Component<{}, IState> {
    public displayName = App.toString();

    constructor(props) {
        super(props);

        this.state = {
            selectedStation: "",
        };

        this.setStation = this.setStation.bind(this);

    }

    public render() {
        return (
            <Layout>
                <Route exact path="/" component={Home} />
                <Route path="/stationsearch" render={(props) => <StationSearch selectedStation={this.state.selectedStation} setSelected={this.setStation} />} />
                <Route path="/routesearch" render={(props) => <RouteSearch selectedStation={this.state.selectedStation} setSelected={this.setStation} />} />
            </Layout>
        );
    }

    public setStation(name: string) {
        this.setState({ selectedStation: name });
    }
}
