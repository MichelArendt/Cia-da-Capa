using frontend.Handlers;
using frontend.Helpers;
using frontend.Models;
using Microsoft.AspNetCore.Components;

namespace frontend.Services
{
    public class NotificationService
    {
        private readonly ILogger<NotificationService> _logger;

        public List<NotificationModel> Notifications { get; private set; } = [];
        public Action? OnNotificationAdded { get; set; }
        public event Action? OnNotificationRemoved;
        public event Action? OnNotificationIsBeingAdded;
        public event Action? OnNotificationIsBeingRemoved;


        public NotificationService(ILogger<NotificationService> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Adds a notification to the list and returns a reference to it.
        /// </summary>
        /// <param name="content">The RenderFragment to display.</param>
        /// <param name="type">Notification type (default is Success).</param>
        /// <param name="sticky">If true, the notification is sticky and must be removed manually.</param>
        /// <returns>A reference to the created NotificationModel.</returns>
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

        //public async void DisplayError(HttpResponseMessage? response)
        //{
        //    if (response == null)
        //    {
        //        DisplayError();
        //    }
        //    else
        //    {
        //        string json = await response.Content.ReadAsStringAsync();

        //        if (!String.IsNullOrWhiteSpace(json))
        //        {
        //            try
        //            {
        //                HttpResponseErrorModel? error = JsonHelper.Deserialize<HttpResponseErrorModel>(json);

        //                if (error == null)
        //                {
        //                    throw new Exception($"Failed to deserialize ERROR: {json}");
        //                }

        //                DisplayError(error.Message, error.Message, error.StatusCode);
        //            }
        //            catch (Exception ex)
        //            {
        //                //Console.WriteLine($"Exception while processing error response: {ex.Message}");
        //                throw new Exception($"ServerError processing response: {json}", ex);
        //            }
        //        }
        //    }
        //}

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

        //public async void DisplayValidationError(HttpResponseMessage response)
        //{
        //    string json = await response.Content.ReadAsStringAsync();

        //    if (!String.IsNullOrWhiteSpace(json))
        //    {
        //        try
        //        {
        //            HttpResponseModel? responseModel = JsonHelper.Deserialize<HttpResponseModel>(json);

        //            if (responseModel == null)
        //            {
        //                throw new Exception($"Failed to deserialize ERROR: {json}");
        //            }

        //            DisplayValidationError(responseModel.Message, responseModel.StatusCode);
        //        }
        //        catch (Exception ex)
        //        {
        //            //Console.WriteLine($"Exception while processing error response: {ex.Message}");
        //            throw new Exception($"ServerError processing response: {json}", ex);
        //        }
        //    }
        //}


        public void HandleApiStateChanged<T>(ApiStateHandler<T> apiState)
        {
            if (apiState.HasFailed)
            {
                DisplayError(apiState.ErrorMessage ?? "Erro desconhecido ao processar a solicitação.");
            }
        }


        /// <summary>
        /// Removes the given notification from the list.
        /// </summary>
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
