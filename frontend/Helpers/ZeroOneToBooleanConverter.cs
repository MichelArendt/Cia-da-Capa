using System.Text.Json;
using System.Text.Json.Serialization;

namespace frontend.Helpers
{
    public class ZeroOneToBooleanConverter : JsonConverter<bool>
    {
        public override bool Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            // We handle numeric, string, or literal
            if (reader.TokenType == JsonTokenType.Number)
            {
                // e.g. 0 => false, 1 => true
                int number = reader.GetInt32();
                return number != 0;
            }
            else if (reader.TokenType == JsonTokenType.String)
            {
                // e.g. "0", "1", "true", "false"
                string? str = reader.GetString();
                if (str == "0") return false;
                if (str == "1") return true;
                // possibly also handle "true"/"false" or do an actual parse
                return bool.TryParse(str, out bool boolVal) && boolVal;
            }
            else if (reader.TokenType == JsonTokenType.True)
            {
                // e.g. literal true
                return true;
            }
            else if (reader.TokenType == JsonTokenType.False)
            {
                // e.g. literal false
                return false;
            }

            // If something else, fallback or throw
            throw new JsonException($"Unexpected token {reader.TokenType} when parsing bool.");
        }

        public override void Write(Utf8JsonWriter writer, bool value, JsonSerializerOptions options)
        {
            // Decide how you want to write booleans:
            // - numeric 0/1:
            writer.WriteNumberValue(value ? 1 : 0);

            // OR actual JSON true/false:
            //writer.WriteBooleanValue(value);
        }
    }
}
