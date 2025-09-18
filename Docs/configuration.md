# Configuration

Environment setup and configuration options for application.

## Configuration Files Overview

Application uses multiple configuration files for different aspects of the application:

| File | Purpose | Environment |
|------|---------|-------------|
| `appsettings.json` | Production configuration | All |
| `appsettings.Development.json` | Development overrides | Development only |
| `Properties/launchSettings.json` | Development server settings | Development only |
| `ClientApp/package.json` | Frontend dependencies & scripts | All |
| `ClientApp/src/setupProxy.js` | Development proxy configuration | Development only |

## Backend Configuration

### Application Settings (`appsettings.json`)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

**Configuration Options:**
- **Logging**: Controls log levels for different components
- **AllowedHosts**: Specifies which hosts can access the application

### Development Settings (`appsettings.Development.json`)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

**Development-Specific Options:**
- **Enhanced Logging**: More detailed logging for debugging
- **Development-Only Features**: Can enable features like detailed error pages

### Launch Settings (`Properties/launchSettings.json`)
```json
{
  "$schema": "https://json.schemastore.org/launchsettings.json",
  "profiles": {
    "PlaygroundWebApp": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "applicationUrl": "https://localhost:7039;http://localhost:5000",
      "environmentName": "Development"
    }
  }
}
```

**Key Settings:**
- **applicationUrl**: Defines the ports for HTTP and HTTPS
- **launchBrowser**: Automatically opens browser on startup
- **environmentName**: Sets the ASP.NET Core environment

### Port Configuration

#### Default Ports:
- **HTTPS**: 7039
- **HTTP**: 5000

#### Changing Ports:
1. **Edit `launchSettings.json`**:
   ```json
   "applicationUrl": "https://localhost:8443;http://localhost:8080"
   ```

2. **Update Postman Collection**:
   - Change the `baseUrl` variable to match new ports

3. **Update Frontend Proxy** (if running separately):
   ```javascript
   // ClientApp/src/setupProxy.js
   target: 'https://localhost:8443'
   ```

## Frontend Configuration

### Package Configuration (`ClientApp/package.json`)
```json
{
  "name": "coolapp",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "bootstrap": "^5.2.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "prestart": "node aspnetcore-https && node aspnetcore-react",
    "start": "rimraf ./build && react-scripts start",
    "build": "react-scripts build",
    "test": "cross-env CI=true react-scripts test --env=jsdom --passWithNoTests",
    "eject": "react-scripts eject"
  }
}
```

**Key Scripts:**
- **start**: Starts development server with hot reload
- **build**: Creates production build
- **prestart**: Configures HTTPS certificates for development

### Proxy Configuration (`ClientApp/src/setupProxy.js`)
```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7039';

const context = [
  "/weatherforecast",
  "/hello",
  "/test"
];

module.exports = function(app) {
  const appProxy = createProxyMiddleware(context, {
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  });

  app.use(appProxy);
};
```

**Proxy Settings:**
- **target**: Backend server URL (automatically detected)
- **context**: API endpoints to proxy
- **secure**: Set to false for development HTTPS certificates

### Adding New API Endpoints to Proxy
When adding new API endpoints, update the context array:
```javascript
const context = [
  "/weatherforecast",
  "/hello",
  "/test",
  "/newapi"  // Add new endpoint here
];
```

## Environment Variables

### ASP.NET Core Environment Variables
```bash
# Set environment (Development/Staging/Production)
export ASPNETCORE_ENVIRONMENT=Development

# Set custom URLs
export ASPNETCORE_URLS="https://localhost:8443;http://localhost:8080"

# Set HTTPS port
export ASPNETCORE_HTTPS_PORT=8443
```

### Node.js Environment Variables
```bash
# Development mode
export NODE_ENV=development

# Custom port for React dev server
export PORT=3000

# Disable HTTPS for frontend
export HTTPS=false
```

## Development Environment Setup

### Visual Studio Code Configuration

#### Recommended Settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "files.exclude": {
    "**/bin": true,
    "**/obj": true,
    "**/node_modules": true
  },
  "javascript.preferences.quoteStyle": "single",
  "typescript.preferences.quoteStyle": "single"
}
```

#### Launch Configuration (`.vscode/launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": ".NET Core Launch (web)",
      "type": "coreclr",
      "request": "launch",
      "preLaunchTask": "build",
      "program": "${workspaceFolder}/bin/Debug/net7.0/CoolApp.dll",
      "args": [],
      "cwd": "${workspaceFolder}",
      "stopAtEntry": false,
      "serverReadyAction": {
        "action": "openExternally",
        "pattern": "\\bNow listening on:\\s+(https?://\\S+)"
      },
      "env": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      },
      "sourceFileMap": {
        "/Views": "${workspaceFolder}/Views"
      }
    }
  ]
}
```

## Production Configuration

### Building for Production
```bash
# Build optimized version
dotnet publish -c Release -o ./publish

# Production settings
export ASPNETCORE_ENVIRONMENT=Production
export ASPNETCORE_URLS="https://+:443;http://+:80"
```

### Production Security Settings
```json
// appsettings.Production.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "yourdomain.com,www.yourdomain.com"
}
```

## Database Configuration (Future)

### Entity Framework Setup (when implementing real database):
```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CoolAppDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

```csharp
// Program.cs
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

## HTTPS Configuration

### Development HTTPS Certificate
```bash
# Generate development certificate
dotnet dev-certs https --trust

# Check certificate status
dotnet dev-certs https --check --trust
```

### Custom HTTPS Certificate
```bash
# Generate custom certificate
dotnet dev-certs https -ep ${HOME}/.aspnet/https/aspnetapp.pfx -p password

# Set environment variables
export ASPNETCORE_Kestrel__Certificates__Default__Password="password"
export ASPNETCORE_Kestrel__Certificates__Default__Path="${HOME}/.aspnet/https/aspnetapp.pfx"
```

## CORS Configuration (if needed)

### Enabling CORS for API access:
```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://localhost:3001")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Use CORS
app.UseCors("AllowReactApp");
```

## Logging Configuration

### Custom Logging Settings:
```json
// appsettings.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information",
      "CoolApp.Controllers": "Debug"
    },
    "Console": {
      "IncludeScopes": true,
      "TimestampFormat": "yyyy-MM-dd HH:mm:ss "
    }
  }
}
```

### Adding Custom Logging:
```csharp
// In controllers
private readonly ILogger<WeatherForecastController> _logger;

[HttpPost]
public WeatherForecast Create(WeatherForecast forecast)
{
    _logger.LogInformation("Creating weather forecast for {Date}", forecast.Date);
    // ... implementation
}
```

## Performance Configuration

### Kestrel Server Options:
```json
// appsettings.json
{
  "Kestrel": {
    "Limits": {
      "MaxRequestBodySize": 10485760,
      "RequestHeadersTimeout": "00:00:30"
    }
  }
}
```

### Frontend Performance:
```json
// ClientApp/package.json - build optimization
{
  "scripts": {
    "build": "react-scripts build && echo 'Build completed successfully'"
  }
}
```

## Common Configuration Issues

### Port Conflicts
```bash
# Check what's using a port
netstat -ano | findstr :7039

# Kill process using port (Windows)
taskkill /PID <process_id> /F

# Kill process using port (Linux/Mac)
kill -9 $(lsof -ti:7039)
```

### Certificate Issues
```bash
# Clear and regenerate certificates
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

### Node.js Version Issues
```bash
# Check Node version
node --version

# Use specific Node version (with nvm)
nvm use 18
```

## Environment-Specific Configuration

### Development
- Detailed logging enabled
- HTTPS certificates trusted locally
- Hot reload enabled
- Source maps enabled

### Production
- Minimal logging
- Valid SSL certificates required
- Optimized builds
- Security headers enabled

---

**Need help with configuration issues?** Check the [Troubleshooting Guide](troubleshooting.md) for common configuration problems and solutions.