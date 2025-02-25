using frontend.Helpers;
using frontend.Models;
using frontend.Models.Http;
using Microsoft.AspNetCore.Components;
using System.Text.Json;

namespace frontend.Handlers
{
    public class ApiStateHandler<T>
    {
        public ExecuteState State { get; private set; } = ExecuteState.Executing;
        public T? Content { get; private set; }
        public string? ErrorMessage { get; private set; }

        // Additional info from the server response
        public int? ServerStatusCode { get; private set; }
        public string? ServerMessage { get; private set; }
        public string? ServerErrorMessage { get; private set; }

        // Handler statuses
        public bool HasFailed { get; private set; }

        public bool IsExecuting() => State == ExecuteState.Executing;
        public bool IsSuccess() => State == ExecuteState.Success;


        public event Action? StateHasChanged;
        public void InvokeStateHasChanged()
        {
            StateHasChanged?.Invoke();
        }

        private Func<Task<HttpResponseMessage>> _executeFunction;
        public ApiStateHandler()
        {
            _executeFunction = default!;
        }

        public ApiStateHandler(Func<Task<HttpResponseMessage>> fetchFunction)
        {
            _executeFunction = fetchFunction;
        }

        public async Task ExecuteAsync(Func<Task<HttpResponseMessage>> newFetchFunction)
        {
            _executeFunction = newFetchFunction;  // Dynamically update the function
            await ExecuteAsync();  // Call the existing method
        }


        public async Task ExecuteAsync()
        {
            State = ExecuteState.Executing;
            Content = default;
            HasFailed = false;
            ErrorMessage = null;
            ServerStatusCode = null;
            ServerMessage = null;
            ServerErrorMessage = null;
            StateHasChanged?.Invoke();

            try
            {
                // 1) Make the HTTP call
                var response = await _executeFunction();

                // 2) Parse as HttpResponseModel<T>, i.e. {statusCode, data = T, ...}
                var json = await response.Content.ReadAsStringAsync();
                HttpResponseModel<T>? serverResponse = null;

                try
                {
                    serverResponse = JsonHelper.Deserialize<HttpResponseModel<T>>(json);
                }
                catch (JsonException ex)
                {
                    // Deserialize error
                    State = ExecuteState.Failed;
                    HasFailed = true;
                    ErrorMessage = $"{ex.Message}{Environment.NewLine}JSON: {json}";
                    return;
                }

                if (serverResponse == null)
                {
                    // Could not parse the main structure
                    State = ExecuteState.Failed;
                    HasFailed = true;
                    ErrorMessage = "Invalid or empty server response";
                    return;
                }

                // Store additional server response information
                ServerStatusCode = serverResponse.StatusCode;
                ServerMessage = serverResponse.Message;
                ServerErrorMessage = serverResponse.ErrorMessage;

                // 3) If server gave an error status, treat as fail
                if (!serverResponse.IsSuccessStatusCode())
                {
                    State = ExecuteState.Failed;
                    HasFailed = true;
                    ErrorMessage = serverResponse.ErrorMessage
                        ?? $"Server returned {serverResponse.StatusCode}";
                    return;
                }

                // 4) If success, store serverResponse.Data in Content
                Content = serverResponse.Data;
                State = ExecuteState.Success;
            }
            catch (Exception ex)
            {
                State = ExecuteState.Failed;
                HasFailed = true;
                ErrorMessage = ex.Message;
            }
            finally
            {
                StateHasChanged?.Invoke();
            }
        }

        public NotificationModel GetErrorNotificationModel(string notificationMessage = "Desculpe, houve um erro no servidor! Tente novamente mais tarde.")
        {
            // Determine if it's a validation error or a server error
            var type = ServerStatusCode == 400 ? NotificationType.ValidationError : NotificationType.ServerError;

            return new NotificationModel
            {
                Type = type,
                ErrorMessage = ErrorMessage ?? ServerErrorMessage ?? notificationMessage,
                Content = RenderFragmentHelper.FromHtml($"<span>{ServerMessage ?? notificationMessage}</span>")
            };
        }

        public RenderFragment GetErrorFeedbackComponent(string? msg)
        {
            if (!HasFailed)
                return RenderFragmentHelper.FromHtml(""); // Return empty content if there's no error

            var type = ServerStatusCode == 400 ? "warning" : "error";
            var message = msg ?? ServerMessage ?? ErrorMessage ?? ServerErrorMessage ?? "Desculpe, houve um erro no servidor! Tente novamente mais tarde.";

            return RenderFragmentHelper.FromHtml($"<div class=\"feedback feedback--{type}\">{message}</div>");
        }

        public string GetErrorString(string notificationMessage = "Desculpe, houve um erro no servidor! Tente novamente mais tarde.")
        {
            return ServerMessage ?? ErrorMessage ?? ServerErrorMessage ?? notificationMessage;
        }

        public async Task DebugPostContentAsync()
        {
            try
            {
                var response = await _executeFunction(); // Execute the request and get response

                if (response.RequestMessage is HttpRequestMessage httpRequest)
                {
                    Console.WriteLine("[DEBUG] Detected HttpRequestMessage.");

                    if (httpRequest.Method == HttpMethod.Post || httpRequest.Method == HttpMethod.Put)
                    {
                        Console.WriteLine($"[DEBUG] Detected {httpRequest.Method} request.");

                        if (httpRequest.Content != null)
                        {
                            string postContent = await httpRequest.Content.ReadAsStringAsync();
                            Console.WriteLine($"[DEBUG POST/PUT CONTENT]: {postContent}");
                        }
                        else
                        {
                            Console.WriteLine("[DEBUG] No Content in POST/PUT request.");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"[DEBUG] This is not a POST or PUT request. Method: {httpRequest.Method}");
                    }
                }
                else
                {
                    Console.WriteLine("[DEBUG] RequestMessage is null or not available.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DEBUG ERROR] Failed to retrieve request content: {ex.Message}");
            }
        }

    }
}