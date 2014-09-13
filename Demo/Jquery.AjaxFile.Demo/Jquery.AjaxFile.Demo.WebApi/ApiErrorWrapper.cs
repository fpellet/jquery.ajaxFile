using System;
using System.Net;

namespace Jquery.AjaxFile.Demo.WebApi
{
    public class ApiErrorWrapper
    {
        public ApiErrorWrapper(HttpStatusCode statusCode, object message, Type messageType)
        {
            StatusCode = statusCode;
            Message = message;
            MessageType = messageType;
        }

        public HttpStatusCode StatusCode { get; private set; }

        public object Message { get; private set; }

        public Type MessageType { get; private set; }
    }
}