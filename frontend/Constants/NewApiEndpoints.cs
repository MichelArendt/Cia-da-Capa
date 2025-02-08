using System.Reflection.Metadata.Ecma335;

namespace frontend.Constants
{
    public static class NewApiEndpoints
    {
        // Entry point for Public endpoints
        public static class Public
        {
            public static class User
            {
                public const string Login = "/api/public/user/login";
            }

            // Fluent API for Product endpoints (Public)
            public static ProductEndpoints Product { get; } = new ProductEndpoints();

            public static class ProductCategory
            {
                public const string GetAll = "/api/public/products/categories";
            }

            //public static class ProductImage
            //{
            //    public const string GetAll = "/api/public/products/categories";
            //}

            public static class ProductSizeLabel
            {
                public const string GetAll = "/api/public/products/size-labels";
            }
        }

        // Entry point for Manage endpoints
        public static class Manage
        {
            public static class User
            {
                public const string Logout = "/api/manage/user/logout";
                public const string Validate = "/api/manage/user/validate";
            }

            public static ProductManageEndpoints Product { get; } = new ProductManageEndpoints();

            //public static class ProductCategory
            //{
            //    public const string Create = "/api/manage/products/categories";
            //    public const string Delete = "/api/manage/products/categories";
            //}

            //public static class ProductSizeLabel
            //{
            //    public const string Create = "/api/manage/products/size-labels";
            //    public const string Delete = "/api/manage/products/size-labels";
            //}
        }
    }

    #region Public Endpoints Fluent Classes

    /// <summary>
    /// Fluent endpoints for Public Products
    /// </summary>
    public class ProductEndpoints
    {
        /// <summary>
        /// Gets the URL for all products.
        /// </summary>
        public string GetAll => "/api/public/products";

        /// <summary>
        /// Returns an endpoint object for a specific product.
        /// </summary>
        public ProductEndpoint ForId(int productId)
        {
            return new ProductEndpoint(productId);
        }
    }

    public class ProductEndpoint
    {
        private readonly int _productId;

        public ProductEndpoint(int productId)
        {
            _productId = productId;
        }

        /// <summary>
        /// Gets the URL for the specific product.
        /// </summary>
        public string GetUrl => $"/api/public/products/{_productId}";

        /// <summary>
        /// Fluent endpoint access for the product's sizes.
        /// </summary>
        /// 
        public string Sizes => $"/api/public/products/{_productId}/sizes";
        //public ProductSizesEndpoints Sizes => new ProductSizesEndpoints(_productId);

        /// <summary>
        /// Fluent endpoint access for the product's images.
        /// </summary>
        public ProductImageEndpoints Images => new ProductImageEndpoints(_productId);

        /// <summary>
        /// Fluent endpoint access for the product's variants.
        /// </summary>
        public ProductVariantEndpoints Variants => new ProductVariantEndpoints(_productId);
    }

    public class ProductImageEndpoints
    {
        private readonly int _productId;

        public ProductImageEndpoints(int productId)
        {
            _productId = productId;
        }

        /// <summary>
        /// Gets the URL for all images of the product.
        /// </summary>
        public string GetAll => $"/api/public/products/{_productId}/images";
    }

    public class ProductVariantEndpoints
    {
        private readonly int _productId;

        public ProductVariantEndpoints(int productId)
        {
            _productId = productId;
        }

        /// <summary>
        /// Gets the URL for all variants of the product.
        /// </summary>
        public string GetAll => $"/api/public/products/{_productId}/variants";

        /// <summary>
        /// Returns the URL for a specific variant.
        /// </summary>
        public string ForId(int variantId) => $"/api/public/products/{_productId}/variants/{variantId}";

        /// <summary>
        /// Fluent endpoint access for images of a specific variant.
        /// </summary>
        public ProductVariantImageEndpoints Images => new ProductVariantImageEndpoints(_productId);
    }

    public class ProductVariantImageEndpoints
    {
        private readonly int _productId;

        public ProductVariantImageEndpoints(int productId)
        {
            _productId = productId;
        }

        /// <summary>
        /// Returns the URL for images of a specific variant.
        /// </summary>
        public string ForVariantId(int variantId) =>
            $"/api/public/products/{_productId}/variants/{variantId}/images";
    }
    public class ProductSizesEndpoints
    {
        private readonly int _productId;

        public ProductSizesEndpoints(int productId)
        {
            _productId = productId;
        }

        public string Sizes => $"/api/public/products/{_productId}/sizes";
    }

    #endregion

    #region Manage Endpoints Fluent Classes

    /// <summary>
    /// Fluent endpoints for Manage Products
    /// </summary>
    public class ProductManageEndpoints
    {
        /// <summary>
        /// Gets the URL to create a new product.
        /// </summary>
        public string Create => "/api/manage/products";

        /// <summary>
        /// Fluent endpoint access for a specific product (by ID) for management purposes.
        /// </summary>
        public ProductManage ForId(int productId)
        {
            return new ProductManage(productId);
        }
        public ProductImage Image { get; } = new ProductImage();
    }

    public class ProductManage
    {
        private readonly int _productId;

        public ProductManage(int productId)
        {
            _productId = productId;
        }

        /// <summary>
        /// Gets the URL for the specific product in management.
        /// </summary>
        public string GetUrl => $"/api/manage/products/{_productId}";

        /// <summary>
        /// Fluent endpoint access for the product's images management.
        /// </summary>
        public ProductManageImage Images => new ProductManageImage(_productId);
    }

    public class ProductManageImage
    {
        private readonly int _productId;

        public ProductManageImage(int productId)
        {
            _productId = productId;
        }

        /// <summary>
        /// Gets the URL for uploading images to the product.
        /// </summary>
        public string Upload =>
            $"/api/manage/products/{_productId}/images/upload";

        /// <summary>
        /// Gets the URL for deleting an image.
        /// </summary>
        public string DeleteImage => "/api/manage/products/images/";
    }

    public class ProductImage
    {
        public string Delete(int imageId)
        {
           return $"/api/manage/products/images/{imageId}";
        }
        public string UpdateOrdering => "/api/manage/products/images/update-ordering";
    }

    #endregion
}
