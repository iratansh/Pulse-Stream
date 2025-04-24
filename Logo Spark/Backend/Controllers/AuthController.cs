// Controllers/AuthController.cs
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LogoSpark.Models;

namespace LogoSpark.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            try
            {
                _logger.LogInformation($"Registration attempt for username: {model.Username}");

                // Validate the model
                if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.Name))
                {
                    _logger.LogWarning("Registration failed: Required fields missing");
                    return BadRequest(new { message = "Username, password, and name are required" });
                }

                // Check if username exists
                if (await _userManager.FindByNameAsync(model.Username) != null)
                {
                    _logger.LogWarning($"Registration failed: Username '{model.Username}' already exists");
                    return BadRequest(new { message = "Username is already taken" });
                }

                var user = new ApplicationUser
                {
                    UserName = model.Username,
                    Name = model.Name,
                    // Set NormalizedUserName explicitly
                    NormalizedUserName = model.Username.ToUpper()
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                {
                    var errorMessage = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.LogWarning($"Registration failed: {errorMessage}");
                    return BadRequest(new { message = errorMessage });
                }

                _logger.LogInformation($"Registration successful for username: {model.Username}");

                // Generate JWT token
                var token = GenerateJwtToken(user);
                return Ok(new
                {
                    token,
                    user = new
                    {
                        id = user.Id,
                        username = user.UserName,
                        name = user.Name
                    },
                    message = "User registered successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration error");
                return StatusCode(500, new { message = "An unexpected error occurred during registration" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                _logger.LogInformation($"Login attempt for username: {model.Username}");

                // Check if model is valid
                if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
                {
                    _logger.LogWarning("Login failed: Username or password is empty");
                    return BadRequest(new { message = "Username and password are required" });
                }

                // Try to find the user
                var user = await _userManager.FindByNameAsync(model.Username);

                // Log the result
                if (user == null)
                {
                    _logger.LogWarning($"Login failed: User '{model.Username}' not found in database");
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                _logger.LogInformation($"User found: ID={user.Id}, Name={user.Name}");

                // Verify password
                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

                if (!result.Succeeded)
                {
                    _logger.LogWarning($"Login failed: Invalid password for user '{model.Username}'");
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                var token = GenerateJwtToken(user);
                _logger.LogInformation($"Login successful for user '{model.Username}'");

                return Ok(new
                {
                    token,
                    user = new
                    {
                        id = user.Id,
                        username = user.UserName,
                        name = user.Name
                    },
                    message = "Login successful"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login error");
                return StatusCode(500, new { message = "An unexpected error occurred during login" });
            }
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpiryInMinutes"] ?? "60"));

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class RegisterModel
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string Name { get; set; }
    }

    public class LoginModel
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}