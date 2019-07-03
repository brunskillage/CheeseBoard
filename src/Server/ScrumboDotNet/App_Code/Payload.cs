namespace Tekphoria.Common
{
    public class Payload
    {
        public string Action { get; set; }
        public dynamic Data { get; set; }
    }

    public class Payload2
    {
        public string MethodName { get; set; }
        public dynamic Data { get; set; }
    }
}