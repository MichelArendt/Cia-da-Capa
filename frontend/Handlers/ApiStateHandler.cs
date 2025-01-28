namespace frontend.Handlers
{
    public class ApiStateHandler<T>
    {
        public FetchState State { get; private set; } = FetchState.Fetching;
        public List<T> Items { get; private set; } = [];
        public event Action? StateChanged;

        //public bool HasError { get; private set; } = false;
        private readonly Func<Task<List<T>?>> _fetchFunction;

        public ApiStateHandler(Func<Task<List<T>?>> fetchFunction)
        {
            _fetchFunction = fetchFunction;
        }

        public async Task FetchItems()
        {
            State = FetchState.Fetching;
            StateChanged?.Invoke();

            try
            {
                var items = await _fetchFunction.Invoke();
                if (items == null)
                {
                    State = FetchState.Failed;
                    //HasError = true;
                }
                else
                {
                    Items = items;
                    State = FetchState.Success;
                }
            }
            catch
            {
                State = FetchState.Failed;
                //HasError = true;
            }

            StateChanged?.Invoke();
        }
    }
}
