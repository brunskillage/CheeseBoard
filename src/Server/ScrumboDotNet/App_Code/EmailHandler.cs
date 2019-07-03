using System;
using System.Diagnostics;
using System.Net.Mail;
using System.Web;

namespace Tekphoria.Common
{
    public class EmailHandler : JsonServer, IHttpHandler
    {
        public bool IsReusable { get; private set; }

        public new void ProcessRequest(HttpContext context)
        {
            try
            {
                base.ProcessRequest(context);
            }
            catch (Exception ex)
            {
                HandleError(ex);
            }
        }

        public dynamic SendMailTest(EmailArgs args)
        {
            try
            {
                using (var mailMessage = new MailMessage(Config.email_address, new MailAddress(args.To)))
                using (var smtp = new SmtpClient(Config.email_server))
                {
                    mailMessage.Subject = args.Subject;
                    mailMessage.Body = args.Body;
                    mailMessage.IsBodyHtml = args.IsHtml;

                    smtp.Credentials = Config.email_credentials;
                    smtp.Send(mailMessage);
                }
            }
            catch (Exception ex)
            {
                Debug.Write(ex);
            }

            return new
            {
                exception = "none",
                message = "OK"
            };
        }
    }
}