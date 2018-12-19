﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AspNetDemo.Controllers
{
    [Route("api/[controller]")]
    public class TrainController : Controller
    {
        /*
         * GET action which handles api call and sending back the data to the front-end
         */
        // GET: /<controller>/
        [HttpGet("[action]")]
        public List<Train> GetTrainData(string station)
        {

            string apiUrl = "https://rata.digitraffic.fi/api/v1/live-trains/station/"
                + station + "?arriving_trains=0&arrived_trains=0&departed_trains=0&departing_trains=3&include_nonstopping=false";

            string data = GetTrains(apiUrl);

            List<TrainData> TypedData = JsonConvert.DeserializeObject<List<TrainData>>(data);

            List<Train> parsedData = ParseTrainData(TypedData);

            return parsedData;

        }

        [HttpGet("[action]")]
        public List<Train> GetRouteData(string parameters)
        {
            string[] paramArray = parameters.Split("_");
            string stations = paramArray[0];
            string date = paramArray[1];

            string apiUrl = "https://rata.digitraffic.fi/api/v1/live-trains/station/" +stations
                             + "?departure_date=" + date;
            string data = GetTrains(apiUrl);

            if (!data.Contains("errorMessage"))
            {
                List<TrainData> TypedData = JsonConvert.DeserializeObject<List<TrainData>>(data);
                List<Train> parsedData = ParseTrainData(TypedData);
                return parsedData;
            }
            else
            {
                List<Train> parsedData = new List<Train>();
                return parsedData;
            }

        }

        [HttpGet("[action]")]
        public Dates GetDates()
        {
            Dates d = new Dates();

            List<Year> years = CreateYearsList();
            List<Month> months = CreateMonthsList();
            d.months = months;
            d.years = years;

            return d;
        }

        public List<Month> CreateMonthsList()
        {
            List<Month> months = new List<Month>();
            DateTime n = DateTime.Now;
            List<string> names = new List<string>
            {
                "Tammikuu",
                "Helmikuu",
                "Maaliskuu",
                "Huhtikuu",
                "Toukokuu",
                "Kesäkuu",
                "Heinäkuu",
                "Elokuu",
                "Syyskuu",
                "Lokakuu",
                "Marraskuu",
                "Joulukuu"
            };
            
            int feb = 28;
            if (DateTime.IsLeapYear(n.Year))
            {
                feb = 29;
            }
            for (int i = 0; i < names.Count; i++)
            {
                Month m = new Month();
                if (i == 1)
                {
                    m.DaysIn = feb;
                } else if (i == 3 || i == 5 || i == 8 || i == 10 )
                {
                    m.DaysIn = 30;
                }
                else
                {
                    m.DaysIn = 31;
                }
                m.Name = names[i];
                m.Numeric = i+1;
                months.Add(m);
            }

            return months;
        }

        public List<Year> CreateYearsList()
        {
            DateTime n = DateTime.Now;
            int currentYear = n.Year;
            List<Year> years = new List<Year>();
            Year currentY = new Year
            {
                Numeric = currentYear
            };
            Year nextY = new Year
            {
                Numeric = currentYear + 1
            };
            years.Add(currentY);
            years.Add(nextY);
            return years;
        }

        /*
         * Parses the list of train Data into a format used on the front-end
         */
        private List<Train> ParseTrainData(List<TrainData> trains)
        {
            List<Train> parsedData = new List<Train>();
            Models.AspNetDemoDBContext con = new Models.AspNetDemoDBContext();

            foreach (TrainData train in trains)
            {
                Train newTrain = new Train
                {
                    TrainNumber = train.trainNumber,
                    TrainType = train.trainType,
                    TrainCategory = train.trainCategory,
                    Cancelled = train.cancelled,
                };

                TrainTravelData[] NewTable = train.timetableRows;
                List<Timetable> NewTableList = new List<Timetable>();
                int index = 0;
                foreach (TrainTravelData item in NewTable)
                {

                    foreach (Timetable table in NewTableList)
                    {
                        if (table.StationShortCode == item.stationShortCode)
                        {
                            DateTime time = DateTime.Parse(item.scheduledTime);
                            string hour = "";
                            string min = "";
                            string sec = "";
                            if (time.Hour < 10)
                            {
                                hour = "0" + time.Hour;
                            }
                            else
                            {
                                hour = time.Hour.ToString();
                            }
                            if (time.Minute < 10)
                            {
                                min = "0" + time.Minute;
                            }
                            else
                            {
                                min = time.Minute.ToString();
                            }
                            if (time.Second < 10)
                            {
                                sec = "0" + time.Second;
                            }
                            else
                            {
                                sec = time.Second.ToString();
                            }
                            table.ScheduledDepartureTime = hour + ":" + min + ":" + sec;
                        }
                    }
                    if (index == 0)
                    {
                        Timetable table = new Timetable()
                        {
                            Cancelled = item.cancelled,
                            CommercialTrack = item.commercialTrack,
                            StationShortCode = item.stationShortCode,
                            Type = item.type,
                            TrainReady = item.trainReady
                        };

                        DateTime time = DateTime.Parse(item.scheduledTime);
                        string hour = "";
                        string min = "";
                        string sec = "";
                        if (time.Hour < 10)
                        {
                            hour = "0" + time.Hour;
                        }
                        else
                        {
                            hour = time.Hour.ToString();
                        }
                        if (time.Minute < 10)
                        {
                            min = "0" + time.Minute;
                        }
                        else
                        {
                            min = time.Minute.ToString();
                        }
                        if (time.Second < 10)
                        {
                            sec = "0" + time.Second;
                        }
                        else
                        {
                            sec = time.Second.ToString();
                        }
                        table.ScheduledDepartureTime = hour + ":" + min + ":" + sec;

                        List<string> stationName = (from t in con.Trainstation
                                                    where t.StationShortCode == item.stationShortCode
                                                    select t.StationName).ToList();
                        table.StationName = stationName[0];
                        if (table.StationName.Contains(" asema"))
                        {
                            table.StationName = table.StationName.Replace(" asema", "");
                        }

                        NewTableList.Add(table);
                    }

                    if (!item.cancelled && item.type == "ARRIVAL" && item.trainStopping)
                    {
                        Timetable table = new Timetable()
                        {
                            Cancelled = item.cancelled,
                            CommercialTrack = item.commercialTrack,
                            StationShortCode = item.stationShortCode,
                            Type = item.type,
                            TrainReady = item.trainReady
                        };

                        DateTime time = DateTime.Parse(item.scheduledTime);
                        string hour = "";
                        string min = "";
                        string sec = "";
                        if (time.Hour < 10)
                        {
                            hour = "0" + time.Hour;
                        }
                        else
                        {
                            hour = time.Hour.ToString();
                        }
                        if (time.Minute < 10)
                        {
                            min = "0" + time.Minute;
                        }
                        else
                        {
                            min = time.Minute.ToString();
                        }
                        if (time.Second < 10)
                        {
                            sec = "0" + time.Second;
                        }
                        else
                        {
                            sec = time.Second.ToString();
                        }
                        table.ScheduledArrivalTime = hour + ":" + min + ":" + sec;
                        List<string> stationName = (from t in con.Trainstation
                                                    where t.StationShortCode == item.stationShortCode
                                                    select t.StationName).ToList();
                        table.StationName = stationName[0];
                        if (table.StationName.Contains(" asema"))
                        {
                            table.StationName = table.StationName.Replace(" asema", "");
                        }

                        NewTableList.Add(table);
                    }
                    index++;
                }
                newTrain.TimetableRows = NewTableList.ToArray();
                if (newTrain.TimetableRows.Length > 0)
                {
                    newTrain.StartStation = newTrain.TimetableRows.First().StationName;
                    newTrain.EndStation = newTrain.TimetableRows.Last().StationName;
                }
                parsedData.Add(newTrain);

            }

            return parsedData;
        }

        public class TrainReady
        {
            public bool accepted { get; set; }
            public string source { get; set; }
            public string timestamp { get; set; }
        }

        public class TrainTravelData
        {
            public string actualTime { get; set; }
            public bool cancelled { get; set; }
            public bool commercialStop { get; set; }
            public string commercialTrack { get; set; }
            public string countryCode { get; set; }
            public int differenceInMinutes { get; set; }
            public string scheduledTime { get; set; }
            public string stationShortCode { get; set; }
            public int stationUICCode { get; set; }
            public TrainReady trainReady { get; set; }
            public bool trainStopping { get; set; }
            public string type { get; set; }

        }

        public class TrainData
        {
            public int trainNumber { get; set; }
            public string trainType { get; set; }
            public string trainCategory { get; set; }
            public string timetableType { get; set; }
            public DateTime timetableAcceptanceDate { get; set; }
            public bool runningCurrently { get; set; }
            public bool cancelled { get; set; }
            public TrainTravelData[] timetableRows { get; set; }
            public string commuterLineID { get; set; }
            public long version { get; set; }
        }

        public class Timetable
        {
            public bool Cancelled { get; set; }
            public string CommercialTrack { get; set; }
            public string ScheduledArrivalTime { get; set; }
            public string ScheduledDepartureTime { get; set; }
            public string StationShortCode { get; set; }
            public string StationName { get; set; }
            public TrainReady TrainReady { get; set; }
            public string Type { get; set; }
        }

        public class Train
        {
            public int TrainNumber { get; set; }
            public string TrainType { get; set; }
            public string TrainCategory { get; set; }
            public bool Cancelled { get; set; }
            public Timetable[] TimetableRows { get; set; }
            public string StartStation { get; set; }
            public string EndStation { get; set; }
        }

        public class Month
        {
            public int Numeric { get; set; }
            public string Name { get; set; }
            public int DaysIn { get; set; }
        }

        public class Year
        {
            public int Numeric { get; set; }
        }

        public class Dates
        {
            public List<Month> months { get; set; }
            public List<Year> years { get; set; }
        }

        /*
         * Handles the API fetch call to VR API 
         */
        string GetTrains(string url)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            try
            {
                WebResponse response = request.GetResponse();
                using (Stream responseStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, System.Text.Encoding.UTF8);
                    return reader.ReadToEnd();
                }
            }
            catch (WebException ex)
            {
                WebResponse errorResponse = ex.Response;
                using (Stream responseStream = errorResponse.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, System.Text.Encoding.GetEncoding("utf-8"));
                    String errorText = reader.ReadToEnd();
                    // log errorText
                }
                throw;
            }
        }
    }
}
