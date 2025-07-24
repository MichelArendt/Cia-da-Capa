namespace frontend.Components.Shared.UI.Forms
{
    /// <summary>
    /// Context object for SmartForm, shared with all child fields using CascadingParameter.
    /// Holds the model, error dictionary, touched fields, and a delegate for validation.
    /// </summary>
    public class SmartFormContext
    {
        /// <summary>
        /// The current form model. Should always be set by the SmartForm.
        /// </summary>
        public object Model { get; set; } = default!;

        /// <summary>
        /// Dictionary holding current validation error messages, keyed by property name.
        /// </summary>
        public Dictionary<string, string> FieldErrors { get; set; } = new();

        /// <summary>
        /// Set of property names the user has interacted with ("touched").
        /// </summary>
        public HashSet<string> TouchedFields { get; set; } = new();

        /// <summary>
        /// Delegate for triggering validation of a single field.
        /// Typically set by the SmartForm parent.
        /// </summary>
        public Func<string, Task>? ValidateFieldAsync { get; set; }
    }
}
