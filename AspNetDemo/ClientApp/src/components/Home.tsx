import * as React from "react";

export class Home extends React.Component<{}, {}> {
    public displayName = Home.toString();

    public render() {
        return (
            <div>
                <h1>AspNet + React demosovellus</h1>
                <br></br>
                <p>Liikennetietojen l&auml;hde Liikennevirasto / rata.digitraffic.fi, lisenssi CC 4.0 BY</p>
            </div>
        );
    }
}
