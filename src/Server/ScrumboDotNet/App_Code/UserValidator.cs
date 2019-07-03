using FluentValidation;

namespace Tekphoria.Common
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleSet("displayname", () => RuleFor(x => x.display_name)
                .Length(3, 50)
                .Matches("[a-zA-Z0-9_-]")
                .WithName("Display Name")
                .WithMessage("'Display Name' must only contain the characters 'a-z A-Z 0-9 _-'."));

            RuleSet("emailandpwd", () =>
            {
                RuleFor(x => x.email).EmailAddress().WithName("Email");


                RuleFor(x => x.password)
                    .Length(7, 256)
                    .Matches("[a-zA-Z0-9_-]")
                    .WithName("Password")
                    .WithMessage("'Password' must only contain the characters 'a-z A-Z 0-9 _-'.");
            });

            RuleSet("validid", () => { RuleFor(x => x.id).GreaterThan(0).WithMessage("The User is invalid"); });
        }
    }
}