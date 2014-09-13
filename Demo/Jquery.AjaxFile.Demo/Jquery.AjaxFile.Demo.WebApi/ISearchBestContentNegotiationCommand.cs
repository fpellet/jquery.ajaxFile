using System.Net.Http;
using System.Net.Http.Formatting;

namespace Jquery.AjaxFile.Demo.WebApi
{
    public interface ISearchBestContentNegotiationCommand
    {
        ContentNegotiationResult Execute<T>(HttpRequestMessage request);
    }
}