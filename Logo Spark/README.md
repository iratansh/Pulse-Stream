### **Project: LogoSpark**  
A full-stack AI-powered logo generation platform that combines a .NET backend for user management and a Python FastAPI service for AI-driven logo generation, paired with a modern React frontend. Ideal for startups, designers, and businesses needing rapid brand identity solutions.

---

### **Key Features**  
1. **AI-Powered Logo Generation**:  
   - Generate 6 logo variants in real-time using diffusion models (e.g., `openjourney-v4`).  
   - Progressive streaming via Server-Sent Events (SSE) with abortion controls.  
   - Prompt engineering enhances user input with style/quality descriptors.  

2. **User Management**:  
   - JWT-based authentication with ASP.NET Identity.  
   - Save logos to profiles, track generation history, and manage favorites.  

3. **Multi-Service Architecture**:  
   - **ASP.NET Core**: Handles auth, user data, and image metadata (PostgreSQL).  
   - **Python FastAPI**: Dedicated AI service for logo generation (Hugging Face `diffusers`).  
   - **React Frontend**: Interactive UI with real-time updates and responsive design.  

4. **Core Functionality**:  
   - Real-time dashboard with progress tracking and placeholders.  
   - Industry-specific logo inspiration gallery (15+ categories).  
   - Blog with markdown articles, pricing tiers, and documentation.  

---

### **Technologies Stack**  
| **Area**       | **Technologies**                                                                 |  
|----------------|----------------------------------------------------------------------------------|  
| **Backend**    | ASP.NET Core, Entity Framework, PostgreSQL, JWT, Swagger                        |  
| **AI Service** | Python, FastAPI, Hugging Face Diffusion Models, Torch, SSE                      |  
| **Frontend**   | React, React Router, Keen-Slider, React-Icons, LocalStorage, CSS Modules        |  
| **DevOps**     | REST APIs, CORS, Microservices Architecture, PostgreSQL Relations              |  

---

### **Architecture Flow**  
```mermaid
graph TD
  A[React Frontend<br>LogoMaker/Dashboard] -->|JWT Auth<br>User Management| B[ASP.NET Core<br>Auth/Saving Controllers]
  A -->|SSE Streaming<br>POST/DELETE Requests| C[Python FastAPI<br>Logo Generation Service]
  B -->|Store User Data<br>Image Metadata| D[(PostgreSQL<br>Users + Images)]
  C -->|Hugging Face<br>Diffusion Pipeline| E[(AI Model Service<br>openjourney-v4)]
  B <-->|Sync Image Paths<br>User Context| C
  C -.->|Local Storage| F[/Images Directory/]

  style A fill:#b3cde3,stroke:#333
  style B fill:#decbe4,stroke:#333
  style C fill:#fed9a6,stroke:#333
  style D fill:#ccebc5,stroke:#333
  style E fill:#ffffcc,stroke:#333
  style F fill:#fbb4ae,stroke:#333

  classDef database fill:#ccebc5,stroke:#333
  classDef ai fill:#ffffcc,stroke:#333
  classDef storage fill:#fbb4ae,stroke:#333
  class D database
  class E ai
  class F storage
```

---

### **Key Components**  
1. **Backend (C#)**:  
   - `AuthController.cs`: JWT token generation and user management.  
   - `SavingController.cs`: Save/retrieve logos with PostgreSQL.  
   - `ApplicationDbContext.cs`: User-logo relationships with EF Core.  

2. **AI Service (Python)**:  
   - `AILogoModel.py`: Enhances prompts and generates logos via diffusion models.  
   - `app.py`: SSE streaming and task abortion handling.  

3. **Frontend (React)**:  
   - `Dashboard.jsx`: Real-time logo grid with progress tracking.  
   - `LogoMaker.jsx`: Input form triggering AI generation.  
   - `Blog.jsx`: Dynamic article rendering from markdown.  
   - `logoAPI.js`: Manages API/SSE connections.  

---

### **Highlights?**  
- **Polyglot Design**: Optimizes .NET for auth/data and Python for AI/ML.  
- **Real-Time UX**: Stream logos as they generate—no waiting for batch completion.  
- **Scalable**: PostgreSQL handles user growth; diffusion models support style expansions.  

#Progress Images#
![1745343372449](image/README/1745343372449.png)
![1745343384382](image/README/1745343384382.png)
![1745343437482](image/README/1745343437482.png)
![1745343448407](image/README/1745343448407.png)
![1745343456330](image/README/1745343456330.png)
![1745343466334](image/README/1745343466334.png)
![1745343473824](image/README/1745343473824.png)
![1745343481971](image/README/1745343481971.png)
![1745343488383](image/README/1745343488383.png)
![1745343494427](image/README/1745343494427.png)
![1745343502382](image/README/1745343502382.png)
![1745343511953](image/README/1745343511953.png)
![1745343527480](image/README/1745343527480.png)
![1745343535045](image/README/1745343535045.png)
![1745343544086](image/README/1745343544086.png)
![1745343338685](image/README/1745343338685.png)
![1745557672461](image/README/1745557672461.png)
![1745557849503](image/README/1745557849503.png)
![1745613552198](image/README/1745613552198.png)