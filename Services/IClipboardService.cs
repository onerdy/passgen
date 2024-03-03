namespace passgen.Services
{
    public interface IClipboardService
    {
        Task CopyToClipboard(string text);
    }
}
