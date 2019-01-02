using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AspNetDemo.Models
{
    /// <summary>
    /// Train arrival and departure stops from API
    /// </summary>
    public class TrainTravelData
    {
        /// <summary>
        /// Actual time of the arrival or departure
        /// </summary>
        public string ActualTime { get; set; }
        /// <summary>
        /// Tells whether the arrival or departure has been cancelled
        /// </summary>
        public bool Cancelled { get; set; }
        /// <summary>
        /// Tells whether the stop is commercial
        /// </summary>
        public bool CommercialStop { get; set; }
        /// <summary>
        /// Planned track number
        /// </summary>
        public string CommercialTrack { get; set; }
        /// <summary>
        /// Country code of the stop
        /// </summary>
        public string CountryCode { get; set; }
        /// <summary>
        /// Difference between scheduled and actual time
        /// </summary>
        public int DifferenceInMinutes { get; set; }
        /// <summary>
        /// Scheduled time for the arrival or departure
        /// </summary>
        public string ScheduledTime { get; set; }
        /// <summary>
        /// Short code of the station
        /// </summary>
        public string StationShortCode { get; set; }
        /// <summary>
        /// Station UIC code
        /// </summary>
        public int StationUICCode { get; set; }
        /// <summary>
        /// Tells whether the train is ready checked
        /// </summary>
        public TrainReady TrainReady { get; set; }
        /// <summary>
        /// Is the train stopping on this station
        /// </summary>
        public bool TrainStopping { get; set; }
        /// <summary>
        /// Type of event: Arrival or departure
        /// </summary>
        public string Type { get; set; }
    }
}
