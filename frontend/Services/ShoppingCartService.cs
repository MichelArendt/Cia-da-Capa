using frontend.DTOs;
using frontend.Models.Shopping_Cart;

namespace frontend.Services
{
    public class ShoppingCartService
    {
        public Dictionary<int, CartItem> Products { get; private set; } = [];

        public event Action? CartChanged;

        public bool AddProductToCart(ProductDto productDto, int sizeId, int variantId)
        {
            if (productDto.Id > 0)
            {
                Products[productDto.Id] = new CartItem
                {
                    Product = productDto,
                    SizeId = sizeId,
                    VariantId = variantId,
                };

                CartChanged?.Invoke();

                return true;
            }

            return false;
        }

        public void RemoveProductFromCart(int productId)
        {
            if (Products.ContainsKey(productId))
            {
                Products.Remove(productId);
                CartChanged?.Invoke();
            }
        }

        public bool HasProductInCart(int productId)
        {
            return Products.ContainsKey(productId);
        }
    }
}
