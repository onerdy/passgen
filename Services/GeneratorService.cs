using Microsoft.Extensions.ObjectPool;
using passgen.Models;
using System;

namespace passgen.Services
{
    public class GeneratorService
    {
        static Random random = new Random();
        public static string GeneratePassword(PasswordOptions passwordOptions)
        {
            const string upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowerChars = "abcdefghijklmnopqrstuvwxyz";
            const string numberChars = "0123456789";
            const string symbolChars = "!@#$%^&*";

            string password = "";
            string charSet = "";            

            if (passwordOptions.UseUpperChars) charSet += upperChars;
            if (passwordOptions.UseLowerChars) charSet += lowerChars;
            if (passwordOptions.UseNumberChars) charSet += numberChars;
            if (passwordOptions.UseSymbolChars) charSet += symbolChars;

            if (charSet != "")
            {
                //Set random password
                password = new string(Enumerable.Repeat(charSet, passwordOptions.PassLength)
                .Select(s => s[random.Next(s.Length)]).ToArray());
            }

            return password;
        }

        public static string GeneratePassphrase(PassphraseOptions passphraseOptions)
        {
            string password = "";

            string[] standardWords = File.ReadAllLines("./wwwroot/Data/StandardWords.txt");
            string[] offensiveWords = File.ReadAllLines("./wwwroot/Data/OffensiveWords.txt");
            string[] seedWords = [];

            if (passphraseOptions.DictionaryType == "Standard")
            {
                seedWords = ShuffleAndExtract(standardWords);
            }
            else if (passphraseOptions.DictionaryType == "Offensive")
            {
                seedWords = ShuffleAndExtract(offensiveWords);
            }

            if (passphraseOptions.Capitalize)
            {
                seedWords = Capitalize(seedWords);
            }

            password = String.Join(passphraseOptions.SeparatorChar, seedWords);

            if (passphraseOptions.AddNumber)
            {
                password += random.Next(10);
            }

            return password;


            string[] ShuffleAndExtract(string[] arrayToShuffleAndExtract)
            {
                return arrayToShuffleAndExtract.OrderBy(_ => random.Next())
                            .Take(passphraseOptions.NumberOfWords).ToArray();
            }

            string[] Capitalize(string[] arrayToCapitalize)
            {
                return arrayToCapitalize.Select(word => word[0].ToString().ToUpper() + word.Substring(1)).ToArray();
            }
        }

    }
}