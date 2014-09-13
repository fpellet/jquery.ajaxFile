using System.Net.Http;
using System.Net.Http.Formatting;

namespace Jquery.AjaxFile.Demo.WebApi
{
    public class SearchBestContentNegotiationCommand : ISearchBestContentNegotiationCommand
    {
        private readonly IContentNegotiator _contentNegotiator;
        private readonly MediaTypeFormatterCollection _formatters;

        public SearchBestContentNegotiationCommand(IContentNegotiator contentNegotiator, MediaTypeFormatterCollection formatters)
        {
            _contentNegotiator = contentNegotiator;
            _formatters = formatters;
        }

        public ContentNegotiationResult Execute<T>(HttpRequestMessage request)
        {
            return _contentNegotiator.Negotiate(typeof(T), request, _formatters);
        }
    }
}