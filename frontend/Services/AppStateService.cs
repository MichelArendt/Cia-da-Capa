using frontend.DTOs;
using frontend.Services.API;
using System.Net.NetworkInformation;

namespace frontend.Services
{
    public class AppStateService
    {
        //protected readonly IServiceProvider _serviceProvider;
        public ProductStateService Product { get; }

        public AppStateService(ProductStateService productStateService)
        {
            Product = productStateService;
        }

        public string? AttemptedPath { get; set; } // Store the attempted route

        public int BreakpointDesktop { get; } = 800;

        private int _browserWidth;
        public int BrowserWidth
        {
            get => _browserWidth;
            set
            {
                _browserWidth = value;
                WindowResized?.Invoke();
                //Console.WriteLine("new width: " + value);
            }
        }

        // Website mobile width detection to trigger layout changes
        private bool _isMobile;
        public bool IsMobile
        {
            get
            {
                return _isMobile;
            }
            set
            {
                if (_isMobile == value) return; // Only trigger event if the value changes
                _isMobile = value;
                IsMobileChanged?.Invoke();
            }
        }

        private bool _isAuthenticated;
        public bool IsAuthenticated
        {
            get
            {
                return _isAuthenticated;
            }
            set
            {
                if (_isAuthenticated == value) return; // Only trigger event if the value changes
                _isAuthenticated = value;
                IsAuthenticatedChanged?.Invoke();
            }
        }

        private bool _isCheckingAuth;
        public bool IsCheckingAuth
        {
            get
            {
                return _isCheckingAuth;
            }
            set
            {
                if (_isCheckingAuth == value) return; // Only trigger event if the value changes
                _isCheckingAuth = value;
                IsCheckingAuthChanged?.Invoke();
            }
        }

        //public bool IsCheckingAuth { get; set; } = true;

        public event Action? IsMobileChanged;
        public event Func<Task>? WindowResized;
        public event Action? IsAuthenticatedChanged;
        public event Action? IsCheckingAuthChanged;

        public bool IsManageRoute { get; set; } = false;

        //public bool IsFetchingProductCategories { get; set; } = true;
    }
}
