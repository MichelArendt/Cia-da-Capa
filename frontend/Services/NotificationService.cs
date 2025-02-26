using frontend.Handlers;
using frontend.Helpers;
using frontend.Models;
using Microsoft.AspNetCore.Components;

namespace frontend.Services
{
    /// <summary>
    /// Service to manage and display notifications.
    /// </summary>
    public class NotificationService
    {
        private readonly ILogger<NotificationService> _logger;

        /// <summary>
        /// List of current notifications.
        /// </summary>
        public List<NotificationModel> Notifications { get; private set; } = [];

        /// <summary>
        /// Action triggered when a notification is added.
        /// </summary>
        public Action? OnNotificationAdded { get; set; }

        /// <summary>
        /// Event triggered when a notification is removed.
        /// </summary>
        public event Action? OnNotificationRemoved;

        /// <summary>
        /// Event triggered when a notification is being added.
        /// </summary>
        public event Action? OnNotificationIsBeingAdded;

        /// <summary>
        /// Event triggered when a notification is being removed.
        /// </summary>
        public event Action? OnNotificationIsBeingRemoved;

        /// <summary>
        /// Initializes a new instance of the <see cref="NotificationService"/> class.
        /// </summary>
        /// <param name="logger">The logger instance.</param>
        public NotificationService(ILogger<NotificationService> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Displays a notification with the specified content and type.
        /// </summary>
        /// <param name="content">The content to display.</param>
        /// <param name="type">The type of the notification.</param>
        /// <param name="sticky">Indicates if the notification is sticky.</param>
        /// <param name="errorMessage">The error message, if any.</param>
        /// <returns>The displayed notification model.</returns>
        public NotificationModel Display(RenderFragment content, NotificationType type = NotificationType.Success, bool sticky = false, string? errorMessage = null)
        {
            var notification = new NotificationModel
            {
                Content = content,
                Type = type,
                Sticky = sticky,
                ErrorMessage = errorMessage
            };
            notification.Validate();

            Display(notification);

            return notification;
        }

        /// <summary>
        /// Displays the specified notification model.
        /// </summary>
        /// <param name="notificationModel">The notification model to display.</param>
        public void Display(NotificationModel notificationModel)
        {
            Notifications.Add(notificationModel);
            OnNotificationIsBeingAdded?.Invoke();

            if (notificationModel.Type == NotificationType.ServerError)
            {
                notificationModel.Validate();
                _logger.LogError($"[SERVER ERROR]: {notificationModel.ErrorMessage}");
            }

            Task.Run(async () =>
            {
                await Task.Delay(500);
                notificationModel.IsBeingAdded = false;
                OnNotificationAdded?.Invoke();

                if (!notificationModel.Sticky)
                {
                    _ = Task.Run(async () =>
                    {
                        await Task.Delay(5000);
                        RemoveNotification(notificationModel);
                    });
                }
            });
        }

        /// <summary>
        /// Displays a success notification with the specified message.
        /// </summary>
        /// <param name="message">The message to display.</param>
        /// <param name="serverResponse">The server response, if any.</param>
        public void DisplaySuccess(string? message, string? serverResponse = null)
        {
            Display(
                new NotificationModel
                {
                    Content = RenderFragmentHelper.FromHtml($"<span>{serverResponse ?? message ?? "Operação realizada com sucesso"}</span>"),
                    Type = NotificationType.Success,
                }
            );
        }

        /// <summary>
        /// Displays an error notification with the specified message and status code.
        /// </summary>
        /// <param name="message">The error message to display.</param>
        /// <param name="errorMessage">The detailed error message.</param>
        /// <param name="statusCode">The status code of the error.</param>
        /// <returns>The displayed notification model.</returns>
        public NotificationModel DisplayError(string message = "Erro no servidor", string errorMessage = "Erro no servidor", int statusCode = 500)
        {
            var notification = new NotificationModel
            {
                Content = RenderFragmentHelper.FromHtml($"<span>Erro {statusCode} no servidor! {message}</span>"),
                Type = NotificationType.ServerError,
                Sticky = false,
                ErrorMessage = errorMessage
            };

            Display(notification);

            return notification;
        }

        /// <summary>
        /// Displays a validation error notification with the specified message and status code.
        /// </summary>
        /// <param name="message">The validation error message to display.</param>
        /// <param name="statusCode">The status code of the validation error.</param>
        /// <returns>The displayed notification model.</returns>
        public NotificationModel DisplayValidationError(string message = "Erro de validação dos campos.", int statusCode = 400)
        {
            var notification = new NotificationModel
            {
                Content = RenderFragmentHelper.FromHtml($"<span>{message}</span>"),
                Type = NotificationType.ValidationError,
                Sticky = false,
            };

            Display(notification);

            return notification;
        }

        /// <summary>
        /// Handles the state change of an API call.
        /// </summary>
        /// <typeparam name="T">The type of the API response content.</typeparam>
        /// <param name="apiState">The API state handler.</param>
        public void HandleApiStateChanged<T>(ApiStateHandler<T> apiState)
        {
            if (apiState.HasFailed)
            {
                DisplayError(apiState.ErrorMessage ?? "Erro desconhecido ao processar a solicitação.");
            }
        }

        /// <summary>
        /// Removes the specified notification.
        /// </summary>
        /// <param name="notification">The notification to remove.</param>
        public void RemoveNotification(NotificationModel notification)
        {
            notification.IsMarkedForRemoval = true;
            OnNotificationIsBeingRemoved?.Invoke();

            Task.Run(async () =>
            {
                await Task.Delay(500);
                notification.IsMarkedForRemoval = false;
                if (Notifications.Remove(notification))
                {
                    OnNotificationRemoved?.Invoke();
                }
            });
        }
    }
}
