using System.Net.Http.Formatting;
using System.Web.Http;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Jquery.AjaxFile.Demo.WebApi.Startup))]

namespace Jquery.AjaxFile.Demo.WebApi
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var configuration = new HttpConfiguration();
            var contentNegotiator = (IContentNegotiator)configuration.Services.GetService(typeof(IContentNegotiator));
            var searchContentNegotiation = new SearchBestContentNegotiationCommand(contentNegotiator, configuration.Formatters);

            configuration.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            configuration.Filters.Add(new HandleApiExceptionFilterAttribute(searchContentNegotiation));

            configuration.Formatters.Insert(1, new FileUploadByIFrameMediaTypeFormatter());

            app.UseWebApi(configuration);
        }
    }
}
