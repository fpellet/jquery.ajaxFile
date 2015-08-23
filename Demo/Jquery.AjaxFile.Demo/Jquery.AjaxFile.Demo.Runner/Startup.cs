using System.IO;
using System.Web.Hosting;
using Microsoft.Owin;
using Microsoft.Owin.Extensions;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;

namespace Jquery.AjaxFile.Demo.Runner
{
    public class Startup
    {
        private readonly WebApi.Startup _apiStartup = new WebApi.Startup();
        private readonly Nancy.Startup _nancyStartup = new Nancy.Startup();

        public void Configuration(IAppBuilder app)
        {
            app.UseFileServer(new FileServerOptions
            {
                RequestPath = new PathString("/Content"),
                FileSystem = new PhysicalFileSystem(Path.Combine(HostingEnvironment.ApplicationPhysicalPath, "../../../dist")),
            });

            _apiStartup.Configuration(app);
            _nancyStartup.Configuration(app);

            app.UseStageMarker(PipelineStage.MapHandler);
        }
    }
}