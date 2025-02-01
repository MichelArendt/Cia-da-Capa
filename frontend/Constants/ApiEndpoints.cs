namespace frontend.Constants
{
    public static class ApiEndpoints
    {
        /// <summary>
        /// /public Endpoints
        /// </summary>
        public static class Public
        {
            public static class User
            {
                public const string Login = "/api/public/user/login";
            }

            public static class Product
            {
                public const string GetAll = "/api/public/products";
                //public const string GetById = "/api/public/products/";

                public static string ById(int id)
                {
                    return $"/api/public/products/{id}";
                }

                public static class Images
                {
                    public static string GetImagesForProductWithId(int id)
                    {
                        return $"/api/public/products/{id}/images";
                    }
                }
            }

            public static class ProductCategory
            {
                public const string GetAll = "/api/public/products/categories";
            }

            public static class ProductImage
            {
                public const string GetAll = "/api/public/products/categories";
            }

            public static class ProductSizeLabel
            {
                public const string GetAll = "/api/public/products/size-labels";
            }
        }

        /// <summary>
        /// /manage Endpoints
        /// </summary>
        public static class Manage
        {
            public static class User
            {
                public const string Logout = "/api/manage/user/logout";
                public const string Validate = "/api/manage/user/validate";
            }

            public static class Product
            {
                public const string Create = "/api/manage/products";

                public static class Images
                {
                    public static string UploadToProductWithId(int id)
                    {
                        return $"/api/manage/products/{id}/images/upload";
                    }
                    public static string DeleteImage(int id)
                    {
                        return $"/api/manage/products/images/";
                    }
                }
            }

            public static class ProductCategory
            {
                public const string Create = "/api/manage/products/categories";
                public const string Delete = "/api/manage/products/categories";
            }

            public static class ProductSizeLabel
            {
                public const string Create = "/api/manage/products/size-labels";
                public const string Delete = "/api/manage/products/size-labels";
            }
        }
    }
}
