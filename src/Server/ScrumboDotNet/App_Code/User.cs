using System;

namespace Tekphoria.Common
{
    public class User
    {
        public int id { get; set; }
        public DateTime date_created { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string pwd { get; set; }
        public string more_info { get; set; }
        public string display_name { get; set; }
        public string picture { get; set; }
        public string status { get; set; }
        public string dec_pwd { get; set; }
    }
}