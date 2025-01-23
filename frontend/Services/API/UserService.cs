using frontend.Constants;
using frontend.DTOs;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    public class UserService
    {
        private readonly HttpClient _httpClient;

        public UserService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        /// <summary>
        /// Logs in by sending username/password to the server (HTTPS).
        /// If successful, the server sets an HTTP-only cookie in the response.
        /// </summary>
        public async Task<bool> LoginAsync(UserLoginRequest dto)
        {
            //var loginModel = new
            //{
            //    Username = username,
            //    Password = password
            //};

            // Over HTTPS, password is encrypted in transit, no extra encryption needed
            var response = await _httpClient.PostAsJsonAsync(ApiEndpoints.Public.User.Login, dto);

            // If success, the server's response includes "Set-Cookie: session_token=..."
            // The browser automatically stores it, no client-side code needed.
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Checks if the current user session is still valid by sending a request that includes the cookie.
        /// If the server returns 200, we consider the session valid.
        /// </summary>
        public async Task<bool> ValidateSessionAsync()
        {
            var response = await _httpClient.PostAsync(ApiEndpoints.Manage.User.Validate, null);
            return response.IsSuccessStatusCode;
        }

        /// <summary>
        /// Logs out by instructing the server to clear the session token and expire the cookie.
        /// </summary>
        public async Task<bool> LogoutAsync()
        {
            var response = await _httpClient.PostAsync(ApiEndpoints.Manage.User.Logout, null);
            return response.IsSuccessStatusCode;
        }
    }
}