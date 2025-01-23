namespace frontend.DTOs
{
    public record UserDto
    {
        public int Id { get; init; }
        public string Username { get; init; } = default!;
        public string? SessionToken { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime UpdatedAt { get; init; }
    }

    // For login requests:
    public record UserLoginRequest
    {
        public string Username { get; init; } = default!;
        public string Password { get; init; } = default!;
    }
}
