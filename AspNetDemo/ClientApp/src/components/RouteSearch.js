import './TrainPages.css';
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

export class RouteSearch extends Component {
    displayName = "Reittihaku"

    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            firstSelectedStation: "",
            secondSelectedStation: "",
            days: [],
            months: [],
            years: [],
            selectedDay: null,
            selectedMonth: null,
            selectedYear: null,
            isButtonDisabled: false,
            contents: "",
            modalOpen: false,
            modalData: null
        };


        this.setDays = this.setDays.bind(this);
        this.setSelectedDay = this.setSelectedDay.bind(this);
        this.setSelectedMonth = this.setSelectedMonth.bind(this);
        this.setSelectedYear = this.setSelectedYear.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);


        fetch('api/Train/GetDates')
            .then(response => response.json())
            .then(data => {
                this.setState({ months: data.months, years: data.years, selectedMonth: (new Date().getMonth() + 1), selectedYear: new Date().getFullYear() });
                this.setDays();
            });

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

    setSelectedDay(e) {
        this.setState({ selectedDay: e.target.value });
    }

    setSelectedMonth(e) {
        this.setState({ selectedMonth: e.target.value });
        this.setDays();
    }

    setSelectedYear(e) {
        this.setState({ selectedYear: e.target.value });
    }

   

    setDays() {
        let m = this.state.selectedMonth;
        let days = this.state.months[(m-1)];
        let daysArray = [];
        for (let i = 0; i < days.daysIn; i++) {
            daysArray.push(i + 1);
        }
        this.setState({ days: daysArray, selectedDay: new Date().getDate() });
    }

    trainDataFetch() {
        let contents = <p>Ladataan...</p>;

        let stations = this.state.firstSelectedStation;
        stations = stations + "/" + this.state.secondSelectedStation;
        let date = this.state.selectedYear;
        date = date + "-" + this.state.selectedMonth;
        date = date + "-" + this.state.selectedDay;
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
        this.setState({ modalData: row });
        this.openModal();
    }

    render() {
        let contents = this.state.contents;
        let day = (this.state.selectedDay) ? this.state.selectedDay : new Date().getDate();
        let month = (this.state.selectedMonth) ? this.state.selectedMonth : new Date().getMonth();
        
        return (
            <div id='content'>
                <h1>Reittihaku</h1>
                <p>Hakee tiedot asemien välillä kulkevista junista annettuna päivänä.</p>
                <div className='controlsDiv'>
                    <div className='dateDiv'>

                            <select name='day-list' className="daySelect" value={day} onChange={this.setSelectedDay}>
                                {this.state.days.map((day) =>
                                    <option key={day} value={day}>{day}</option>
                                )};
                            </select>

                            <select name='month-list' className="monthSelect" value={month} onChange={this.setSelectedMonth}>
                                {this.state.months.map(month =>
                                    <option key={month.numeric} value={month.numeric}>{month.name}</option>
                                )};
                            </select>

                            <select name='year-list' className="yearSelect" onChange={this.setSelectedYear}>
                                {this.state.years.map(year =>
                                    <option key={year.numeric} value={year.numeric}>{year.numeric}</option>
                                )};
                            </select>

                    </div>
                    <br></br>
                    <p>Lähtöasema:&nbsp;&nbsp;
                    <select name='first-stations-list' onChange={this.firstStationChange.bind(this)} >
                        {this.state.stations.map(station =>

                            <option key={station.stationShortCode} value={station.stationShortCode}>{station.stationName}</option>

                        )};
                    </select>
                    </p>
                    <br></br>
                    <p>Pääteasema:&nbsp;&nbsp;
                    <select name='second-stations-list' onChange={this.secondStationChange.bind(this)} >
                        {this.state.stations.map(station =>

                            <option key={station.stationShortCode} value={station.stationShortCode}>{station.stationName}</option>

                        )};
                    </select>
                    </p>
                    <button onClick={this.trainDataFetch.bind(this)} disabled={this.state.isButtonDisabled}>Hae</button>
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
                                className="-striped -highlight" />
                        </div>
                    </Modal >
                </div>
            </div>
        );
    }
}
