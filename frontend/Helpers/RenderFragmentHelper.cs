using Microsoft.AspNetCore.Components;

namespace frontend.Helpers
{
    public class RenderFragmentHelper
    {
        /// <summary>
        /// Creates a RenderFragment from an HTML string.
        /// </summary>
        /// <param name="html">The HTML string.</param>
        /// <returns>A RenderFragment that renders the HTML.</returns>
        public static RenderFragment FromHtml(string html) => builder =>
        {
            // Use AddMarkupContent to add raw HTML.
            builder.AddMarkupContent(0, html);
        };
    }
}
