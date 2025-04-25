using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LogoSpark.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace LogoSpark.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Ensure all endpoints require authentication
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
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null) return Unauthorized();

                if (string.IsNullOrWhiteSpace(model.Name))
                    return BadRequest("Logo name is required.");

                if (string.IsNullOrWhiteSpace(model.ImagePath) ||
                    !model.ImagePath.StartsWith("/images/"))
                    return BadRequest("Invalid image path format.");

                var image = new Image
                {
                    Name = model.Name.Trim(),
                    ImagePath = model.ImagePath.Trim(),
                    UserId = userId
                };

                _context.Images.Add(image);
                await _context.SaveChangesAsync();

                return Ok(new { image.Id, image.Name, image.ImagePath });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while saving image");
                return StatusCode(500, "Failed to save logo (database constraint).");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error saving image");
                return StatusCode(500, "Failed to save logo.");
            }
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

        [HttpDelete("remove-image/{id}")]
        public async Task<IActionResult> RemoveImage(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null) return Unauthorized();

                // Find the image
                var image = await _context.Images
                    .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

                // If image doesn't exist or doesn't belong to the user
                if (image == null)
                {
                    _logger.LogWarning($"User {userId} attempted to delete non-existent or unauthorized image {id}");
                    return NotFound("Image not found or you don't have permission to delete it.");
                }

                // Remove the image
                _context.Images.Remove(image);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"User {userId} successfully deleted image {id}");
                return Ok(new { message = "Image successfully removed" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error removing image with ID {id}");
                return StatusCode(500, "An error occurred while removing the image.");
            }
        }
    }
}