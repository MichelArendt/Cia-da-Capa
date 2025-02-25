using frontend.Models.Http;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace frontend.Helpers
{
    /// <summary>
    /// A single "helper" file that:
    /// 1) Defines a naming policy to map snake_case -> PascalCase (e.g. "is_highlighted" -> "IsHighlighted").
    /// 2) Defines a custom date-time converter for "yyyy-MM-dd HH:mm:ss".
    /// 3) Has a single static JsonSerializerOptions with the above configuration.
    /// 4) Exposes "Serialize" and "Deserialize" methods for easy usage.
    /// 
    /// Usage:
    ///    var json = JsonHelper.Serialize(productDto);
    ///    var product = JsonHelper.Deserialize<ProductDto>(json);
    /// </summary>
    public static class JsonHelper
    {
        /// <summary>
        /// A custom DateTime converter for reading/writing "yyyy-MM-dd HH:mm:ss".
        /// If your server returns or expects an ISO8601 format, adjust accordingly.
        /// </summary>
        private class CustomDateTimeConverter : JsonConverter<DateTime>
        {
            private const string Format = "yyyy-MM-dd HH:mm:ss";

            public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            {
                var str = reader.GetString();
                if (DateTime.TryParseExact(str, Format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dt))
                {
                    return dt;
                }

                // If parse fails, fallback or throw
                return DateTime.MinValue;
            }

            public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
            {
                // Write it back out in "yyyy-MM-dd HH:mm:ss"
                writer.WriteStringValue(value.ToString(Format, CultureInfo.InvariantCulture));
            }
        }

        /// <summary>
        /// A single global JsonSerializerOptions instance that uses:
        /// 1) SnakeToPascalCaseNamingPolicy,
        /// 2) CustomDateTimeConverter,
        /// 3) Case-insensitivity.
        /// </summary>
        public static readonly JsonSerializerOptions _options = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        };

        // Static constructor: add any converters
        static JsonHelper()
        {
            _options.Converters.Add(new CustomDateTimeConverter());
            _options.Converters.Add(new ZeroOneToBooleanConverter());
        }

        /// <summary>
        /// Overload #1:
        /// Deserialize JSON into an object of type T using our shared _options.
        /// </summary>
        public static T? Deserialize<T>(string json)
        {
            return JsonSerializer.Deserialize<T>(json, _options);
        }

        /// <summary>
        /// Overload #2:
        /// Reads an HttpResponseMessage's content, converts it to a string,
        /// then calls our same internal logic. 
        /// Example usage:
        ///   HttpResponseMessage response = ...
        ///   var items = await JsonHelper.Deserialize<List<ProductImageDto>>(response);
        /// </summary>
        public static async Task<T?> Deserialize<T>(HttpResponseMessage response)
        {
            // Optionally, we could check:
            // if (!response.IsSuccessStatusCode) throw ...
            var json = await response.Content.ReadAsStringAsync();

            return Deserialize<T>(json);
        }

        /// <summary>
        /// Deserializes JSON and attaches the HTTP status code to the model.
        /// </summary>
        public static async Task<T> DeserializeAndAttachStatusCode<T>(HttpResponseMessage response) where T : new()
        {
            var deserializedObj = await Deserialize<T>(response) ?? new();
            if (deserializedObj is HttpResponseModel<T> httpResponse)
            {
                httpResponse.StatusCode = (int)response.StatusCode;
            }
            return deserializedObj;
        }

        /// <summary>
        /// Serialize an object of type T into JSON using our shared _options.
        /// </summary>
        public static string Serialize<T>(T value)
        {
            return JsonSerializer.Serialize(value, _options);
        }
    }
}
