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
        public string GetTrainData(string stationCode)
        {

            stationCode = "HKI";
            string fixedUrl = "https://rata.digitraffic.fi/api/v1/live-trains/station/"
                + stationCode + "?arriving_trains=1&departing_trains=1&include_nonstopping=false";
            // Returns JSON string

            //string data = GetTrains(fixedUrl);
            string data = "";
            StringBuilder sb = new StringBuilder();
            try
            {
                //FileStream fs = new FileStream(@"E:\bootcamp\AspNetDemo\t.txt", FileMode.Open);

                //long len = fs.Length;
                //byte[] buffer = new byte[len];

                //int count;                            // actual number of bytes read
                //int sum = 0;                          // total number of bytes read

                //// read until Read method returns 0 (end of the stream has been reached)
                //while ((count = fs.Read(buffer, sum, (int)len - sum)) > 0)
                //    sum += count;  // sum is a buffer offset for next reading
                //StringBuilder sb = new StringBuilder();

                //for (int i = 0; i < buffer.Length; i++)
                //{
                //    sb.Append(buffer[i].ToString());
                //}
                //data = sb.ToString();

                //fs.Dispose();

                using (StreamReader sr = new StreamReader(@"t.txt"))
                {
                    // Read the stream to a string, and write the string to the console.
                    //String line = sr.ReadToEnd();
                    //Console.WriteLine(line);
                    sb.Append(sr.ReadToEnd());
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            data = sb.ToString();
            //TrainData[] parsedData = JsonConvert.DeserializeObject<TrainData[]>(data);

            return data;
            //yield return parsedData;


            
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
            public bool runningCurrently { get; set; }
            public bool cancelled { get; set; }
            public TrainTravelData[] timetableRows { get; set; }
            public string commuterLineID { get; set; }
            public int version { get; set; }
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
