using frontend.Services;
using frontend.Services.API;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

namespace frontend
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            // Create the WebAssembly Host
            var builder = WebAssemblyHostBuilder.CreateDefault(args);

            // Add root Blazor components to the DOM
            builder.RootComponents.Add<App>("#app");          // Main app entry point
            builder.RootComponents.Add<HeadOutlet>("head::after"); // For modifying the <head> section

            // Configure HttpClient for API calls
            builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

            // API services
            builder.Services.AddScoped<BannerService>();
            builder.Services.AddScoped<ProductService>();
            builder.Services.AddScoped<ProductCategoryService>();
            builder.Services.AddScoped<ProductVariantService>();
            builder.Services.AddScoped<ProductImageService>();
            builder.Services.AddScoped<ProductSizeLabelService>();
            builder.Services.AddScoped<UserService>();

            builder.Services.AddSingleton<NotificationService>();
            builder.Services.AddSingleton<ProductStateService>();
            builder.Services.AddSingleton<AppStateService>();

            var app = builder.Build();

            await app.RunAsync();
        }
    }
}
