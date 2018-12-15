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

namespace AspNetDemo.Controllers
{
    [Route("api/[controller]")]
    public class StationController : Controller
    {

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("[action]")]
        public List<Models.Trainstation> PopulateStations()
        {

            List<Models.Trainstation> stations = new List<Models.Trainstation>();
            Models.AspNetDemoDBContext con = new Models.AspNetDemoDBContext();
            foreach (Models.Trainstation st in con.Trainstation)
            {
                if (st.PassengerTraffic)
                {
                    stations.Add(st);
                }
            }

            return stations;
        }

       
    }
}