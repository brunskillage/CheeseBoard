using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Mail;

namespace Tekphoria.Common
{
    public static class Config
    {
        public static string GoogleApiKey = ConfigurationManager.AppSettings["mail_admin_email"];

        public static readonly Lazy<string> GetScrumboConnectionString = new Lazy<string>(() =>
        {
            if (IsDevMachine)
                return
                    "Server=192.168.1.130;Database=scrumbo;Uid=dev;Password=devpass";

            return "Server=mysql02.myhostcp.com;Database=scrumbo;Uid=dev;Password=x3n0nx3n0n";
        });

        public static readonly Lazy<string> GetCloggerConnectionString = new Lazy<string>(() =>
        {
            if (IsDevMachine)
                return
                    "Server=192.168.1.130;Database=scrumbo;Uid=dev;Password=devpass";

            return "Server=mysql02.myhostcp.com;Database=scrumbo;Uid=dev;Password=x3n0nx3n0n";
        });

        public static readonly Lazy<string> GetCommonDbConnectionString = new Lazy<string>(() =>
        {
            if (IsDevMachine)
                return
                    "Server=192.168.1.130;Database=common;Uid=dev;Password=devpass";

            return "Server=mysql02.myhostcp.com;Database=common;Uid=dev;Password=x3n0nx3n0n";
        });

        public static readonly Lazy<string> GetJackalDbConnectionString = new Lazy<string>(() =>
        {
            if (IsDevMachine)
                return
                    "Server=192.168.1.130;Database=jackal;Uid=dev;Password=devpass";

            return "Server=mysql02.myhostcp.com;Database=jackal;Uid=jackalUser;Pwd=$xmF9Mdp;";
        });

        public static readonly string encryptKey = "d866f9e8";
        // public static readonly string encryptKey = "0Z8nGSx37PShbcGvp3MquXl854ohjDcIfvo3BohQ";

        public static bool IsDevMachine
        {
            get
            {
                return Environment.MachineName == "LAPTOP-I1OURGB" || Environment.MachineName == "DEVSVR-019156" || Environment.MachineName == "TUI" ||
                       Environment.MachineName == "MOKO" || Environment.MachineName == "WETA";
            }
        }

        public static string FilesPath
        {
            get { return AppDomain.CurrentDomain.BaseDirectory + "userfiles\\files"; }
        }

        public static NetworkCredential email_credentials
        {
            get
            {
                return new NetworkCredential
                {
                    UserName = ConfigurationManager.AppSettings.Get("mail_username"),
                    Password = Crypto.DecryptStringAES(ConfigurationManager.AppSettings.Get("mail_password"), encryptKey)
                };
            }
        }

        public static string email_server { get; } = "mail.tekphoria.co.uk";

        public static MailAddress email_address => new MailAddress("msg@tekphoria.co.uk");
    }
}