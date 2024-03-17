namespace passgen.Models
{
    public class PasswordOptions
    {
        public int PassLength { get; set; }
        public int MinPassLength { get; set; }
        public int MaxPassLength { get; set; }
        public bool UseUpperChars { get; set; }
        public bool UseLowerChars { get; set; }
        public bool UseNumberChars { get; set; }
        public bool UseSymbolChars { get; set; }
    }
}
