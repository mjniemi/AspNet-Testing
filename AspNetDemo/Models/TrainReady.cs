using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AspNetDemo.Models
{
    /// <summary>
    /// TrainReady class
    /// </summary>
    /// <remarks>
    /// Contains data whether a train is ready to leave
    /// </remarks>
    public class TrainReady
    {
        /// <summary>
        /// Whether the ready check is accepted
        /// </summary>
        public bool Accepted { get; set; }
        /// <summary>
        /// Ready check source
        /// </summary>
        public string Source { get; set; }
        /// <summary>
        /// Ready check timestamp
        /// </summary>
        public string Timestamp { get; set; }
    }
}
