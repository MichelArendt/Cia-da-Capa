using Microsoft.AspNetCore.Components;

namespace frontend.Utils
{
    public static class HtmlFormatter
    {
        /// <summary>
        /// Converts newlines (\n) to <br /> for safe HTML rendering.
        /// </summary>
        /// <param name="text">Text that may contain newlines.</param>
        public static MarkupString ConvertNewlinesToBr(string? text)
        {
            return new MarkupString((text ?? string.Empty).Replace("\n", "<br />"));
        }
    }
}
