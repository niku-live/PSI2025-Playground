# Getting Started

This guide will help you set up and run application on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **.NET 7 SDK or later** - [Download here](https://dotnet.microsoft.com/download)
- **Node.js (16+ recommended)** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Any modern web browser** (Chrome, Firefox, Edge, Safari)

### Optional Tools
- **Visual Studio Code** - Recommended editor with C# and React extensions
- **Postman** - For API testing (or use the included collection)
- **Git** - For version control

### Verify Installation
Check that everything is installed correctly:

```bash
# Check .NET version
dotnet --version
# Should return 7.0.0 or higher

# Check Node.js version
node --version
# Should return v16.0.0 or higher

# Check npm version
npm --version
# Should return 8.0.0 or higher
```

## Installation

### 1. Clone or Download the Project
```bash
cd WebAPI_Example
```

### 2. Restore Dependencies
The first run will automatically restore dependencies, but you can do it manually:

```bash
# Restore .NET packages
dotnet restore

# Install Node.js packages (optional - done automatically)
cd ClientApp
npm install
cd ..
```

## Quick Start

### Option 1: Run Everything at Once (Recommended)
```bash
dotnet run
```

This single command will:
- ✅ Build the .NET backend
- ✅ Install npm dependencies (first run only)
- ✅ Build the React frontend
- ✅ Start both backend and frontend servers
- ✅ Open the app in your default browser

### Option 2: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
dotnet run
```

**Terminal 2 - Frontend (if needed):**
```bash
cd ClientApp
npm start
```

## First Run Verification

### 1. Check the Application
- **Main App**: Navigate to `https://localhost:7039` (or port shown in terminal)
- **Weather Forecast Page**: Click "Fetch data" in the navigation
- **Test CRUD Operations**: Try adding, editing, and deleting weather forecasts

### 2. Verify API Endpoints
Test these endpoints in your browser or Postman:

- **Hello World**: `https://localhost:7039/hello` → Should return "Hello World!"
- **Test Endpoint**: `https://localhost:7039/test` → Should return "Test"
- **Weather API**: `https://localhost:7039/weatherforecast` → Should return JSON array

### 3. Check Console Output
Look for these in your terminal:
```
✅ Backend started successfully
✅ Frontend build completed
✅ Application running on https://localhost:7039
```

## Development Setup

### Hot Reload Development
For the best development experience:

```bash
# Backend with hot reload
dotnet watch run

# Frontend with hot reload (separate terminal)
cd ClientApp
npm start
```

### Port Configuration
Default ports are configured in `Properties/launchSettings.json`:
- **HTTPS**: 7039
- **HTTP**: 5000

To change ports, modify the launch settings file.

## Common First-Run Issues

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :7039

# Kill the process or change the port in launchSettings.json
```

### Node.js/npm Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete and reinstall node_modules
cd ClientApp
rm -rf node_modules package-lock.json
npm install
```

### .NET Build Issues
```bash
# Clean and restore
dotnet clean
dotnet restore
dotnet build
```

## Next Steps

Once you have the application running:

1. **📖 Read the Documentation**: Check out the [Project Structure](project-structure.md) to understand the codebase
2. **🧪 Test the Features**: Try all CRUD operations (Create, Read, Update, Delete)
3. **🔧 Explore the Code**: 
   - Backend: `Controllers/WeatherForecastController.cs`
   - Frontend: `ClientApp/src/components/FetchData.js` and `WeatherForecastModal.js`
   - Data Layer: `Data/FakeDataContext.cs`
4. **🚀 Start Developing**: Follow the [Development Guide](development-guide.md) for best practices
2. **🧪 Test the API**: Import the [Postman collection](testing-guide.md) for comprehensive API testing
3. **⚙️ Configure Settings**: Review [Configuration](configuration.md) for environment customization
4. **🔧 Start Developing**: Follow the [Development Guide](development-guide.md) for best practices

## Support

If you encounter issues:
1. Check the [Troubleshooting Guide](troubleshooting.md)
2. Verify all prerequisites are correctly installed
3. Ensure no other applications are using the required ports
4. Check the terminal output for specific error messages

---
**Ready to develop?** Continue to the [Development Guide](development-guide.md) for workflow best practices.