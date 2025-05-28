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


        /// <summary>
        /// Converts paragraphs (separated by newlines) to <p> tags for safe HTML rendering.
        /// Blank lines are ignored.
        /// </summary>
        /// <param name="text">Text that may contain paragraphs delimited by newlines.</param>
        public static MarkupString ConvertNewlinesToParagraphs(string? text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return new MarkupString(string.Empty);

            // Normalize line endings (in case there are \r\n)
            var paragraphs = text.Replace("\r\n", "\n").Split('\n')
                .Select(p => p.Trim())
                .Where(p => !string.IsNullOrEmpty(p)) // Ignore empty lines
                .ToList();

            var html = string.Join("", paragraphs.Select(p => $"<p>{System.Net.WebUtility.HtmlEncode(p)}</p>"));

            return new MarkupString(html);
        }
    }
}
