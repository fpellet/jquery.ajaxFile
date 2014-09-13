using System;
using System.Web.Http;

namespace Jquery.AjaxFile.Demo.WebApi.Controllers
{
    public class ErrorFileController : ApiController
    {
        public string Post()
        {
            throw new Exception("Can receive errors");
        }
    }
}
