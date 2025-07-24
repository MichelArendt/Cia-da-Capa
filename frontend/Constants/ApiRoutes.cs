namespace frontend.Constants
{
    public static class ApiRoutes
    {
        private const string API = "/api";

        // Public
        public static class Public
        {
            public static class Banners
            {
                public const string GetAll = $"{API}/public/banners";
                public static string GetById(int id) => $"{API}/public/banners/{id}";
            }

            public static class Products
            {
                public const string GetAll = $"{API}/public/products";
                public const string GetAllShort = $"{API}/public/products/short";

                /// <summary>
                /// Builds a filtered products endpoint with query params.
                /// </summary>
                /// <param name="filters">e.g. new Dictionary&lt;string, object&gt; { ["category_id"]=5, ["exclude_id"]=23 }</param>
                public static string GetFiltered(IDictionary<string, object?> filters)
                {
                    var baseUrl = $"{API}/public/products";
                    if (filters == null || !filters.Any()) return baseUrl;

                    var query = string.Join("&", filters
                        .Where(kv => kv.Value != null)
                        .Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value?.ToString() ?? string.Empty)}"));
                    return $"{baseUrl}?{query}";
                }

                public const string GetAllHighlighted = $"{API}/public/products/highlighted";
                public static string GetById(int id) => $"{API}/public/products/{id}";
                public static string GetByIdFull(int id) => $"{API}/public/products/{id}/full";

                public static string GetRandomWithImages(int? limit = null, bool? highlighted = null)
                {
                    var baseUrl = $"{API}/public/products/random-with-images";
                    var queryParams = new List<string>();

                    if (limit != null)
                        queryParams.Add($"limit={limit}");

                    if (highlighted != null)
                        queryParams.Add($"highlighted={(highlighted.Value ? "1" : "0")}");

                    return queryParams.Any()
                        ? $"{baseUrl}?{string.Join("&", queryParams)}"
                        : baseUrl;
                }

                public static class Images
                {
                    public static string GetForProductId(int id) => $"{API}/public/products/{id}/images";
                }

                public static class Sizes
                {
                    public static string GetSizesForProductId(int id) => $"{API}/public/products/{id}/sizes";
                }

                public static class Variants
                {
                    public static string GetForProductId(int id) => $"{API}/public/products/{id}/variants";
                    public static class Images
                    {
                        public static string GetImagesForProductVariantId(int variantId) =>
                            $"{API}/public/products/variants/{variantId}/images";
                    }
                }
            }

            public static class Categories
            {
                public const string GetAll = $"{API}/public/products/categories";
            }

            public static class SizeLabels
            {
                public const string GetAll = $"{API}/public/products/size-labels";
            }
            public static class User
            {
                public const string Login = $"{API}/public/user/login";
            }

            public static class Utils
            {
                public const string GetClientLogos = $"{API}/public/utils/client-logos";
            }
        }

        // Manage
        public static class Manage
        {
            public static class Banners
            {
                public const string Create = $"{API}/manage/banners";
                public static string Update(int id) => $"/api/manage/banners/{id}";
                public static string UpdateImage(int id, string size) => $"{API}/manage/banners/{id}/image/{size}";
                public static string Delete(int id) => $"{API}/manage/banners/{id}";
                public const string UpdateOrdering = $"{API}/manage/banners/order";
            }

            public static class Products
            {
                public const string Create = $"{API}/manage/products";
                public static string Update(int id) => $"{API}/manage/products/{id}";
                public static string Delete(int id) => $"{API}/manage/products/{id}";
                public static class Images
                {
                    public static string UploadImageForProductId(int productId) => $"{API}/manage/products/{productId}/images";
                }

                public static class Variants
                {
                    public static string CreateForProductId(int productId) => $"{API}/manage/products/{productId}/variants";
                    public static class Images
                    {
                        public static string UploadImageForVariantId(int productId, int variantId) =>
                            $"{API}/manage/products/variants/{variantId}/images";
                    }
                }

                public static class Sizes
                {
                    public static string CreateForProductId(int productId) => $"{API}/manage/products/{productId}/sizes";
                    public static string Update(int sizeId) => $"{API}/manage/products/sizes/{sizeId}";
                    public static string Delete(int sizeId) => $"{API}/manage/products/sizes/{sizeId}";
                }
            }

            public static class ProductVariants
            {
                public static string Update(int variantId) => $"{API}/manage/products/variants/{variantId}";
                public static string Delete(int variantId) => $"{API}/manage/products/variants/{variantId}";
            }

            public static class ProductSizes
            {
                public static string Update(int sizeId) => $"{API}/manage/products/sizes/{sizeId}";
                public static string Delete(int sizeId) => $"{API}/manage/products/sizes/{sizeId}";
            }

            public static class ProductCategories
            {
                public const string Create = $"{API}/manage/products/categories";
                public static string Update(int id) => $"{API}/manage/products/categories/{id}";
                public static string Delete(int id) => $"{API}/manage/products/categories/{id}";
            }

            public static class ProductSizeLabels
            {
                public const string Create = $"{API}/manage/products/size-labels";
                public static string Update(int id) => $"{API}/manage/products/size-labels/{id}";
                public static string Delete(int id) => $"{API}/manage/products/size-labels/{id}";
                public const string UpdateOrdering = $"{API}/manage/products/size-labels/update-ordering";
            }

            public static class ProductImages
            {
                public static string Delete(int imageId) => $"{API}/manage/products/images/{imageId}";
                public const string UpdateOrdering = $"{API}/manage/products/images/update-ordering";
            }
            public static class User
            {
                public const string Logout = $"{API}/manage/user/logout";
                public const string Validate = $"{API}/manage/user/validate";
            }
        }
    }
}
