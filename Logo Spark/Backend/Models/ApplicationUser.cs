// Models/ApplicationUser.cs
using Microsoft.AspNetCore.Identity;

namespace LogoSpark.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; } = string.Empty;
    }
}