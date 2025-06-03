using frontend.DTOs;
using frontend.Models.Shopping_Cart;

namespace frontend.Services
{
    public class ShoppingCartService
    {
        public Dictionary<int, CartItem> Products { get; private set; } = [];

        public event Action? CartChanged;

        public void AddProductToCart(ProductDto productDto)
        {
            if (productDto.Id > 0)
            {
                Products[productDto.Id] = new CartItem
                {
                    Product = productDto
                };

                CartChanged?.Invoke();
            }
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
