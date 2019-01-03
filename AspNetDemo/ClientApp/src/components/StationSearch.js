﻿import './TrainPages.css';
import React, { Component } from 'react';
import ReactTable from "react-table";
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

export class StationSearch extends Component {
    displayName = "Asemahaku"

    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            selectedStation: "",
            isButtonDisabled: false,
            contents: "",
            modalOpen: false,
            modalData: null
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        

        fetch('api/Station/GetStations')
            .then(response => response.json())
            .then(data => {
                
                this.setState({ stations: data, selectedStation: data[0].stationShortCode });
            });

    }

    openModal() {
        this.setState({ modalOpen: true });
    }

    closeModal() {
        this.setState({ modalOpen: false });
    }

    /*
     * Calls the api to get train data by station code
     */
    trainDataFetch() {
        let contents = <p>Ladataan...</p>;

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

    /*
     * Changes the selected station to the react state
     */
    stationChange(e) {
        this.setState({ selectedStation: e.target.value });
    }

    /*
     * Renders the table of fetched train data
     */
    renderTrainTable(trains) {
        if (trains.length < 1) {
            return (
                <div>
                    <p>Ei lähteviä junia.</p>
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
                className="scrollabletable -striped -highlight" />
                
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
        
        return (
            <div id='content'>
                <div className="headerDiv">
                    <h1>Asemahaku</h1>
                    <p>Hakee tietoja asemalta seuraavaksi lähtevistä junista</p>
                </div>
                <div className="controlsDiv">
                    
                    <select name='stations-list' onChange={this.stationChange.bind(this)} >
                        {this.state.stations.map(station =>         
                            <option key={station.stationShortCode} value={station.stationShortCode}>{station.stationName}</option>  
                        )};
                    </select>
                    <br></br>
                    <br></br>
                    <button className="roundedButton" onClick={this.trainDataFetch.bind(this)} disabled={this.state.isButtonDisabled}>Hae</button>
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
                                pageSizeOptions= {[4, 8, 12, 16, 20]}
                                defaultPageSize={50}
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
