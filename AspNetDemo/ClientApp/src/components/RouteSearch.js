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

    switchStations() {
        let f = this.state.firstSelectedStation;
        let s = this.state.secondSelectedStation;
        this.setState({ firstSelectedStation: s, secondSelectedStation: f });
    }

    setDate(date) {
        this.setState({ date: date });
    }

    trainDataFetch() {
        let contents = <p>Ladataan...</p>;

        let stations = this.state.firstSelectedStation;
        stations = stations + "/" + this.state.secondSelectedStation;
        let date = this.state.date.getFullYear();
        date = date + "-" + (this.state.date.getMonth() + 1);
        date = date + "-" + this.state.date.getDate();
        this.setState({
            isButtonDisabled: true,
            contents: contents
        });
        // Button disabled for a few seconds to prevent repeated calls to VR api
        setTimeout(() => this.setState({ isButtonDisabled: false }), 5500);

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

    renderTrainTable(trains) {
        if (trains.length < 1) {
            return (
                <div>
                    <p>Ei junia reitillä valittuna päivänä.</p>
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

    onClickRow(row) {
        this.setState({ modalData: row });
        this.openModal();
    }

    render() {
        let contents = this.state.contents;
        let firstStation = this.state.firstSelectedStation;
        let secondStation = this.state.secondSelectedStation;
        
        return (
            <div id='content'>
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
                    <p>Lähtöasema:&nbsp;&nbsp;
                    <select name='first-stations-list' value={firstStation} onChange={this.firstStationChange.bind(this)} >
                        {this.state.stations.map(station =>

                            <option key={station.stationShortCode} value={station.stationShortCode}>{station.stationName}</option>

                        )};
                    </select>
                    </p>
                    <br></br>
                    <p>Pääteasema:&nbsp;&nbsp;
                    <select name='second-stations-list' value={secondStation} onChange={this.secondStationChange.bind(this)} >
                        {this.state.stations.map(station =>

                            <option key={station.stationShortCode} value={station.stationShortCode}>{station.stationName}</option>

                        )};
                    </select>
                    </p>
                    <button className="roundedButton" onClick={this.trainDataFetch.bind(this)} disabled={this.state.isButtonDisabled}>Hae</button>
                    <button className="roundedButton" onClick={this.switchStations}>Vaihda</button>
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
