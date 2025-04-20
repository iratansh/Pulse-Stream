from diffusers import DiffusionPipeline
import torch
from pathlib import Path
import time
import random

class LogoGenerator:
    def __init__(self, model_id="prompthero/openjourney-v4", output_dir="/Backend/images"):
        """
        Initialize the Logo Generator with a specified model and output directory.
        
        Args:
            model_id (str): The diffusion model ID to use
            output_dir (str): Directory path to save generated images
        """
        # Create output directory
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Set model ID
        self.model_id = model_id
        
        # Setup device and data type
        self._setup_device()
        
        # Load the model
        self._load_model()
        
        # Define negative prompt
        self.negative_prompt = "text, words, letters, signature, watermark, multiple designs, blurry, amateur, poorly drawn, deformed, low-resolution"
    
    def _setup_device(self):
        """Determine the best available device and appropriate data type."""
        if torch.cuda.is_available():
            self.device = "cuda"
            self.dtype = torch.float16
        elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            self.device = "mps"
            self.dtype = torch.float32
        else:
            self.device = "cpu"
            self.dtype = torch.float32
            
        print(f"Using device: {self.device}")
    
    def _load_model(self):
        """Load the diffusion model with appropriate settings."""
        self.pipe = DiffusionPipeline.from_pretrained(
            self.model_id,
            torch_dtype=self.dtype if self.device != "cpu" else torch.float32,
            safety_checker=None  # For Faster generation
        )
        self.pipe.to(self.device)
        
        # Enable memory optimization
        self.pipe.enable_attention_slicing()
    
    def enhance_logo_prompt(self, basic_prompt):
        """
        Enhance a basic prompt with logo-specific style and quality descriptors.
        
        Args:
            basic_prompt (str): The base prompt to enhance
            
        Returns:
            str: The enhanced prompt
        """
        # Logo-specific style enhancers
        style_enhancers = [
            "minimalist logo design", 
            "professional vector logo", 
            "flat design", 
            "modern brand identity",
            "clean logo design", 
            "corporate identity", 
            "graphic design",
            "high contrast logo", 
            "scalable vector graphic", 
            "award-winning logo design"
        ]
        
        # Technical quality enhancers
        quality_enhancers = [
            "high detail", 
            "sharp lines", 
            "professional", 
            "trending on Behance",
            "high quality", 
            "4k", 
            "detailed", 
            "crisp lines",
            "perfect composition"
        ]
        
        # Pick 2-3 random enhancers from each category
        selected_style = random.sample(style_enhancers, 2)
        selected_quality = random.sample(quality_enhancers, 2)
        
        # Combine into an enhanced prompt
        enhanced = f"{basic_prompt}, {', '.join(selected_style)}, {', '.join(selected_quality)}"
        
        # Add model-specific prompt enhancers
        if "openjourney" in self.model_id:
            enhanced = f"{enhanced}, mdjrny-v4 style"
        
        return enhanced
    
    def generate_logos(self, basic_prompt, num_images=2, batch_size=2):
        """
        Generate logo images based on the provided prompt.
        
        Args:
            basic_prompt (str): The basic concept for the logo
            num_images (int): Number of images to generate
            batch_size (int): Batch size for generation
            
        Returns:
            list: List of generated images
        """
        # Enhance the prompt
        enhanced_prompt = self.enhance_logo_prompt(basic_prompt)
        print(f"Enhanced prompt: {enhanced_prompt}")
        
        start_time = time.time()
        
        # Generate in batches
        all_images = []
        for batch_idx in range(0, num_images, batch_size):
            print(f"Generating batch {batch_idx//batch_size + 1}/{(num_images+batch_size-1)//batch_size}...")
            batch_prompts = [enhanced_prompt] * min(batch_size, num_images - batch_idx)
            
            # Create a matching list of negative prompts
            batch_negative_prompts = [self.negative_prompt] * len(batch_prompts)
            
            # Better generation parameters for logos
            result = self.pipe(
                batch_prompts,
                negative_prompt=batch_negative_prompts,
                num_inference_steps=50,  # More steps for higher quality
                guidance_scale=8.5      # Higher for more prompt adherence
            )
            all_images.extend(result.images)
        
        # Save all generated images
        for i, image in enumerate(all_images):
            timestamp = int(time.time())
            image.save(self.output_dir / f"logo_{timestamp}_{i+1}.png")
        
        end_time = time.time()
        print(f"Generated {num_images} logos in {end_time - start_time:.2f} seconds")
        
        return all_images
    

if __name__ == "__main__":
    logo_gen = LogoGenerator()
    logo_gen.generate_logos("Sunshine")