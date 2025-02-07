using frontend.Components.Shared.UI;
using frontend.Models;
using Microsoft.AspNetCore.Components;

namespace frontend.Services
{
    public class NotificationService
    {
        public List<NotificationModel> Notifications { get; private set; } = [];
        public Action? OnNotificationAdded { get; set; }
        public event Action? OnNotificationRemoved;
        public event Action? OnNotificationIsBeingAdded;
        public event Action? OnNotificationIsBeingRemoved;

        /// <summary>
        /// Adds a notification to the list and returns a reference to it.
        /// </summary>
        /// <param name="content">The RenderFragment to display.</param>
        /// <param name="type">Notification type (default is Success).</param>
        /// <param name="sticky">If true, the notification is sticky and must be removed manually.</param>
        /// <returns>A reference to the created NotificationModel.</returns>
        public NotificationModel DisplayNotification(RenderFragment content, NotificationType type = NotificationType.Success, bool sticky = false)
        {
            var notification = new NotificationModel
            {
                Content = content,
                Type = type,
                Sticky = sticky
            };

            DisplayNotification(notification);

            return notification;
        }

        public void DisplayNotification(NotificationModel notificationModel)
        {
            Notifications.Add(notificationModel);
            OnNotificationIsBeingAdded?.Invoke();


            Task.Run(async () =>
            {
                await Task.Delay(500);
                notificationModel.IsBeingAdded = false;
                OnNotificationAdded?.Invoke();

                if (!notificationModel.Sticky)
                {
                    _ = Task.Run(async () =>
                    {
                        await Task.Delay(2000);
                        RemoveNotification(notificationModel);
                    });
                }
            });







            //OnNotificationAdded?.Invoke();

            //if (!notificationModel.Sticky)
            //{
            //    Task.Run(async () =>
            //    {
            //        await Task.Delay(2000);
            //        RemoveNotification(notificationModel);
            //    });
            //}
        }

        /// <summary>
        /// Removes the given notification from the list.
        /// </summary>
        public void RemoveNotification(NotificationModel notification)
        {
            Console.WriteLine("Removing notification");
            notification.IsMarkedForRemoval = true;
            OnNotificationIsBeingRemoved?.Invoke();

            Task.Run(async () =>
            {
                await Task.Delay(500);
                notification.IsMarkedForRemoval = false;
                if (Notifications.Remove(notification))
                {
                    OnNotificationRemoved?.Invoke();
                    Console.WriteLine("REMOVED notification");
                }
            });
        }
    }
}
