using Microsoft.AspNetCore.Components.Forms;

namespace frontend.ViewModels
{
    public class GalleryEditableViewModel
    {
        public bool IsDragging { get; set; }
        public int DragDepth { get; set; }
        public int? DraggedProductId { get; set; }
        public bool OrderingChanged { get; set; }
        public HashSet<int> DeletingImages { get; set; } = new();
        public InputFile? InputFileRef;

    }
}
