using frontend.Services;
using Microsoft.AspNetCore.Components;

namespace frontend.Components.Shared.UI.SmartComponent
{
    public abstract class SmartComponentBase : ComponentBase, IDisposable
    {
        protected bool IsOpen { get; private set; } = false;

        [Inject]
        protected AppStateService AppState { get; set; } = default!;

        protected override void OnInitialized()
        {
            base.OnInitialized();

            AppState.NavigationChanged += Close;
            AppState.IsMobileChanged += Close;
        }

        public virtual void Dispose()
        {
            AppState.NavigationChanged -= Close;
            AppState.IsMobileChanged -= Close;
        }

        public void Open()
        {
            IsOpen = true;
            StateHasChanged();
        }

        public void Close()
        {
            IsOpen = false;
            StateHasChanged();
        }

        //public async Task CloseAsync()
        //{
        //    Close();
        //    await Task.Yield();
        //}

        public void Toggle()
        {
            IsOpen = !IsOpen;
            StateHasChanged();
        }

        public void ToggleOnlyOnMobile()
        {
            if (AppState.IsMobile == true)
            {
                IsOpen = !IsOpen;
                StateHasChanged();
            }
        }
    }
}
