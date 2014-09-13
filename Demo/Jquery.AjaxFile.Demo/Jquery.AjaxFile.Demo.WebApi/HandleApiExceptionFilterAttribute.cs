using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Text;
using System.Web;
using System.Web.Http.Filters;

namespace Jquery.AjaxFile.Demo.WebApi
{
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class HandleApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly ISearchBestContentNegotiationCommand _searchBestContentNegotiationCommand;

        public HandleApiExceptionFilterAttribute(ISearchBestContentNegotiationCommand searchBestContentNegotiationCommand)
        {
            _searchBestContentNegotiationCommand = searchBestContentNegotiationCommand;
        }

        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            var exception = actionExecutedContext.Exception;

            var request = actionExecutedContext.Request;

            var statusCode = GetStatusCode(exception);
            var message = GenerateMessage(exception);

            actionExecutedContext.Response = CreateResponse(statusCode, message, request);
        }

        private static List<string> GenerateMessage(Exception exception)
        {
            var aggregateException = exception as AggregateException;
            if (aggregateException != null)
            {
                return aggregateException.InnerExceptions.Select(ExtractExceptionMessage).ToList();
            }

            var message = ExtractExceptionMessage(exception);
            return new List<string> { message };
        }

        private static string ExtractExceptionMessage(Exception exception)
        {
            var str = new StringBuilder();
            while (exception != null)
            {
                if (!IsFirstExceptionMessage(str))
                {
                    str.Append(' ');
                }

                str.Append(exception.Message);

                if (!IsFirstExceptionMessage(str) && !HasMessageDot(str))
                {
                    str.Append('.');
                }

                exception = exception.InnerException;
            }

            return str.ToString();
        }

        private static bool HasMessageDot(StringBuilder str)
        {
            return str[str.Length - 1] == '.';
        }

        private static bool IsFirstExceptionMessage(StringBuilder str)
        {
            return str.Length == 0;
        }

        private static HttpStatusCode GetStatusCode(Exception exception)
        {
            var httpException = exception as HttpException;
            if (httpException != null)
            {
                return (HttpStatusCode)httpException.GetHttpCode();
            }

            return HttpStatusCode.InternalServerError;
        }

        private HttpResponseMessage CreateResponse<T>(HttpStatusCode statusCode, T message, HttpRequestMessage request)
        {
            var negotiationResult = _searchBestContentNegotiationCommand.Execute<T>(request);
            var formatter = negotiationResult.Formatter;

            if (formatter is IApiErrorWrapperFormatter)
            {
                var messageWrapper = new ApiErrorWrapper(statusCode, message, typeof(T));

                return CreateResponse(HttpStatusCode.OK, messageWrapper, formatter, negotiationResult);
            }

            return CreateResponse(statusCode, message, formatter, negotiationResult);
        }

        private static HttpResponseMessage CreateResponse<T>(HttpStatusCode statusCode, T message, MediaTypeFormatter formatter, ContentNegotiationResult negotiationResult)
        {
            return new HttpResponseMessage(statusCode)
            {
                Content = new ObjectContent(typeof(T), message, formatter, negotiationResult.MediaType)
            };
        }
    }
}