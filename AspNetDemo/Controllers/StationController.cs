using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data.SqlClient;
using AspNetDemo.Models;

namespace AspNetDemo.Controllers
{
    
    /// <summary>
    /// Station Controller
    /// </summary>
    [Route("api/[controller]")]
    public class StationController : Controller
    {

        List<Trainstation> stations = new List<Trainstation>();

        /// <summary>
        /// Get Stations
        /// </summary>
        /// <remarks>
        /// Gets list of stations from the database
        /// </remarks>
        /// <returns>List of trainstations</returns>
        [HttpGet("[action]")]
        public List<Trainstation> GetStations()
        {

            AspNetDemoDBContext con = new AspNetDemoDBContext();
            foreach (Trainstation st in con.Trainstation)
            {
                if (st.PassengerTraffic)
                {
                    if (st.StationName.Contains(" asema"))
                    {
                        st.StationName = st.StationName.Replace(" asema", "");
                    }
                    stations.Add(st);
                }
            }
            return stations;
        }

    }
}