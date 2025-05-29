using System.Net.Http.Json;

namespace frontend.Services
{
    public class VersionService
    {
        public string CssVersion { get; private set; } = "1";

        public async Task LoadAsync(HttpClient http)
        {
            try
            {
                var data = await http.GetFromJsonAsync<VersionData>("version.json");
                CssVersion = data?.CssVersion ?? "1";
            }
            catch
            {
                CssVersion = "1";
            }
        }

        private class VersionData
        {
            public string CssVersion { get; set; } = "1";
        }
    }
}
