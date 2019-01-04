using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AspNetDemo.Models
{
    /// <summary>
    /// Train data from VR API
    /// </summary>
    public class TrainData
    {
        /// <summary>
        /// Train number
        /// </summary>
        public int TrainNumber { get; set; }
        /// <summary>
        /// Train type
        /// </summary>
        public string TrainType { get; set; }
        /// <summary>
        /// Train category
        /// </summary>
        public string TrainCategory { get; set; }
        /// <summary>
        /// Whether timetable is fetched as regular or ADHOC
        /// </summary>
        public string TimetableType { get; set; }
        /// <summary>
        /// Date of acceptance for the train timetable
        /// </summary>
        public DateTime TimetableAcceptanceDate { get; set; }
        /// <summary>
        /// Is train running currently
        /// </summary>
        public bool RunningCurrently { get; set; }
        /// <summary>
        /// Is train cancelled
        /// </summary>
        public bool Cancelled { get; set; }
        /// <summary>
        /// Contains data on the train stops
        /// </summary>
        public TrainTravelData[] TimetableRows { get; set; }
        /// <summary>
        /// Commuter Line ID
        /// </summary>
        public string CommuterLineID { get; set; }
        /// <summary>
        /// API version of train data
        /// </summary>
        public long Version { get; set; }
    }
}
