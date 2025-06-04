namespace frontend.DTOs
{
    public class BannerDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Priority { get; set; }

        public string File_Path_Mobile { get; set; } = string.Empty;
        public string File_Path_Tablet { get; set; } = string.Empty;
        public string File_Path_Desktop { get; set; } = string.Empty;
    }
}
