using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AspNetDemo.Models
{
    /// <summary>
    /// Parsed version of train data
    /// </summary>
    public class Train
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
        /// Is train cancelled
        /// </summary>
        public bool Cancelled { get; set; }

        /// <summary>
        /// Is train running currently
        /// </summary>
        public bool RunningCurrently { get; set; }
        
        /// <summary>
        /// Contains train stops
        /// </summary>
        public Timetable[] TimetableRows { get; set; }
        
        /// <summary>
        /// Train original departure station
        /// </summary>
        public string StartStation { get; set; }
        
        /// <summary>
        /// Train departure time
        /// </summary>
        public string DepartureTime { get; set; }

        /// <summary>
        /// Train final arrival station
        /// </summary>
        public string EndStation { get; set; }

        /// <summary>
        /// Train arrival time
        /// </summary>
        public string ArrivalTime { get; set; }
    }
}
