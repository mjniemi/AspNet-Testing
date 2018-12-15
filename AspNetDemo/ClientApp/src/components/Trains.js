import React, { Component } from 'react';

export class Trains extends Component {
    displayName = Trains.name

    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            selectedStation: "",
            isButtonDisabled: false,
            contents: "",
            arrivalTime: "",
            departureTime: ""
        };

        Trains.renderPageControls();

        fetch('api/Station/PopulateStations')
            .then(response => response.json())
            .then(data => {
                this.setState({ stations: data });
            });

    }

    trainDataFetch() {
        let contents = <p><em>Loading...</em></p>;

        let stationCode = this.state.selectedStation;
        this.setState({
            isButtonDisabled: true,
            contents: contents
        });

        // Button disabled for a few seconds to prevent repeated calls to VR api
        setTimeout(() => this.setState({ isButtonDisabled: false }), 5500);


        fetch('api/Train/GetTrainData?station='+stationCode)
            .then(response => response.json())
            .then(data => {
                this.setState({ contents: this.renderTrainTable(data) });
            });
    }

    stationChange(e) {
        this.setState({ selectedStation: e.target.value });
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

    changeTableRows(e) {
        let selected = e.target.value;
        let times = selected.split(",");
        let arrival = new Date(times[0]);
        let departure = new Date(times[1]);
        let arrivalString = (arrival.getHours()<10?'0':'') + arrival.getHours() + ":" + (arrival.getMinutes()<10?'0':'') + arrival.getMinutes();
        let departureString =(departure.getHours()<10?'0':'') + departure.getHours() + ":" +(departure.getMinutes()<10?'0':'') + departure.getMinutes();
        console.log(arrivalString);
        
        this.setState({ arrivalTime: arrivalString, departureTime: departureString });
    }

    renderTrainTable(trains) {
        
        return (
            <table className='table'>
                <thead>
                    <tr>
                        <th>Junan numero</th>
                        <th>Junan tyyppi</th>
                        <th>Junan kategoria</th>
                        <th>Asema</th>
                        <th>Saapumisaika</th>
                        <th>Lähtöaika</th>
                    </tr>
                </thead>
                <tbody>
                    {trains.map(train =>
                        <tr key={train.trainNumber}>
                            <td>{train.trainNumber}</td>
                            <td>{train.trainType}</td>
                            <td>{train.trainCategory}</td>
                            <td>
                                <select name={"" + train.trainNumber} onChange={this.changeTableRows.bind(this)}>
                                    {train.timetableRows.map(timetable =>
                                        <option key={timetable.stationShortCode} value={timetable.scheduledArrivalTime + "," + timetable.scheduledDepartureTime}> {timetable.stationName}</option>
                                        
                                    )}
                            </select>
                            </td>
                            <td>{this.state.arrivalTime}</td>
                            <td>{this.state.departureTime}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.contents;
        
        return (
            <div>
                <h1>Juna aikatauluja</h1>
                <p>Hakee tietoja asemalta seuraavaksi lähtevistä junista</p>
                <div className='controlsDiv'>
                    
                    <select name='stations-list' onChange={this.stationChange.bind(this)} >
                        {this.state.stations.map(station =>
                            
                            <option key={station.stationShortCode} value={station.stationShortCode}>{station.stationName}</option>
                            
                        )};
                    </select>


                    <button onClick={this.trainDataFetch.bind(this)} disabled={this.state.isButtonDisabled}>AAAAAAAAAAAAAAAAAA</button>
                    {this.renderPageControls}
                </div>
                {contents}
            </div>
        );
    }
}
