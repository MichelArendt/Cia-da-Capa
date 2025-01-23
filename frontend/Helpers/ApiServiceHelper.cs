using System.Text.Json;

namespace frontend.Helpers
{
    public class ApiServiceHelper
    {
        /// <summary>
        /// Generic method to deserialize an API response into a given type.
        /// </summary>
        public static async Task<T> DeserializeResponse<T>(HttpResponseMessage response) where T : new()
        {
            if (!response.IsSuccessStatusCode)
                return new T(); // ✅ Return a new instance instead of null

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new T();
        }

    }
}
