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

export class Trains extends Component {
    displayName = Trains.name

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
        

        fetch('api/Station/PopulateStations')
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

    stationChange(e) {
        this.setState({ selectedStation: e.target.value });
    }

    renderPageControls() {
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

    renderTrainTable(trains) {
        console.log(trains);
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
                            <button onClick={e => this.onClickRow(row.timetableRows)}>
                                Pysähdykset
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
        console.log(row);
        this.setState({ modalData: row });
        this.openModal();
    }

    render() {
        let contents = this.state.contents;
        let controls = this.renderPageControls();
        
        return (
            <div id='content'>
                <h1>Juna aikatauluja</h1>
                <p>Hakee tietoja asemalta seuraavaksi lähtevistä junista</p>
                <div className='controlsDiv'>
                    {controls}
                    <select name='stations-list' onChange={this.stationChange.bind(this)} >
                        {this.state.stations.map(station =>
                            
                            <option key={station.stationShortCode} value={station.stationShortCode}>{station.stationName}</option>
                            
                        )};
                    </select>

                    <button onClick={this.trainDataFetch.bind(this)} disabled={this.state.isButtonDisabled}>AAAAAAAAAAAAAAAAAA</button>
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
                            <button onClick={this.closeModal}>Sulje</button>
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
                                    }
                                ]}
                                showPagination={false}
                                pageSizeOptions= {[4, 8, 12, 16, 20]}
                                defaultPageSize={20}
                                sortable={false}
                                minRows={1}
                                className="-striped -highlight" />
                        </div>
                    </Modal >
                </div>
            </div>
        );
    }
}
