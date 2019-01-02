using System;
using System.Collections.Generic;
using System.Linq;

namespace AspNetDemo.Models
{
    /// <summary>
    /// Trainstation model for database table
    /// </summary>
    public partial class Trainstation
    {
        /// <summary>
        /// Database id
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Whether the point has passenger traffic
        /// </summary>
        public bool PassengerTraffic { get; set; }
        /// <summary>
        /// Type of traffic point: station, stopping point or a turnout
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// Station name
        /// </summary>
        public string StationName { get; set; }
        /// <summary>
        /// Station short code
        /// </summary>
        public string StationShortCode { get; set; }
        /// <summary>
        /// Station UIC code
        /// </summary>
        public int StationUiccode { get; set; }
        /// <summary>
        /// Country code
        /// </summary>
        public string CountryCode { get; set; }
        /// <summary>
        /// Longitude coordinate
        /// </summary>
        public double Longitude { get; set; }
        /// <summary>
        /// Latitude coordinate
        /// </summary>
        public double Latitude { get; set; }
    }
}
