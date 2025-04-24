// Models/ApplicationUser.cs
using Microsoft.AspNetCore.Identity;

namespace LogoSpark.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; } = string.Empty;
        public ICollection<Image> Images { get; set; } = new List<Image>();
        
    }
}