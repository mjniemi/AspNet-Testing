using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AspNetDemo.Models
{
    /// <summary>
    /// Contains train location information
    /// </summary>
    public class TrainLocation
    {
        /// <summary>
        /// Train number
        /// </summary>
        public string TrainNumber { get; set; }

        /// <summary>
        /// Train's first departure date since search
        /// </summary>
        public DateTime DepartureDate { get; set; }

        /// <summary>
        /// Timestamp of the search
        /// </summary>
        public string Timestamp { get; set; }
        
        /// <summary>
        /// GeoJSON object of the train coordinates
        /// </summary>
        public GeoJSON Location { get; set; }

        /// <summary>
        /// Train speed
        /// </summary>
        public double Speed { get; set; }
    }
}
