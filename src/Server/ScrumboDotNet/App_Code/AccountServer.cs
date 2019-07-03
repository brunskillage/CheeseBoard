using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Dynamic;
using System.Linq;
using System.Web;
using Dapper;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Tekphoria.Common
{
    public class AccountServer : JsonServer, IHttpHandler
    {
        private IDbConnection _accountsDbConnection;

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
            finally
            {
                CloseConnection(GetAccountsDbConnection());
            }
        }

        public IDbConnection GetAccountsDbConnection()
        {
            if (_accountsDbConnection == null || _accountsDbConnection.State != ConnectionState.Open)
                _accountsDbConnection = GetOpenConnection(Config.GetCommonDbConnectionString.Value);
            return _accountsDbConnection;
        }

        public void LogOut()
        {
            foreach (var cookieName in HttpContext.Current.Request.Cookies.AllKeys)
            {
                var ck = HttpContext.Current.Request.Cookies[cookieName];
                ck.Value = null;
                ck.Expires = DateTime.Now.AddYears(-1);
                HttpContext.Current.Response.Cookies.Add(ck);
            }
        }

        public dynamic UserChangePassword(dynamic data)
        {
            var user = new User
            {
                id = data.user_id,
                password = data.password,
                email = "someemail@test.com" // always validates
            };

            var val = new UserValidator();
            var validationResult = val.Validate(user, ruleSet: "emailandpwd");
            if (validationResult.IsValid)
            {
                var pwd = Crypto.EncryptStringAes(user.password, Config.encryptKey);
                dynamic res =
                    GetAccountsDbConnection()
                        .Execute(
                            "update users set password='v2',pwd=@pwd where id=@id",
                            new
                            {
                                user.id,
                                pwd
                            });
            }

            return new
            {
                validationResult
            };
        }

        public dynamic UserSignInTry(dynamic data)
        {
            try
            {
                var anon_user = new User
                {
                    email = data.email.ToString(),
                    password = data.password.ToString()
                };

                var val = new UserValidator();
                var validationResult = val.Validate(anon_user, ruleSet: "emailandpwd");

                if (!validationResult.IsValid)
                    return new {validationResult};

                var validator = new SignInValidator(GetAccountsDbConnection());
                validationResult = validator.Validate(anon_user);

                if (validationResult.IsValid)
                {
                    dynamic account =
                        GetAccountsDbConnection()
                            .Query<dynamic>("select id,display_name,pwd from users where email=@email;", new
                            {
                                data.email
                            }).Single();

                    // add ticket
                    var ticket =
                        Guid.NewGuid()
                            .ToString()
                            .Replace("{", string.Empty)
                            .Replace("}", string.Empty)
                            .Replace("-", string.Empty)
                            .ToUpperInvariant()
                            .Substring(0, 16);

                    var clearTicket = "delete from tickets where user_id = @user_id;";
                    var addticket =
                        "insert into tickets (user_id, date_expires, access_id) values (@user_id, @date_expires, @access_id);";
                    dynamic user_id = account.id;

                    GetAccountsDbConnection().Execute(clearTicket + addticket, new
                    {
                        user_id,
                        date_expires = DateTime.UtcNow.AddDays(30),
                        access_id = ticket
                    });

                    SetCookie("IsLoggedIn", "1");
                    SetCookie("UserName", account.display_name.ToString());
                    SetCookie("Auth", ticket);
                    SetCookie("UserId", account.id.ToString());

                    // http://www.codeproject.com/Articles/408306/Understanding-and-Implementing-ASP-NET-Custom-Form

                    var signed_in = true;
                    return new
                    {
                        validationResult,
                        account,
                        signed_in
                    };
                }

                return new
                {
                    validationResult
                };
            }
            catch (Exception ex)
            {
                Debug.Print(ex.ToString());
                throw ex;
            }
        }

        public dynamic UserAdd(dynamic data)
        {
            var anon_user = new User
            {
                display_name = data.display_name.ToString(),
                email = data.email.ToString(),
                password = data.password.ToString()
            };
            try
            {
                var val = new UserValidator();
                var validationResult = val.Validate(anon_user, ruleSet: "emailandpwd,displayname");

                if (!validationResult.IsValid)
                    return new {validationResult};

                var validator = new UserAddValidator(GetAccountsDbConnection());
                validationResult = validator.Validate(anon_user);

                if (validationResult.IsValid)
                {
                    var pwd = Crypto.EncryptStringAes(anon_user.password, Config.encryptKey);
                    data.password = "v2";
                    dynamic res =
                        GetAccountsDbConnection()
                            .Query<dynamic>(
                                "insert into users (email,display_name,date_created,pwd,password) values (@email,@display_name,UTC_TIMESTAMP(),@pwd,'v2');select last_insert_id() as newid;",
                                new
                                {
                                    anon_user.email,
                                    anon_user.display_name,
                                    pwd
                                }).Single();

                    var stringToEncrypt = JsonConvert.SerializeObject(new
                    {
                        user_id = res.newid
                    });
                    var encrypted = Crypto.EncryptStringAes(stringToEncrypt, Config.encryptKey);

                    var domain = "www.tekphoria.co.uk";

                    if (Config.IsDevMachine)
                    {
                        data.email = "abrunskill@yahoo.co.uk";
                        domain = "localhost:1001";
                    }

                    var handler = new EmailHandler();
                    handler.SendMailTest(new EmailArgs
                    {
                        To = data.email,
                        Subject = string.Format("Account Verification for {0}", domain),
                        Body =
                            string.Format("Click <a href='http://{0}/account/verify?k={1}'>here</a> to verify account.",
                                domain, encrypted),
                        IsHtml = true
                    });

                    return new
                    {
                        validationResult,
                        id = res.newid
                    };
                }


                return new
                {
                    validationResult
                };
            }
            catch (Exception ex)
            {
                Debug.Write(ex);
                throw;
            }
        }

        public dynamic VerifyAccount(dynamic data)
        {
            var user_id = (int) data.user_id;

            dynamic user = GetVerifiedUserById(data);
            if (user != null)
                throw new DataException("User already verified.");

            var sql = "update users set status='VERIFIED' where id=@user_id";
            dynamic res = GetAccountsDbConnection().Execute(sql, new
            {
                user_id
            });

            var confimSql = "select status from users where status='VERIFIED' and id=@user_id";
            var confirmResult = GetAccountsDbConnection().Query(confimSql, new
            {
                user_id
            }).ToList();

            if (confirmResult.Any())
            {
                return new
                {
                    result = "confirmed"
                };
            }

            return new
            {
                result = "error"
            };
        }

        public dynamic GetVerifiedUserById(dynamic data)
        {
            var sql = "select display_name from users where status='VERIFIED' and id = @user_id;";
            dynamic user = GetAccountsDbConnection().Query<dynamic>(sql, new
            {
                data.user_id
            }).ToList().FirstOrDefault();
            return user;
        }

        public dynamic GetUsersById(dynamic data)
        {
            var id_list = (string) data.id_list;
            if (string.IsNullOrWhiteSpace(id_list))
                id_list = "0";

            var sql = "select id, display_name from users where id in(" + id_list + ");";
            dynamic user_list = GetAccountsDbConnection().Query<dynamic>(sql, new
            {
                id_list
            }).ToList();

            return new
            {
                user_list
            };
        }

        public dynamic GetUserByEmail(dynamic data)
        {
            var validator = new UserExistsByEmailValidator();
            var validationResult = validator.Validate(new JObject(data));
            if (validationResult.IsValid)
            {
                var sql = "select id, display_name from users where email=@email;";
                dynamic user_list = GetAccountsDbConnection().Query<dynamic>(sql, new
                {
                    data.email
                }).ToList();
                return new
                {
                    validationResult,
                    user_list
                };
            }

            return new
            {
                validationResult,
                user_list = new List<dynamic>()
            };
        }

        public class UserExistsByEmailValidator : AbstractValidator<JObject>
        {
            public UserExistsByEmailValidator()
            {
                RuleFor(x => x.GetValue("email").ToString())
                    .EmailAddress()
                    .WithMessage("Email is not valid")
                    .WithName("email");
            }
        }
    }
}