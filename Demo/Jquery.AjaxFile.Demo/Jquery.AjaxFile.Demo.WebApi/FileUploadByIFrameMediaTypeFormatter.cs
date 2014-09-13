using System;
using System.Globalization;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Jquery.AjaxFile.Demo.WebApi
{
    public class FileUploadByIFrameMediaTypeFormatter : JsonMediaTypeFormatter, IApiErrorWrapperFormatter
    {
        private const string BeginTagFormat = "<textarea statusCode=\"{0}\" statusText=\"{1}\">";
        private const string EndTag = "</textarea>";
        private const string OutputMediaType = "text/html";

        public FileUploadByIFrameMediaTypeFormatter()
        {
            SupportedMediaTypes.Clear();

            AddSupportedMediaType("application/xhtml+xml");
            AddSupportedMediaType(OutputMediaType);
            AddSupportedMediaType("application/x-ms-application");
            AddSupportedMediaType("application/xaml+xml");
            SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/xhtml+xml"));
            SupportedMediaTypes.Add(new MediaTypeHeaderValue(OutputMediaType));
            SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/x-ms-application"));
            SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/xaml+xml"));
        }

        private void AddSupportedMediaType(string mediaType)
        {
            SupportedMediaTypes.Add(new MediaTypeHeaderValue(mediaType));
            MediaTypeMappings.Add(new RequestHeaderMapping("Accept", mediaType, StringComparison.OrdinalIgnoreCase, true, OutputMediaType));
        }

        public override Task WriteToStreamAsync(Type type, object value, Stream writeStream, HttpContent content, TransportContext transportContext)
        {
            var apiErrorWrapper = value as ApiErrorWrapper;
            if (apiErrorWrapper != null)
            {
                return WriteToStreamAsync(apiErrorWrapper.MessageType, apiErrorWrapper.Message, writeStream, content, transportContext, apiErrorWrapper.StatusCode);
            }

            return WriteToStreamAsync(type, value, writeStream, content, transportContext, HttpStatusCode.OK);
        }

        private Task WriteToStreamAsync(Type type, object value, Stream writeStream, HttpContent content, TransportContext transportContext, HttpStatusCode statusCode)
        {
            var effectiveEncoding = SelectCharacterEncoding(content == null ? null : content.Headers);

            WriteStringToOutput(writeStream, GenerateBeginTag(statusCode), effectiveEncoding);

            return base.WriteToStreamAsync(type, value, writeStream, content, transportContext)
                .ContinueWith(t => WriteStringToOutput(writeStream, EndTag, effectiveEncoding));
        }

        private static string GenerateBeginTag(HttpStatusCode statusCode)
        {
            return string.Format(CultureInfo.InvariantCulture, BeginTagFormat, (int)statusCode, statusCode);
        }

        private void WriteStringToOutput(Stream writeStream, string str, Encoding encoding)
        {
            var bytes = encoding.GetBytes(str);

            writeStream.Write(bytes, 0, bytes.Length);
        }
    }
}