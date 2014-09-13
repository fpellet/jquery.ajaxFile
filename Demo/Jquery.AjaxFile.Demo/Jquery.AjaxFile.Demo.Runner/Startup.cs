using Owin;

namespace Jquery.AjaxFile.Demo.Runner
{
    public class Startup
    {
        private readonly WebApi.Startup _apiStartup = new WebApi.Startup();
        private readonly Nancy.Startup _nancyStartup = new Nancy.Startup();

        public void Configuration(IAppBuilder app)
        {
            _apiStartup.Configuration(app);
            _nancyStartup.Configuration(app);
        }
    }
}