using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AspNetDemo.Models
{
    /// <summary>
    /// Parsed version of train timetable data
    /// </summary>
    public class Timetable
    {
        /// <summary>
        /// Is the stop cancelled
        /// </summary>
        public bool Cancelled { get; set; }
        /// <summary>
        /// Planned track number
        /// </summary>
        public string CommercialTrack { get; set; }
        /// <summary>
        /// Scheduled arrival time
        /// </summary>
        public string ScheduledArrivalTime { get; set; }
        /// <summary>
        /// Scheduled departure time
        /// </summary>
        public string ScheduledDepartureTime { get; set; }
        /// <summary>
        /// Station short code
        /// </summary>
        public string StationShortCode { get; set; }
        /// <summary>
        /// Station name
        /// </summary>
        public string StationName { get; set; }
        /// <summary>
        /// Is train ready checked
        /// </summary>
        public TrainReady TrainReady { get; set; }
    }
}
