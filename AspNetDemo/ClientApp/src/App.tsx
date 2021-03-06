import * as React from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { StationSearch } from "./components/StationSearch";
import { RouteSearch } from "./components/RouteSearch";

export default class App extends React.Component<{}, {}> {
    public displayName = App.toString();

      public render() {
        return (
          <Layout>
            <Route exact path="/" component={Home} />
            <Route path="/stationsearch" component={StationSearch} />
            <Route path="/routesearch" component={RouteSearch} />
          </Layout>
        );
      }
}
