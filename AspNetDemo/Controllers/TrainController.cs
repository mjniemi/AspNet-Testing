using System;
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
        // GET: /<controller>/
        [HttpGet("[action]")]
        public List<Train> GetTrainData(string station)
        {
            if (station == null || station == "")
            {
                station = "AIN";
            }
            string apiUrl = "https://rata.digitraffic.fi/api/v1/live-trains/station/"
                + station + "?arriving_trains=0&arrived_trains=0&departed_trains=0&departing_trains=3&include_nonstopping=false";
            // Returns JSON string

            string data = GetTrains(apiUrl);

            List<TrainData> TypedData = JsonConvert.DeserializeObject<List<TrainData>>(data);

            List<Train> parsedData = ParseTrainData(TypedData);

            return parsedData;

        }

        private List<Train> ParseTrainData (List<TrainData> trains)
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
                foreach (TrainTravelData item in NewTable)
                {
                    foreach (Timetable table in NewTableList)
                    {
                        if (table.StationShortCode == item.stationShortCode)
                        {
                            table.ScheduledDepartureTime = item.scheduledTime;
                        }
                    }

                    if (!item.cancelled && item.type == "ARRIVAL" && item.trainStopping)
                    {
                        Timetable table = new Timetable()
                        {
                            Cancelled = item.cancelled,
                            CommercialTrack = item.commercialTrack,
                            ScheduledArrivalTime = item.scheduledTime,
                            StationShortCode = item.stationShortCode,
                            Type = item.type,
                            TrainReady = item.trainReady
                        };

                        List<string> stationName = (from t in con.Trainstation
                                             where t.StationShortCode == item.stationShortCode
                                             select t.StationName).ToList();
                        table.StationName = stationName[0];

                        NewTableList.Add(table);
                    }
                }
                newTrain.TimetableRows = NewTableList.ToArray();
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
        }

        
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
