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

            Post["/sendFile"] = parameters =>
            {
                var data = this.Bind<SendFileCommand>();

                var file = Request.Files.Single();
                var content = JsonConvert.SerializeObject(data);
                
                using (var reader = new StreamReader(file.Value))
                {
                    content += Environment.NewLine + reader.ReadToEnd();
                }

                var response = new FileContent(file.Name, content);
                return Response.AsText("<textarea>" + JsonConvert.SerializeObject(response) + "</textarea>", "text/html");
            };

            Post["/downloadFile"] = parameters =>
            {
                var file = Request.Files.Single();

                var response = new FileContent(file.Name, null);

                var cookieName = (string)Request.Form["__requestId"];

                return Response.FromStream(file.Value, file.ContentType)
                    .WithHeader("Content-Disposition", "attachment; filename=result.txt;")
                    .WithCookie(cookieName, JsonConvert.SerializeObject(response));
            };

            Post["/downloadFileWithError"] = parameters => Response.AsText("<textarea statusCode=500 statusText=Bad>[\"Can receive error\"]</textarea>", "text/html");
        }
    }
}
