using Microsoft.AspNetCore.Components;

namespace frontend.ViewModels
{
    public class CarouselItem
    {
        public required RenderFragment Content { get; set; }
        public RenderFragment? PaginationContent { get; set; } // Optional custom pagination display
        public EventCallback OnClick { get; set; } // Optional click handler
    }
}