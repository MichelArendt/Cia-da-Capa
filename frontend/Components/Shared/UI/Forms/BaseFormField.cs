using Microsoft.AspNetCore.Components;

namespace frontend.Components.Shared.UI.Forms
{
    /// <summary>
    /// Abstract base class for all form fields. Provides shared props and CSS.
    /// </summary>
    public abstract class BaseFormField<T> : ComponentBase
    {
        [Parameter] public string? Label { get; set; }
        [Parameter] public bool IsRequired { get; set; }
        [Parameter] public string? Error { get; set; }
        [Parameter] public bool IsTouched { get; set; }
        [Parameter] public string? InputClass { get; set; }

        /// <summary>
        /// Called on blur (loses focus). Parent should update touched/validate.
        /// </summary>
        [Parameter] public EventCallback OnBlur { get; set; }

        /// <summary>
        /// Custom callback fired after value changes.
        /// </summary>
        [Parameter] public EventCallback<T> OnValueChanged { get; set; }

        /// <summary>
        /// Utility for input CSS (error, valid, required, etc).
        /// </summary>
        protected string GetInputCss()
        {
            var css = "form-control";
            if (!string.IsNullOrEmpty(InputClass)) css += " " + InputClass;
            if (IsRequired) css += " required";
            if (!string.IsNullOrEmpty(Error)) css += " is-invalid";
            else if (IsTouched) css += " valid";
            return css;
        }
    }
}
