using Microsoft.AspNetCore.Components;

namespace frontend.Components.Shared.UI.SmartComponent
{
    public abstract class SmartComponentBase : ComponentBase
    {
        protected bool IsOpen { get; private set; }

        public void Open() => IsOpen = false;

        public void Close() => IsOpen = false;

        public void Toggle() => IsOpen = !IsOpen;
    }
}
