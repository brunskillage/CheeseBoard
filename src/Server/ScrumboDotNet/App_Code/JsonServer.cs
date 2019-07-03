using System;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.IO;
using System.Linq;
using System.Security.Authentication;
using System.Text;
using System.Web;
using Dapper;
using FluentValidation;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

namespace Tekphoria.Common
{
    public abstract class JsonServer : IHttpHandler
    {
        public bool IsReusable
        {
            get { return false; }
        }

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            context.Response.ContentEncoding = Encoding.UTF8;
            try
            {
                Authorise(context);
            }
            catch (Exception)
            {
                var resp = new
                {
                    code = 401
                };
                context.Response.Write(JsonConvert.SerializeObject(resp));
                return;
            }

            string body;
            using (TextReader reader = new StreamReader(context.Request.InputStream, Encoding.UTF8))
                body = reader.ReadToEnd();

            //body = Translate(body);

            if (string.IsNullOrWhiteSpace(body))
                throw new DataException("Payload is empty.");

            var payload = JsonConvert.DeserializeObject<Payload2>(body);

            var user_id = context.Request.Headers["UserId"] ?? "0";
            HttpContext.Current.Items["UserId"] = user_id;
            payload.Data.user_id = user_id;

            var methodInfo = GetType().GetMethod(payload.MethodName);
            var attributes = methodInfo.GetCustomAttributes(typeof(ValidationAttribute), false);
            if (attributes.Length > 0)
            {
                var validationAttribute = attributes[0] as ValidationAttribute;
            }

            ValidatorOptions.CascadeMode = CascadeMode.StopOnFirstFailure;
            var result = methodInfo.Invoke(this, new object[] {payload.Data});

            //context.Response.Write(Translate(JsonConvert.SerializeObject(result)));
            context.Response.Write(JsonConvert.SerializeObject(result));
        }

        public string Translate(string input)
        {
            var key = 1083756;
            var inSb = new StringBuilder(input);
            var outSb = new StringBuilder(input.Length);
            char c;
            for (var i = 0; i < input.Length; i++)
            {
                c = inSb[i];
                c = (char) (c ^ key);
                outSb.Append(c);
            }

            return outSb.ToString();
        }

        public void SetCookie(string name, string value)
        {
            var ck = new HttpCookie(name, value);
            ck.Expires = DateTime.Now.AddDays(30);
            HttpContext.Current.Response.Cookies.Add(ck);
        }

        public string GetCookieValue(HttpContext ctx, string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return null;

            var ck = ctx.Request.Cookies[name];
            if (ck == null || string.IsNullOrWhiteSpace(ck.Value))
                return null;

            return ck.Value;
        }

        public void Authorise(HttpContext ctx)
        {
            IDbConnection commonDbConnection = null;
            try
            {
                var ticket = GetCookieOrHeader(ctx, "Auth");


                if (string.IsNullOrWhiteSpace(ticket))
                {
                    throw new AuthenticationException("Ticket is invalid");
                }

                var user_id = GetCookieOrHeader(ctx, "UserId") ?? "0";

                commonDbConnection = GetOpenConnection(Config.GetCommonDbConnectionString.Value);
                var res =
                    commonDbConnection.Query(
                        "SELECT access_id FROM  tickets INNER JOIN users ON users.id = tickets.user_id WHERE tickets.access_id =  @access_id AND tickets.date_expires > UTC_TIMESTAMP() LIMIT 1",
                        new {access_id = ticket, user_id, nowutc = DateTime.UtcNow}).ToList();

                if (!res.Any())
                    throw new AuthenticationException("Ticket is not found");
            }
            finally
            {
                CloseConnection(commonDbConnection);
            }
        }

        public string GetHeaderValue(HttpContext ctx, string name)
        {
            var headers = ctx.Request.Headers;
            var val = headers.AllKeys.FirstOrDefault(x => x == name);
            if (!string.IsNullOrWhiteSpace(val))
                return headers[name].Trim();

            return null;
        }

        private string GetCookieOrHeader(HttpContext ctx, string name)
        {
            return GetHeaderValue(ctx, name) ?? GetCookieValue(ctx, name);
        }

        public static void HandleError(Exception ex)
        {
            HttpContext.Current.Response.StatusCode = 500;
            dynamic error = new
            {
                error = GetException(ex).Message
            };
            HttpContext.Current.Response.Write(JsonConvert.SerializeObject(error));
        }

        private static Exception GetException(Exception ex)
        {
            if (ex != null && ex.InnerException != null)
                return ex.InnerException;

            return ex;
        }


        public static IDbConnection GetOpenConnection(string connectionString)
        {
            IDbConnection dbConnection = new MySqlConnection(connectionString);
            dbConnection.Open();
            return dbConnection;
        }

        public static void CloseConnection(IDbConnection con)
        {
            if (con != null)
            {
                con.Close();
                con.Dispose();
            }
        }
    }
}