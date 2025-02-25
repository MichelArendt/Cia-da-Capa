using Microsoft.AspNetCore.Components;

namespace frontend.ViewModels.TabbedNavigation
{
    public class TabViewModel
    {
        public int? Id { get; set; }
        public required string Title { get; set; }
        public required RenderFragment Content { get; set; }
        public bool Visible { get; set; } = false;
    }
}
