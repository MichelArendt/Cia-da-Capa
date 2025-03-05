namespace frontend.Constants
{
    public static class ApiRoutes
    {
        private const string API = "/api";

        // Public
        public static class Public
        {
            public static class User
            {
                public const string Login = $"{API}/public/user/login";
            }

            public static class Products
            {
                public const string GetAll = $"{API}/public/products";
                public static string GetById(int id) => $"{API}/public/products/{id}";
                public static string GetByIdFull(int id) => $"{API}/public/products/{id}/full";

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
        }

        // Manage
        public static class Manage
        {
            public static class User
            {
                public const string Logout = $"{API}/manage/user/logout";
                public const string Validate = $"{API}/manage/user/validate";
            }

            public static class Products
            {
                public const string Create = $"{API}/manage/products";
                public static string Update(int id) => $"{API}/manage/products/{id}";
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
        }
    }
}
