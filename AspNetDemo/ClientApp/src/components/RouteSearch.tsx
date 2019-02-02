import "./TrainPages.css";
import * as React from "react";
import ReactTable from "react-table";
import DatePicker from "react-date-picker";
import * as Modal from "react-modal";
import "react-table/react-table.css";

const modalStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

interface ITimetable {
    cancelled: boolean;
    commercialTrack: string;
    scheduledArrivalTime: string;
    scheduledDepartureTime: string;
    stationShortCode: string;
    stationName: string;
    TrainReady: {};
}

interface ITrain {
    trainNumber: number;
    trainType: string;
    trainCategory: string;
    cancelled: boolean;
    runningCurrently: boolean;
    timetableRows: [];
    startStation: string;
    departureTime: string;
    endStation: string;
    arrivalTime: string;
}

interface IStation {
    stationName: string;
    stationShortCode: string;
}

interface ITrainLocation {
    trainNumber: string;
    departureDate: Date;
    timestamp: string;
    speed: number;
    location: {
        type: string;
        coordinates: number[];
    };
}

interface IState {
    stations: IStation[];
    secondSelectedStation: string;
    date: Date;
    isButtonDisabled: boolean;
    buttonText: string;
    contents: JSX.Element;
    scheduleModalOpen: boolean;
    scheduleModalData: [];
    mapModalOpen: boolean;
}

interface IProps {
    selectedStation: string;
    setSelected: Function;
}

Modal.setAppElement("#root");

export class RouteSearch extends React.Component<IProps, IState> {
    public displayName = "Reittihaku";

    constructor(props) {
        super(props);

        this.state = {
            stations: [],
            secondSelectedStation: "",
            date: new Date(),
            isButtonDisabled: false,
            buttonText: "Hae",
            contents: <div></div>,
            scheduleModalOpen: false,
            scheduleModalData: [],
            mapModalOpen: false,
        };

        this.switchStations = this.switchStations.bind(this);
        this.setDate = this.setDate.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        
        fetch("api/Station/GetStations")
            .then((response) => response.json())
            .then((data) => {
                if (this.props.selectedStation == "") {
                    this.props.setSelected(data[0].stationShortCode);
                }
                this.setState(
                    {
                        stations: data,
                        secondSelectedStation: data[0].stationShortCode,
                    });
            });
    }

    // Renders the initial layout, including the modal panel which is not shown unless opened.
    public render() {
        const contents = this.state.contents;
        const firstStation = this.props.selectedStation;
        const secondStation = this.state.secondSelectedStation;

        return (
            <div id="content">
                <div className="upperDiv">
                    <div className="headerDiv">
                        <h1>Reittihaku</h1>
                        <p>Hakee tiedot asemien välillä kulkevista junista annettuna päivänä.</p>
                    </div>
                    <div className="controlsDiv">
                        <div className="dateDiv">
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
                                    <select name="first-stations-list"
                                        value={firstStation}
                                        onChange={this.firstStationChange.bind(this)} >
                                        {this.state.stations.map((station) =>
                                            <option key={station.stationShortCode}
                                                value={station.stationShortCode}>
                                                {station.stationName}
                                            </option>,
                                        )};
                                    </select>
                                </div>
                            </div>
                            <div className="buttonColumn">
                                <div className="fillerHeader"></div>
                                <div className="switchButtonDiv">
                                    <button className="roundedSwitchButton"
                                        onClick={this.switchStations}>&lt; &gt;</button>
                                </div>
                            </div>
                            <div className="stationsSecondColumn">
                                <div className="secondHeader">
                                    Pääteasema:
                                </div>
                                <div className="secondStationDiv">
                                    <select name="second-stations-list"
                                        value={secondStation}
                                        onChange={this.secondStationChange.bind(this)}>
                                        {this.state.stations.map((station) =>
                                            <option key={station.stationShortCode}
                                                value={station.stationShortCode}>
                                                {station.stationName}
                                            </option>,
                                        )};
                                    </select>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <button className="roundedButton"
                            onClick={this.trainDataFetch.bind(this)}
                            disabled={this.state.isButtonDisabled}>
                            {this.state.buttonText}
                        </button>
                    </div>
                </div>
                <br></br>
                <div className="contentDiv">
                    {contents}
                </div>
                <br></br>
                <div className="modalDiv">
                    <Modal isOpen={this.state.scheduleModalOpen}
                        onRequestClose={this.closeModal}
                        shouldCloseOnOverlayClick={true}
                        style={modalStyles}>
                        <div>
                            <button className="roundedButton" onClick={this.closeModal}>Sulje</button>
                            <br></br>
                            <ReactTable
                                data={this.state.scheduleModalData}
                                columns={[
                                    {
                                        Header: "Asema",
                                        accessor: "stationName",
                                    },
                                    {
                                        Header: "Saapumisaika",
                                        accessor: "scheduledArrivalTime",
                                    },
                                    {
                                        Header: "Lähtöaika",
                                        accessor: "scheduledDepartureTime",
                                    },
                                    {
                                        Header: "Rata",
                                        accessor: "commercialTrack",
                                    },
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

    // Opens Modal panel by setting it's state boolean.
    private openModal() {
        this.setState({ scheduleModalOpen: true });
    }

    // Closes Modal panel by setting it's state boolean.
    private closeModal() {
        this.setState({ scheduleModalOpen: false });
    }

    // Switches the station selections around.
    private switchStations() {
        const f = this.props.selectedStation;
        const s = this.state.secondSelectedStation;
        this.props.setSelected(s);
        this.setState({ secondSelectedStation: f });
    }

    // sets the state Date upon date selection from the date picker.
    private setDate(d) {
        this.setState({ date: d });
    }

    // Calls the api to get train data by station codes and date
    private trainDataFetch() {
        const content = <h3>Ladataan...</h3>;
        let stations = this.props.selectedStation;
        stations = stations + "/" + this.state.secondSelectedStation;
        let date: string = this.state.date.getFullYear().toString();
        let month: string = "" + this.state.date.getMonth() + 1;
        if (month.length < 2) {
            month = "0" + month;
        }
        let day: string = "" + this.state.date.getDate();
        if (day.length < 2) {
            day = "0" + day;
        }
        date = date + "-" + month;
        date = date + "-" + day;
        this.setState({
            isButtonDisabled: true,
            buttonText: "Ladataan",
            contents: content,
        });
        // Button disabled for a few seconds to prevent repeated calls to VR api
        setTimeout(() => this.setState({ isButtonDisabled: false, buttonText: "Hae" }), 5500);

        fetch("api/Train/GetRouteData?parameters=" + stations + "_" + date)
            .then((response) => response.json())
            .then((data: ITrain[]) => {
                this.setState({ contents: this.renderTrainTable(data) });
            });
    }

    // sets the first station State upon it's selection change.
    private firstStationChange(e) {
        this.props.setSelected(e.target.value);
    }

    // sets the second station State upon it's selection change.
    private secondStationChange(e) {
        this.setState({ secondSelectedStation: e.target.value });
    }

    // Renders the table of fetched train data
    private renderTrainTable(trains: ITrain[]) {
        
        // If array has no data, returns a simple message div.
        if (trains.length < 1) {
            return (
                <div>
                    <h3>Ei junia reitillä valittuna päivänä.</h3>
                </div>
            );
        }
        console.log(trains);
        return (
            <div>
                <ReactTable
                    data={trains}
                    columns={[
                        {
                            Header: "Junan numero",
                            accessor: "trainNumber",
                            
                        },
                        {
                            Header: "Sijainti",
                            accessor: "runningCurrently",
                            Cell: ({ row }) => (
                                <div>
                                    {row.runningCurrently &&
                                        <button className="roundedButton"
                                            onClick={(event) => this.onClickLocation(row.trainNumber)}>
                                            Sijainti
                                        </button>}
                                </div>
                            ),
                        },
                        {
                            Header: "Lähtöasema",
                            accessor: "startStation",
                        },
                        {
                            Header: "Lähtöaika",
                            accessor: "departureTime",
                        },
                        {
                            Header: "Saapumisaika",
                            accessor: "arrivalTime",
                        },
                        {
                            Header: "Pääteasema",
                            accessor: "endStation",
                        },
                        {
                            Header: "Aikataulu",
                            id: "timetableRows",
                            accessor: "timetableRows",
                            Cell: ({ row }) => (
                                <button className="roundedButton"
                                    onClick={(event) => this.onClickRow(row.timetableRows)}>
                                    Aikataulu
                                </button>
                            ),
                        },
                    ]}
                    showPagination={false}
                    defaultPageSize={20}
                    minRows={1}
                    className="-striped -highlight" />
            </div>
        );
    }

    // Sets the clicked row's data as the data to show on the modal, and opens the modal panel
    private onClickRow(row) {
        this.setState({ scheduleModalData: row });
        this.openModal();
    }

    // Calls the api to fetch the train coordinates to show on google maps. Map is shown in a new window.
    private onClickLocation(trainNumber) {
        console.log("num:" + trainNumber);
        fetch("api/Train/GetLocation?parameters=" + trainNumber)
            .then((response) => response.json())
            .then((data: ITrainLocation) => {
                let lng = data.location.coordinates[0];
                let lat = data.location.coordinates[1];
                window.open("https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng);
            });
    }
}