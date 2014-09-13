using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Jquery.AjaxFile.Demo.WebApi.Controllers
{
    public class FileController : ApiController
    {
        public async Task<FileContent> Post()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpException((int)HttpStatusCode.NotAcceptable, "Cette requête attend un fichier");
            }

            var streamProvider = new MultipartMemoryStreamProvider();
            
            var stream = await Request.Content.ReadAsMultipartAsync(streamProvider);

            return await ExtractFileUploaded(stream);
        }

        private async Task<FileContent> ExtractFileUploaded(MultipartStreamProvider streamProvider)
        {
            var fileUploaded = streamProvider.Contents.FirstOrDefault(IsFile);
            if (fileUploaded == null)
            {
                throw new HttpException((int)HttpStatusCode.NotAcceptable, "Cette requête attend un fichier");
            }

            var fileName = Path.GetFileName(ExtractFileName(fileUploaded));

            var content = await fileUploaded.ReadAsStringAsync();
            
            return new FileContent(fileName, content);
        }

        private static string ExtractFileName(HttpContent fileUploaded)
        {
            return fileUploaded.Headers.ContentDisposition.FileName.Trim('"');
        }

        private static bool IsFile(HttpContent o)
        {
            return !string.IsNullOrEmpty(o.Headers.ContentDisposition.FileName);
        }
    }
}
