namespace Jquery.AjaxFile.Demo.WebApi.Controllers
{
    public class FileContent
    {
        public FileContent(string name, string content)
        {
            Name = name;
            Content = content;
        }

        public string Name { get; private set; }

        public string Content { get; private set; }
    }
}