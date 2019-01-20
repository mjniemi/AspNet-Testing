using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AspNetDemo.Models
{
    /// <summary>
    /// Object containing Geographic data
    /// </summary>
    public class GeoJSON
    {
        /// <summary>
        /// Type of data
        /// </summary>
        public string Type { get; set; }
        
        /// <summary>
        /// Coordinates as latitude and longitude
        /// </summary>
        public double[] Coordinates { get; set; }
    }
}
