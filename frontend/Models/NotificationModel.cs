using Microsoft.AspNetCore.Components;

namespace frontend.Models
{
    public class NotificationModel
    {
        public RenderFragment Content = default!;
        public NotificationType Type { get; set; } = NotificationType.Success;
        public bool Sticky { get; set; }  // Set to true for a sticky notification
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsMarkedForRemoval { get; set; } = false;
        public bool IsBeingAdded { get; set; } = true;
    }
    public enum NotificationType
    {
        Success,
        Warning,
        Info,
        Error,
    }
}
