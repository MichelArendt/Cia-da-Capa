namespace frontend.Models.Http
{
    public class HttpResponseModel<T>
    {
        public int StatusCode { get; set; }
        public string? Message { get; set; }
        public string? ErrorMessage { get; set; }
        public T? Data { get; set; }

        public bool IsSuccessStatusCode()
        {
            return StatusCode >= 200 && StatusCode <= 299;
        }
    }
}
