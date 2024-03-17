namespace passgen.Models
{
    public class PassphraseOptions
    {
        public int NumberOfWords { get; set; }
        public int MinNumberOfWords { get; set; }
        public int MaxNumberOfWords { get; set; }
        public string? DictionaryType { get; set; }
        public string? SeparatorChar { get; set; }
        public bool Capitalize { get; set; }
        public bool AddNumber { get; set; }
    }
}
