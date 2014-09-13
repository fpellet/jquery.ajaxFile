using System.Collections.Generic;

namespace Jquery.AjaxFile.Demo.Nancy
{
    public class SendFileCommand
    {
        public string Name { get; set; }

        public UserData Data { get; set; }

        public List<UserData> List { get; set; }
    }
}