using frontend.Constants;
using frontend.Helpers;
using frontend.Models.Forms;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    public class ContactService
    {
        private readonly HttpClient _httpClient;

        public ContactService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public Func<Task<HttpResponseMessage>> SubmitContactFunc(ContactFormModel model)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Public.Contact.Submit,
                model,
                JsonHelper._options
            );
        }
    }
}
