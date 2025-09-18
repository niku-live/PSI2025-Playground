# Project Structure

Understanding the architecture and organization of application's codebase.

## Overview

Application follows a clean, layered architecture with clear separation between frontend, backend, and data concerns. The project uses ASP.NET Core for the backend API and React for the frontend SPA (Single Page Application).

## Directory Structure

```
Root Folder/
├── Controllers/                         # API Controllers
│   └── WeatherForecastController.cs     # Main CRUD API endpoints
├── Data/                                # Data Access Layer
│   ├── IDataContext.cs                  # Data context interface
│   └── FakeDataContext.cs               # In-memory implementation
├── Models/                              # Data Models
│   └── WeatherForecast.cs               # Weather forecast entity
├── ClientApp/                           # React Frontend
│   ├── src/
│   │   ├── components/                  # React Components
│   │   │   ├── FetchData.js             # Weather CRUD component
│   │   │   ├── Home.js                  # Landing page
│   │   │   ├── Counter.js               # Demo counter
│   │   │   ├── Layout.js                # App layout wrapper
│   │   │   └── NavMenu.js               # Navigation component
│   │   ├── App.js                       # Main app component
│   │   ├── AppRoutes.js                 # Route configuration
│   │   ├── index.js                     # App entry point
│   │   ├── custom.css                   # Custom styles
│   │   └── setupProxy.js                # Development proxy config
│   ├── public/                          # Static assets
│   │   ├── index.html                   # HTML template
│   │   ├── favicon.ico                  # App icon
│   │   └── manifest.json                # PWA manifest
│   ├── package.json                     # Node.js dependencies
│   └── README.md                        # Frontend documentation
├── Pages/                               # Razor Pages
│   ├── _ViewImports.cshtml              # Common imports
│   ├── Error.cshtml                     # Error page template
│   └── Error.cshtml.cs                  # Error page logic
├── Properties/                          # Project Configuration
│   └── launchSettings.json              # Development server settings
├── Docs/                                # Documentation
│   ├── getting-started.md               # Setup guide
│   ├── api-reference.md                 # API documentation
│   ├── api-postman-collection.json      # API test Postman collection
│   └── [other-docs].md                  # Additional guides
├── bin/                                 # Build output
├── obj/                                 # Build cache
├── Program.cs                           # Application entry point
├── CoolApp.csproj                       # .NET project file
├── appsettings.json                     # App configuration
├── appsettings.Development.json         # Development settings
└── README.md                            # Project overview
```

## Architecture Layers

### 1. **API Layer** (`Controllers/`)
**Purpose**: Handles HTTP requests and responses

- **WeatherForecastController.cs**
  - Implements RESTful endpoints (GET, POST, PUT, DELETE, PATCH)
  - Uses dependency injection for data access
  - Follows ASP.NET Core conventions
  - Returns appropriate HTTP status codes

### 2. **Data Access Layer** (`Data/`)
**Purpose**: Abstracts data operations from business logic

- **IDataContext.cs**
  - Interface defining data operations
  - Enables dependency injection and testing
  - Abstracts underlying storage mechanism

- **FakeDataContext.cs**
  - In-memory implementation for development
  - Simulates database operations
  - Ready for replacement with real database context

### 3. **Domain Models** (`Models/`)
**Purpose**: Defines data structures and business entities

- **WeatherForecast.cs**
  - Primary data model
  - Auto-calculated properties (TemperatureF)
  - Used across API and frontend

### 4. **Frontend Layer** (`ClientApp/`)
**Purpose**: User interface and user experience

#### React Components Structure:
- **Layout.js**: Application shell with navigation
- **Home.js**: Landing page with project information
- **FetchData.js**: Main weather forecast management
  - Complete CRUD operations
  - Modal forms with validation
  - Bootstrap UI components
  - State management for UI feedback
- **Counter.js**: Demo component showing React patterns
- **NavMenu.js**: Navigation component with routing

#### Key Frontend Features:
- **Bootstrap Integration**: Responsive design and components
- **Form Validation**: Client-side validation with error feedback
- **State Management**: React class components with local state
- **API Integration**: Fetch API for backend communication
- **User Feedback**: Success/error messages and loading states

### 5. **Configuration Layer**
**Purpose**: Application settings and environment configuration

- **Program.cs**: Application startup and service configuration
- **appsettings.json**: Production configuration
- **appsettings.Development.json**: Development overrides
- **launchSettings.json**: Development server settings

## Design Patterns

### 1. **Dependency Injection**
```csharp
// Service registration
builder.Services.AddSingleton<IDataContext, FakeDataContext>();

// Constructor injection
public WeatherForecastController(IDataContext dataContext, ILogger<WeatherForecastController> logger)
```

### 2. **Repository Pattern**
```csharp
// Data abstraction
public interface IDataContext
{
    List<WeatherForecast> WeatherForecasts { get; }
}
```

### 3. **RESTful API Design**
- HTTP verbs match operations (GET=read, POST=create, etc.)
- Consistent endpoint structure
- Appropriate status codes
- JSON request/response format

### 4. **Component-Based Frontend**
- Reusable React components
- Single responsibility principle
- Props for component communication
- Local state for UI management

## Data Flow

### API Request Flow:
```
HTTP Request → Controller → Data Context → Response
```

### Frontend Update Flow:
```
User Action → React Event → API Call → State Update → UI Re-render
```

### Complete CRUD Flow:
```
1. User clicks "Add" → Modal opens
2. User submits form → API POST request
3. Backend saves data → Returns response
4. Frontend shows success → Refreshes table
```

## Technology Integration

### Backend Stack:
- **ASP.NET Core 7**: Web framework and hosting
- **C#**: Programming language
- **Dependency Injection**: Built-in IoC container
- **Kestrel**: Web server

### Frontend Stack:
- **React**: UI library
- **Bootstrap 5**: CSS framework
- **JavaScript (ES6+)**: Programming language
- **Fetch API**: HTTP client

### Development Integration:
- **ASP.NET Core SPA Proxy**: Frontend/backend integration
- **Hot Reload**: Both backend and frontend
- **Unified Build**: Single `dotnet run` command

## File Naming Conventions

### Backend (C#):
- **PascalCase** for classes, methods, properties
- **Descriptive names** for controllers and services
- **Interface prefix**: `IDataContext`

### Frontend (JavaScript):
- **PascalCase** for React components
- **camelCase** for variables and functions
- **kebab-case** for CSS classes

### Configuration:
- **lowercase** for JSON configuration files
- **camelCase** for JSON properties

## Extending the Architecture

### Adding New Features:
1. **Model**: Define data structure in `Models/`
2. **Data**: Add operations to `IDataContext`
3. **Controller**: Create new controller or extend existing
4. **Frontend**: Create/update React components
5. **Testing**: Add to Postman collection

### Database Integration:
Replace `FakeDataContext` with Entity Framework:
```csharp
// In Program.cs
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
```

---

**Next Steps:**
- Review [Development Guide](development-guide.md) for coding best practices
- See [API Reference](api-reference.md) for detailed endpoint documentation
- Check [Configuration](configuration.md) for environment setup