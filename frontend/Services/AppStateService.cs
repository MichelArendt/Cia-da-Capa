namespace frontend.Services
{
    /// <summary>
    /// Service to manage the application state.
    /// </summary>
    public class AppStateService
    {
        /// <summary>
        /// Stores the attempted route.
        /// </summary>
        public string? AttemptedPath { get; set; }

        /// <summary>
        /// Breakpoint for desktop layout.
        /// </summary>
        public int BreakpointDesktop { get; } = 800;

        private int _browserWidth;
        /// <summary>
        /// Gets or sets the browser width.
        /// </summary>
        public int BrowserWidth
        {
            get => _browserWidth;
            set
            {
                _browserWidth = value;
                WindowResized?.Invoke();
            }
        }

        private bool _isMobile;
        /// <summary>
        /// Gets or sets a value indicating whether the device is mobile.
        /// </summary>
        public bool IsMobile
        {
            get => _isMobile;
            set
            {
                if (_isMobile == value) return;
                _isMobile = value;
                IsMobileChanged?.Invoke();
            }
        }

        private bool _isAuthenticated = false;
        /// <summary>
        /// Gets or sets a value indicating whether the user is authenticated.
        /// </summary>
        public bool IsAuthenticated
        {
            get => _isAuthenticated;
            set
            {
                if (_isAuthenticated == value) return;
                _isAuthenticated = value;
                IsAuthenticatedChanged?.Invoke();
            }
        }

        private bool _isCheckingAuth;
        /// <summary>
        /// Gets or sets a value indicating whether the authentication status is being checked.
        /// </summary>
        public bool IsCheckingAuth
        {
            get => _isCheckingAuth;
            set
            {
                if (_isCheckingAuth == value) return;
                _isCheckingAuth = value;
                IsCheckingAuthChanged?.Invoke();
            }
        }

        /// <summary>
        /// Event triggered when the window is resized.
        /// </summary>
        public event Func<Task>? WindowResized;

        /// <summary>
        /// Event triggered when navigation changes.
        /// </summary>
        public event Action? NavigationChanged;

        /// <summary>
        /// Triggers the NavigationChanged event.
        /// </summary>
        public void TriggerNavigationChanged()
        {
            NavigationChanged?.Invoke();
        }

        /// <summary>
        /// Event triggered when the IsMobile property changes.
        /// </summary>
        public event Action? IsMobileChanged;

        /// <summary>
        /// Event triggered when the IsAuthenticated property changes.
        /// </summary>
        public event Action? IsAuthenticatedChanged;

        /// <summary>
        /// Event triggered when the IsCheckingAuth property changes.
        /// </summary>
        public event Action? IsCheckingAuthChanged;

        /// <summary>
        /// Gets or sets a value indicating whether the current route is a manage route.
        /// </summary>
        public bool IsManageRoute { get; set; } = false;
    }
}
