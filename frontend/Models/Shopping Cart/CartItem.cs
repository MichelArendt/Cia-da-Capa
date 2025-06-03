using frontend.DTOs;

namespace frontend.Models.Shopping_Cart
{
    public class CartItem
    {
        public ProductDto Product { get; set; } = default!;

        private int _quantity = 100;
        public int Quantity
        {
            get => _quantity;
            set
            {
                _quantity = value < 100 ? 100 : value; // Ensure quantity is at least 100
            }
        }

        public int SizeId { get; set; } = 0;
        public int VariantId { get; set; } = 0;
    }
}
