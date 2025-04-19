//ApplicationDbContext.cs

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LogoSpark.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Add any additional DbSets for other entities here, like:
        // public DbSet<YourModel> YourModels { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Make email optional (not recommended unless you have a good reason)
            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(u => u.Email).IsRequired(false);
            });
        }
    }
}
