using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
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

        public Func<Task<HttpResponseMessage>> LoginFunc(UserLoginRequestDto userLoginRequestDto)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Public.User.Login,
                userLoginRequestDto,
                JsonHelper._options);
        }

        public Func<Task<HttpResponseMessage>> ValidateSessionFunc()
        {
            return () => _httpClient.PostAsync(ApiRoutes.Public.User.Login, null);
        }

        public Func<Task<HttpResponseMessage>> LogoutFunc()
        {
            return () => _httpClient.PostAsync(ApiRoutes.Manage.User.Logout, null);
        }
    }
}