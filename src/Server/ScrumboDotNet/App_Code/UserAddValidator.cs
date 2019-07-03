using System.Data;
using System.Linq;
using Dapper;
using FluentValidation;


namespace Tekphoria.Common
{
    public class UserAddValidator : AbstractValidator<User>
    {
        private readonly IDbConnection _accountDbConnection;

        public UserAddValidator(IDbConnection accountDbConnection)
        {
            _accountDbConnection = accountDbConnection;

            RuleFor(x => x.email)
                .Must(PassEmailInDbCheck)
                .WithMessage("'Email' already exists.")
                .WithName("Email");

            RuleFor(x => x.display_name)
                .Must(PassDisplayNameDbCheck)
                .WithMessage("'Display Name' already exists.")
                .WithName("Display Name");
        }

        private bool PassDisplayNameDbCheck(string display_name)
        {
            dynamic res =
                _accountDbConnection.Query<dynamic>(
                    "select count(id) as user_count from users where display_name=@display_name;", new
                    {
                        display_name
                    }).Single();
            return res.user_count == 0;
        }

        protected bool PassEmailInDbCheck(string email)
        {
            dynamic res =
                _accountDbConnection.Query<dynamic>("select count(id) as user_count from users where email=@email;", new
                {
                    email
                }).Single();
            return res.user_count == 0;
        }
    }
}