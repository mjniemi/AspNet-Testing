using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AspNetDemo.Models
{
    public class GeoJSON
    {

        public string Type { get; set; }
        
        public double[] Coordinates { get; set; }
    }
}
