using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    /// <summary>
    /// Service to handle user-related API requests.
    /// </summary>
    public class UserService
    {
        private readonly HttpClient _httpClient;

        public UserService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        /// <summary>
        /// Creates a function that sends a login request to the API.
        /// </summary>
        /// <param name="userLoginRequestDto">The login request data transfer object.</param>
        /// <returns>A function that sends a login request to the API.</returns>
        public Func<Task<HttpResponseMessage>> LoginFunc(UserLoginRequestDto userLoginRequestDto)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Public.User.Login,
                userLoginRequestDto,
                JsonHelper._options);
        }

        /// <summary>
        /// Creates a function that sends a session validation request to the API.
        /// </summary>
        /// <returns>A function that sends a session validation request to the API.</returns>
        public Func<Task<HttpResponseMessage>> ValidateSessionFunc()
        {
            return () => _httpClient.PostAsync(ApiRoutes.Manage.User.Validate, null);
        }

        /// <summary>
        /// Creates a function that sends a logout request to the API.
        /// </summary>
        /// <returns>A function that sends a logout request to the API.</returns>
        public Func<Task<HttpResponseMessage>> LogoutFunc()
        {
            return () => _httpClient.PostAsync(ApiRoutes.Manage.User.Logout, null);
        }
    }
}