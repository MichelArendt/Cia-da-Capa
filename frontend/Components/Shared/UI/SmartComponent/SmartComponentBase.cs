using frontend.Services;
using Microsoft.AspNetCore.Components;

namespace frontend.Components.Shared.UI.SmartComponent
{
    public abstract class SmartComponentBase : ComponentBase, IDisposable
    {
        protected bool IsOpen { get; private set; } = false;
        public event Action? IsOpenChanged;

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
            IsOpenChanged?.Invoke();
            StateHasChanged();
        }

        public void Close()
        {
            IsOpen = false;
            IsOpenChanged?.Invoke();
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
            IsOpenChanged?.Invoke();
            StateHasChanged();
        }

        public void ToggleOnlyOnMobile()
        {
            if (AppState.IsMobile == true)
            {
                Toggle();
            }
        }
    }
}
