using System;
using System.Data;
using System.Linq;
using Dapper;
using FluentValidation;
using FluentValidation.Results;

namespace Tekphoria.Common
{
    public class SignInValidator : AbstractValidator<User>
    {
        private readonly IDbConnection _accountsDb;
        private User user;

        public SignInValidator(IDbConnection accountsDb)
        {
            _accountsDb = accountsDb;

            Custom(user =>
            {
                var db_user =
                    _accountsDb.Query<User>(
                        "select id,date_created,password,pwd,status from users where email=@email;", new
                        {
                            user.email
                        }).FirstOrDefault();

                if (db_user == null)
                    return new ValidationFailure("email", "email not found.");

                if (string.CompareOrdinal(db_user.status, "VERIFIED") != 0)
                    return new ValidationFailure("account", "Account not verified.");

                if (string.IsNullOrWhiteSpace(db_user.pwd))
                {
                    // upgrade the password
                    var enc_password = Crypto.EncryptStringAes(db_user.password, Config.encryptKey);
                    _accountsDb.Execute("update users set password='v2', pwd=@pwd where id=@id;", new
                    {
                        pwd = enc_password,
                        db_user.id
                    });
                    db_user.pwd = enc_password;
                }

                if (string.CompareOrdinal(db_user.password, "v2") != 0 &&
                    string.CompareOrdinal(user.password, db_user.password) != 0)
                    return new ValidationFailure("password", "The password is is not valid (v1)");

                var enc_pwd = db_user.pwd.ToString();
                var decrypted_password = Crypto.DecryptStringAES(enc_pwd, Config.encryptKey);

                if (string.CompareOrdinal(user.password, decrypted_password) != 0)
                    return new ValidationFailure("password", "The password is is not valid (v2)");

                if (db_user.date_created.AddHours(4) < DateTime.UtcNow &&
                    string.CompareOrdinal(db_user.status, "VERIFIED") != 0)
                    return new ValidationFailure("account", "Grace period expired.");

                return null;
            });
        }
    }
}