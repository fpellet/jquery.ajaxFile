using System;
using System.IO;
using System.Linq;
using Jquery.AjaxFile.Demo.WebApi.Controllers;
using Nancy;
using Nancy.ModelBinding;
using Newtonsoft.Json;

namespace Jquery.AjaxFile.Demo.Nancy
{
    public class IndexModule : NancyModule
    {
        public IndexModule()
        {
            Get["/"] = parameters => View["index"];

            Post["/file"] = parameters =>
            {
                var data = this.Bind<SendFileCommand>();

                var content = JsonConvert.SerializeObject(data);

                var file = Request.Files.Single();
                using (var reader = new StreamReader(file.Value))
                {
                    content += Environment.NewLine + reader.ReadToEnd();
                }

                var response = new FileContent(file.Name, content);
                return Response.AsText("<textarea>" + JsonConvert.SerializeObject(response) + "</textarea>", "text/html");
            };
        }
    }
}
