using Microsoft.AspNetCore.Components.Forms;

namespace frontend.Models.Manage.Forms
{
    public class BannerFormModel
    {
        public int? ProductId { get; set; }
        public string Title { get; set; } = "";
        public int? Priority { get; set; }
        public string? ImagePathMobile { get; set; }
        public string? ImagePathTablet { get; set; }
        public string? ImagePathDesktop { get; set; }

        public IBrowserFile? FileMobile { get; set; }
        public IBrowserFile? FileTablet { get; set; }
        public IBrowserFile? FileDesktop { get; set; }

        // Centralized list of required field names
        public static readonly HashSet<string> RequiredFieldsCreate = new()
        {
            nameof(ProductId),
            nameof(Title),
            nameof(Priority),
            nameof(FileMobile),
            nameof(FileTablet),
            nameof(FileDesktop)
        };

        public static readonly HashSet<string> RequiredFieldsEdit = new()
        {
            nameof(ProductId),
            nameof(Title),
            nameof(Priority),
            nameof(ImagePathMobile),
            nameof(ImagePathTablet),
            nameof(ImagePathDesktop)
        };
    }
}