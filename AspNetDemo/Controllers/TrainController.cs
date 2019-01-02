using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using AspNetDemo.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AspNetDemo.Controllers
{
    /// <summary>
    /// Train Controller
    /// </summary>
    [Route("api/[controller]")]
    public class TrainController : Controller
    {
        
        /// <summary>
        /// Get Train Data
        /// </summary>
        /// <remarks>
        /// Gets a list of departing trains from a given station
        /// </remarks>
        /// <param name="station">Station short code</param>
        /// <returns>List of trains</returns>
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

        /// <summary>
        /// Get Route Data
        /// </summary>
        /// <remarks>
        /// Gets a list of trains between given stations on a given day
        /// </remarks>
        /// <param name="parameters">String including station short codes and date</param>
        /// <returns>List of trains</returns>
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
                    TrainNumber = train.TrainNumber,
                    TrainType = train.TrainType,
                    TrainCategory = train.TrainCategory,
                    Cancelled = train.Cancelled,
                };

                TrainTravelData[] NewTable = train.TimetableRows;
                List<Timetable> NewTableList = new List<Timetable>();
                int index = 0;
                foreach (TrainTravelData item in NewTable)
                {

                    foreach (Timetable table in NewTableList)
                    {
                        if (table.StationShortCode == item.StationShortCode)
                        {
                            DateTime time = DateTime.Parse(item.ScheduledTime);
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
                            Cancelled = item.Cancelled,
                            CommercialTrack = item.CommercialTrack,
                            StationShortCode = item.StationShortCode,
                            TrainReady = item.TrainReady
                        };

                        DateTime time = DateTime.Parse(item.ScheduledTime);
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
                                                    where t.StationShortCode == item.StationShortCode
                                                    select t.StationName).ToList();
                        table.StationName = stationName[0];
                        if (table.StationName.Contains(" asema"))
                        {
                            table.StationName = table.StationName.Replace(" asema", "");
                        }

                        NewTableList.Add(table);
                    }

                    if (!item.Cancelled && item.Type == "ARRIVAL" && item.TrainStopping)
                    {
                        Timetable table = new Timetable()
                        {
                            Cancelled = item.Cancelled,
                            CommercialTrack = item.CommercialTrack,
                            StationShortCode = item.StationShortCode,
                            TrainReady = item.TrainReady
                        };

                        DateTime time = DateTime.Parse(item.ScheduledTime);
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
                                                    where t.StationShortCode == item.StationShortCode
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

        /*
         * Handles the API fetch call to VR API 
         */
        private string GetTrains(string url)
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
                try
                {
                    using (Stream responseStream = errorResponse.GetResponseStream())
                    {
                        StreamReader reader = new StreamReader(responseStream, System.Text.Encoding.GetEncoding("utf-8"));
                        String errorText = reader.ReadToEnd();
                        string err = "errorMessage:" + errorText;
                        return err;
                    }
                }
                catch
                {
                    return ex.Response.ToString();
                }
            }
        }
    }
}
