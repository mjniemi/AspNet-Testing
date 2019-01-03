import './TrainPages.css';
import React, { Component } from 'react';
import ReactTable from "react-table";
import DatePicker from 'react-date-picker';
import Modal from "react-modal";
import "react-table/react-table.css";

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}

Modal.setAppElement('#root');

export class RouteSearch extends Component {
    displayName = "Reittihaku"

    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            firstSelectedStation: "",
            secondSelectedStation: "",
            date: new Date(),
            isButtonDisabled: false,
            buttonText: "Hae",
            contents: "",
            modalOpen: false,
            modalData: null
        };

        this.switchStations = this.switchStations.bind(this);
        this.setDate = this.setDate.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        fetch('api/Station/GetStations')
            .then(response => response.json())
            .then(data => {
                this.setState({ stations: data, firstSelectedStation: data[0].stationShortCode, secondSelectedStation: data[0].stationShortCode });
            });

    }

    openModal() {
        this.setState({ modalOpen: true });
    }

    closeModal() {
        this.setState({ modalOpen: false });
    }

    /*
     * Switches the station selections around
     */
    switchStations() {
        let f = this.state.firstSelectedStation;
        let s = this.state.secondSelectedStation;
        this.setState({ firstSelectedStation: s, secondSelectedStation: f });
    }

    setDate(date) {
        this.setState({ date: date });
    }

    /*
     * Calls the api to get train data by station codes and date
     */
    trainDataFetch() {
        let contents = <h3>Ladataan...</h3>;

        let stations = this.state.firstSelectedStation;
        stations = stations + "/" + this.state.secondSelectedStation;
        let date = this.state.date.getFullYear();
        let month = this.state.date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        let day = this.state.date.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        date = date + "-" + month;
        date = date + "-" + day;
        this.setState({
            isButtonDisabled: true,
            buttonText: "Ladataan",
            contents: contents
        });
        // Button disabled for a few seconds to prevent repeated calls to VR api
        setTimeout(() => this.setState({ isButtonDisabled: false, buttonText: "Hae" }), 5500);

        fetch('api/Train/GetRouteData?parameters=' + stations + "_" + date)
            .then(response => response.json())
            .then(data => {
                this.setState({ contents: this.renderTrainTable(data) });
            });
    }

    firstStationChange(e) {
        this.setState({ firstSelectedStation: e.target.value });
    }

    secondStationChange(e) {
        this.setState({ secondSelectedStation: e.target.value });
    }

    /*
     * Renders the table of fetched train data
     */
    renderTrainTable(trains) {
        if (trains.length < 1) {
            return (
                <div>
                    <h3>Ei junia reitillä valittuna päivänä.</h3>
                </div>
            );
        }

        return (
            <div>
                <ReactTable
                    data={trains}
                    columns={[
                        {
                            Header: "Junan numero",
                            accessor: "trainNumber"
                        },
                        {
                            Header: "Junan tyyppi",
                            accessor: "trainType"
                        },
                        {
                            Header: "Junan kategoria",
                            accessor: "trainCategory"
                        },
                        {
                            Header: "Lähtöasema",
                            accessor: "startStation"
                        },
                        {
                            Header: "Pääteasema",
                            accessor: "endStation"
                        },
                        {
                            Header: "Matkan kulku",
                            id: "timetableRows",
                            accessor: "timetableRows",
                            Cell: ({ row }) => (
                                <button className="roundedButton" onClick={e => this.onClickRow(row.timetableRows)}>
                                    Aikataulu
                            </button>
                            )
                        }
                    ]}
                    showPagination={false}
                    defaultPageSize={20}
                    minRows={1}
                    className="-striped -highlight" />
            </div>
        );
    }

    /*
     * Sets the clicked row's data as the data to show on the modal, and opens the modal panel
     */
    onClickRow(row) {
        this.setState({ modalData: row });
        this.openModal();
    }

    /*
     * Renders the initial layout, including the modal panel which is not shown unless opened.
     */
    render() {
        let contents = this.state.contents;
        let firstStation = this.state.firstSelectedStation;
        let secondStation = this.state.secondSelectedStation;
        
        return (
            <div id='content'>
                <div className="upperDiv">
                    <div className="headerDiv">
                        <h1>Reittihaku</h1>
                        <p>Hakee tiedot asemien välillä kulkevista junista annettuna päivänä.</p>
                    </div>
                    <div className='controlsDiv'>
                        <div className='dateDiv'>
                            <DatePicker
                                    locale="fi-FI"
                                    onChange={this.setDate}
                                    value={this.state.date}
                                />
                        </div>
                        <br></br>
                        <div className="stationsChoiceDiv">
                            <div className="stationsFirstColumn">
                                <div className="firstHeader">
                                    Lähtöasema:
                                </div>
                                <div className="firstStationDiv">
                                    <select name='first-stations-list' value={firstStation} onChange={this.firstStationChange.bind(this)} >
                                        {this.state.stations.map(station =>
                                            <option key={station.stationShortCode} value={station.stationShortCode}>{station.stationName}</option>
                                        )};
                                    </select>
                                </div>
                            </div>
                            <div className="buttonColumn">
                                <div className="fillerHeader"></div>
                                <div className="switchButtonDiv">
                                    <button className="roundedSwitchButton" onClick={this.switchStations}>&lt; &gt;</button>
                                </div>
                            </div>
                            <div className="stationsSecondColumn">
                                <div className="secondHeader">
                                    Pääteasema:
                                </div>
                                <div className="secondStationDiv">
                                    <select name='second-stations-list' value={secondStation} onChange={this.secondStationChange.bind(this)} >
                                        {this.state.stations.map(station =>
                                            <option key={station.stationShortCode} value={station.stationShortCode}>{station.stationName}</option>
                                        )};
                                    </select>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <button className="roundedButton" onClick={this.trainDataFetch.bind(this)} disabled={this.state.isButtonDisabled}>{this.state.buttonText}</button>
 
                    </div>
                </div>
                <br></br>
                {contents}
                <br></br>
                <div className="modalDiv">
                    <Modal isOpen={this.state.modalOpen}
                        onRequestClose={this.closeModal}
                        shouldCloseOnOverlayClick={true}
                        style={modalStyles}>
                        <div>
                            <button className="roundedButton" onClick={this.closeModal}>Sulje</button>
                            <br></br>
                            <ReactTable
                                data={this.state.modalData}
                                columns={[
                                    {
                                        Header: "Asema",
                                        accessor: "stationName"
                                    },
                                    {
                                        Header: "Saapumisaika",
                                        accessor: "scheduledArrivalTime"
                                    },
                                    {
                                        Header: "Lähtöaika",
                                        accessor: "scheduledDepartureTime"
                                    },
                                    {
                                        Header: "Rata",
                                        accessor: "commercialTrack"
                                    }
                                ]}
                                showPagination={false}
                                pageSizeOptions={[4, 8, 12, 16, 20]}
                                defaultPageSize={20}
                                sortable={false}
                                minRows={1}
                                className="scheduleTable -striped -highlight" />
                        </div>
                    </Modal >
                </div>
            </div>
        );
    }
}
