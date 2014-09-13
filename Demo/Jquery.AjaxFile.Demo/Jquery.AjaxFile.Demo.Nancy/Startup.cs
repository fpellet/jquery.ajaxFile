using Owin;

namespace Jquery.AjaxFile.Demo.Nancy
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseNancy(options => options.Bootstrapper = new Bootstrapper());
        }
    }
}