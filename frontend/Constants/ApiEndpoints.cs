namespace frontend.Constants
{
    public static class ApiEndpoints
    {
        public static class Public
        {
            public static class User
            {
                public const string Login = "/api/public/user/login";
            }

            public static class Product
            {
                public const string GetAll = "/api/public/products";
            }

            public static class ProductCategory
            {
                public const string GetAll = "/api/public/products/categories";
            }
        }
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
            }

            public static class ProductCategory
            {
                public const string Create = "/api/manage/products/categories";
            }
        }
    }
}
