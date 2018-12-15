using System;
using System.Collections.Generic;
using System.Linq;

namespace AspNetDemo.Models
{
    public partial class Trainstation
    {
        public int Id { get; set; }
        public bool PassengerTraffic { get; set; }
        public string Type { get; set; }
        public string StationName { get; set; }
        public string StationShortCode { get; set; }
        public int StationUiccode { get; set; }
        public string CountryCode { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
    }
}
