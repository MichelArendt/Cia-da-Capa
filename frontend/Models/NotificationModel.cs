using Microsoft.AspNetCore.Components;

namespace frontend.Models
{
    public class NotificationModel
    {
        /// <summary>
        /// The content to display (as a RenderFragment).
        /// </summary>
        public RenderFragment Content = default!;

        /// <summary>
        /// The type of the notification (e.g. Success, Warning, Info, or ServerError).
        /// </summary>
        public NotificationType Type { get; set; } = NotificationType.Success;

        /// <summary>
        /// When true, the notification will remain visible until manually removed.
        /// </summary>
        public bool Sticky { get; set; }  // Set to true for a sticky notification

        /// <summary>
        /// The timestamp when the notification was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Flag to indicate if the notification is marked for removal (used for animation purposes).
        /// </summary>
        public bool IsMarkedForRemoval { get; set; } = false;

        /// <summary>
        /// Flag indicating if the notification is currently being added (used for animation purposes).
        /// </summary>
        public bool IsBeingAdded { get; set; } = true;

        /// <summary>
        /// If the notification type is ServerError, this error message is required.
        /// </summary>
        public string? ErrorMessage { get; set; }

        /// <summary>
        /// This method provides custom validation logic.
        /// If the notification type is ServerError, then ErrorMessage must be provided.
        /// Note: This validation is only triggered if you explicitly validate the model.
        /// </summary>
        public void Validate()
        {
            if (Type == NotificationType.ServerError && string.IsNullOrWhiteSpace(ErrorMessage))
            {
                throw new InvalidOperationException("An error message is required when the notification type is ServerError.");
            }
        }
    }

    /// <summary>
    /// Enumerates the possible types of notifications.
    /// </summary>
    public enum NotificationType
    {
        Success,
        Warning,
        Info,
        ValidationError,
        ServerError,
    }
}
