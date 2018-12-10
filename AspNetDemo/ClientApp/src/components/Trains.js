import React, { Component } from 'react';

export class Trains extends Component {
    displayName = Trains.name

    constructor(props) {
        super(props);
        this.state = { trains: [], loading: true };

        Trains.renderPageControls();

        //fetch('api/Train/GetTrainData')
        //    .then(response => response.json())
        //    .then(data => {
        //        console.log(data);
        //        let arr = [];
        //        arr = data;
        //        console.log(arr);
        //        //this.setState({ trains: data, loading: false });
        //    });
    }

    trainDataFetch() {
        fetch('api/Train/GetTrainData')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let arr = [];
                arr = data;
                console.log(arr);
                //Trains.state.trains = data;
                //Trains.state.loading = false;
                //Trains.state = { trains: data, loading: false };
                this.setState({ trains: data, loading: false });
            });
    }

    static renderPageControls() {
        return (
            <div className='trainControlsDiv'>
                 
            <table className='trainControls'>
                <thead>
                    <tr>
                        <th>Valitse asema</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                          
                    </tr>
                </tbody>
                </table>
            </div>
            );
    }

    static renderTrainTable(trains) {
        return (
            <table className='table'>
                <thead>
                    <tr>
                        <th>Juna</th>
                    </tr>
                </thead>
                <tbody>
                    {trains.map(train =>
                        <tr key={train.trainNumber}>
                            <td>{train.trainNumber}</td>
                            <td>{train.trainType}</td>
                            <td>{train.trainCategory}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Trains.renderTrainTable(this.state.trains);

        return (
            <div>
                <h1>Juna aikatauluja</h1>
                <p>Hakee tietoja aseman lähtevistä ja saapuvista junista</p>
                <div className='controlsDiv'>
                    <button onClick={this.trainDataFetch.bind(this)}>Activate Lasers</button>
                    {this.renderPageControls}
                </div>
                {contents}
            </div>
        );
    }
}
