using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AspNetDemo.Models
{
    public class TrainLocation
    {

        public string TrainNumber { get; set; }

        public DateTime DepartureDate { get; set; }

        public string Timestamp { get; set; }
        
        public GeoJSON Location { get; set; }

        public double Speed { get; set; }
    }
}
