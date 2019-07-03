using System.Net.Mail;

namespace Tekphoria.Common
{
    public static class Email
    {
        public static void Send(string email, string title, string message)
        {
            var mm = new MailMessage();
            mm.From = Config.email_address;
            mm.Subject = "Hello";
            mm.Body = "<p>Body</p>";
            mm.IsBodyHtml = true;
            var smtp = new SmtpClient(Config.email_server, 587);
            smtp.EnableSsl = false;
            smtp.UseDefaultCredentials = true;
            smtp.Credentials = Config.email_credentials;
            smtp.Port = 587;
            smtp.Send(mm);
        }
    }
}