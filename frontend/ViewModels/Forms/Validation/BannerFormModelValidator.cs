using FluentValidation;
using frontend.Models.Manage.Forms;

namespace frontend.ViewModels.Forms.Validation
{
    public class BannerFormModelValidator : AbstractValidator<BannerFormModel>
    {
        public BannerFormModelValidator(List<ProductLookupViewModel> validProducts, bool isEditMode)
        {
            RuleFor(x => x.Title)
                .MinimumLength(5).WithMessage("O título deve ter pelo menos 5 caracteres.")
                .NotEmpty().WithMessage("O título é obrigatório.");

            RuleFor(x => x.Priority)
                .NotNull().WithMessage("Campo obrigatório.")
                .GreaterThanOrEqualTo(0).WithMessage("A prioridade deve ser zero ou maior.");

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("O produto é obrigatório.")
                .Must(id => id.HasValue && id.Value > 0 && validProducts.Any(p => p.Id == id.Value))
                .WithMessage("Selecione um produto válido.");

            // For all modes, require file if no previous image path
            RuleFor(x => x.FileMobile)
                .NotNull().WithMessage("Imagem Mobile é obrigatória.")
                .When(x => string.IsNullOrWhiteSpace(x.ImagePathMobile));

            RuleFor(x => x.FileTablet)
                .NotNull().WithMessage("Imagem Tablet é obrigatória.")
                .When(x => string.IsNullOrWhiteSpace(x.ImagePathTablet));

            RuleFor(x => x.FileDesktop)
                .NotNull().WithMessage("Imagem Desktop é obrigatória.")
                .When(x => string.IsNullOrWhiteSpace(x.ImagePathDesktop));
        }
    }
}
