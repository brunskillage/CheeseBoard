using System.Data;
using System.Linq;
using System.Web;
using Dapper;
using Newtonsoft.Json.Linq;

namespace Tekphoria.Web.Server.Scrumbo
{
    public class Validators
    {
        #region Nested type: BoardConfigValidator

        public class BoardConfigValidator : AbstractValidator<JObject>
        {
            public BoardConfigValidator()
            {
                RuleFor(x => x.GetValue("nameof").ToString())
                    .Length(3, 100)
                    .WithMessage("Board name should be at least 2 characters long and no more than 100.")
                    .WithName("nameof");
                RuleFor(x => x.GetValue("extra_status_1").ToString())
                    .Length(0, 15)
                    .WithMessage("Status Columns should be between 3 and 20 Characters in length.")
                    .WithName("extra_status_1");
                RuleFor(x => x.GetValue("extra_status_2").ToString())
                    .Length(0, 15)
                    .WithMessage("Status Columns should be between 3 and 20 Characters in length.")
                    .WithName("extra_status_2");
                RuleFor(x => x.GetValue("more_info").ToString())
                    .Length(0, 500)
                    .WithMessage("The extra information field is too long. Try entering less text.")
                    .WithName("more_info");
            }
        }

        #endregion

        #region Nested type: BoardValidator

        public class BoardValidator : AbstractValidator<JObject>
        {
            public BoardValidator()
            {
                RuleFor(x => x.GetValue("nameof").ToString())
                    .Length(3, 100)
                    .WithMessage("Board name should be at least 2 characters long and no more than 100.")
                    .WithName("nameof");
            }
        }

        #endregion

        #region Nested type: EmptyValidator

        public class EmptyValidator : AbstractValidator<JObject>
        {
        }

        #endregion

        #region Nested type: SignInValidator

        public class SignInValidator : AbstractValidator<JObject>
        {
            public SignInValidator()
            {
                RuleFor(x => x.GetValue("email").ToString())
                    .EmailAddress()
                    .WithMessage("Email is not valid.")
                    .Must(HaveEmailInDB)
                    .WithMessage("Email not recognised.")
                    .WithName("email");
                When(data => HaveEmailInDB((string) data.GetValue("email")),
                    () => RuleFor(data => data)
                        .Must(HaveValidPassword)
                        .WithName("password")
                        .WithMessage("Password is not valid."));
            }

            protected bool HaveValidPassword(JObject data)
            {
                var con = HttpContext.Current.Items["con"] as IDbConnection;
                var email = data.GetValue("email").ToString();
                var password = data.GetValue("password").ToString();
                dynamic res = con.Query<dynamic>("select email,password from users where email=@email;",
                    new {email}).FirstOrDefault();
                dynamic dbpass = res.password.ToString();
                return dbpass == password;
            }

            protected bool HaveEmailInDB(string email)
            {
                var con = HttpContext.Current.Items["con"] as IDbConnection;
                dynamic res = con.Query<dynamic>("select count(id) as user_count from users where email=@email;",
                        new {email})
                    .Single();
                return res.user_count > 0;
            }
        }

        #endregion

        #region Nested type: StoryValidator

        public class StoryValidator : AbstractValidator<JObject>
        {
            public StoryValidator()
            {
                RuleFor(x => x.GetValue("textof").ToString())
                    .Length(5, 300)
                    .WithMessage("Story text should be at least 10 characters long.")
                    .WithName("textof");
            }
        }

        #endregion

        #region Nested type: TaskValidator

        public class TaskValidator : AbstractValidator<JObject>
        {
            public TaskValidator()
            {
                RuleFor(x => x.GetValue("textof").ToString())
                    .Length(2, 500)
                    .WithMessage("Task text name should be at least 3 characters long and no more than 500.")
                    .WithName("textof");
            }
        }

        #endregion

        #region Nested type: UserAddSharedBoardValidator

        public class UserAddSharedBoardValidator : AbstractValidator<JObject>
        {
            public UserAddSharedBoardValidator()
            {
                RuleFor(x => x.GetValue("hash").ToString())
                    .Length(5, 50)
                    .WithMessage("The hash should be 5 or more characters.")
                    .Must(HaveExistingBoard)
                    .WithName("hash")
                    .WithMessage("The board has was not recognised.")
                    .Must(NotHaveExistingLink)
                    .WithMessage("This board is already in your list.");
            }

            protected bool HaveExistingBoard(string hash)
            {
                var con = HttpContext.Current.Items["con"] as IDbConnection;
                dynamic res = con.Query<dynamic>("select count(id) as board_count from boards where hash=@hash;",
                        new {hash})
                    .Single();
                return res.board_count == 1;
            }

            protected bool NotHaveExistingLink(string hash)
            {
                var con = HttpContext.Current.Items["con"] as IDbConnection;
                dynamic res =
                    con.Query<dynamic>(
                            "select count(id) as link_count from user_boards where board_hash=@hash and user_id=@user_id;",
                            new {hash, user_id = HttpContext.Current.Items["UserId"]})
                        .Single();
                return res.link_count == 0;
            }
        }

        #endregion

        #region Nested type: UserAddValidator

        public class UserAddValidator : AbstractValidator<JObject>
        {
            public UserAddValidator()
            {
                RuleFor(x => x.GetValue("email").ToString())
                    .EmailAddress()
                    .WithMessage("Email is not valid.")
                    .Must(HaveNoEmailInDB)
                    .WithMessage("Email already exists.")
                    .WithName("email");
                RuleFor(x => x.GetValue("password").ToString())
                    .Length(5, 100)
                    .WithMessage("The password is to short.")
                    .WithName("password");
                RuleFor(x => x.GetValue("display_name").ToString())
                    .Length(3, 100)
                    .WithMessage("A display name must be entered and be at least 3 characters long.")
                    .WithName("display_name");
            }

            protected bool HaveNoEmailInDB(string email)
            {
                var con = HttpContext.Current.Items["con"] as IDbConnection;
                dynamic res = con.Query<dynamic>("select count(id) as user_count from users where email=@email;",
                        new {email})
                    .Single();
                return res.user_count == 0;
            }
        }

        #endregion

        #region Nested type: UserUpdateValidator

        public class UserUpdateValidator : AbstractValidator<JObject>
        {
            public UserUpdateValidator()
            {
                RuleFor(x => x.GetValue("password").ToString())
                    .Length(5, 100)
                    .WithMessage("The password is to short.")
                    .WithName("password");
                RuleFor(x => x.GetValue("display_name").ToString())
                    .Length(3, 100)
                    .WithMessage("A display name must be entered and be at least 3 characters long.")
                    .WithName("display_name");
            }
        }

        #endregion
    }
}