using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using LogoSpark.Models;
using System.Security.Claims;

namespace LogoSpark.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<SavingController> _logger;

        public SavingController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context,
            ILogger<SavingController> logger)
        {
            _userManager = userManager;
            _context = context;
            _logger = logger;
        }

        [HttpPost("save-image")]
        public async Task<IActionResult> SaveImage([FromBody] SaveImageModel model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var image = new Image 
            { 
                Name = model.Name,
                ImagePath = model.ImagePath,
                UserId = userId
            };
            
            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            return Ok(new { image.Id, image.Name, image.ImagePath });
        }

        [HttpGet("saved-images")]
        public async Task<IActionResult> GetSavedImages()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var images = await _context.Images
                .Where(i => i.UserId == userId)
                .Select(i => new 
                {
                    i.Id,
                    i.Name,
                    i.ImagePath
                })
                .ToListAsync();

            return Ok(images);
        }
    }
}