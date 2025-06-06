using frontend.DTOs;
using frontend.Models.ShoppingCart;

namespace frontend.Services
{
    public class ShoppingCartService
    {
        public List<CartItem> Products { get; private set; } = [];

        public event Action? CartChanged;

        public bool AddProductToCart(ProductDto productDto, ProductSizeDto? selectedSize = null, ProductVariantDto? selectedVariant = null)
        {
            if (productDto.Id <= 0) return false;

            // Prevent duplicates with same configuration
            if (Products.Any(item =>
                item.Product.Id == productDto.Id &&
                (item.Size?.Id ?? 0) == (selectedSize?.Id ?? 0) &&
                (item.Variant?.Id ?? 0) == (selectedVariant?.Id ?? 0)))
            {
                return false;
            }

            Products.Add(new CartItem
            {
                Product = productDto,
                Size = selectedSize,
                Variant = selectedVariant,
            });

            CartChanged?.Invoke();
            return true;
        }

        public void RemoveProductFromCart(ProductDto productDto, ProductSizeDto? selectedSize = null, ProductVariantDto? selectedVariant = null)
        {
            var item = Products.FirstOrDefault(ci =>
                ci.Product.Id == productDto.Id &&
                (ci.Size?.Id ?? 0) == (selectedSize?.Id ?? 0) &&
                (ci.Variant?.Id ?? 0) == (selectedVariant?.Id ?? 0)
            );

            if (item != null)
            {
                Products.Remove(item);
                CartChanged?.Invoke();
            }
        }

        public void RemoveProductFromCart(CartItem cartItem)
        {
            if (Products.Remove(cartItem))
            {
                CartChanged?.Invoke();
            }
        }


        //public bool HasProductInCart(int productId)
        //{
        //    return Products.ContainsKey(productId);
        //}

        public bool HasProductInCartWithSameConfiguration(ProductDto product, ProductSizeDto? selectedSize, ProductVariantDto? selectedVariant)
        {
            return Products.Any(ci =>
                ci.Product.Id == product.Id &&
                (ci.Size?.Id ?? 0) == (selectedSize?.Id ?? 0) &&
                (ci.Variant?.Id ?? 0) == (selectedVariant?.Id ?? 0)
            );
        }

    }
}
