# CoolApp

## Project Overview
CoolApp is a web application built with ASP.NET Core and React. It serves as a playground for learning and experimenting with modern web development technologies. The backend is implemented in C# (.NET 7), while the frontend uses React (JavaScript).

## Planned Functionality
- Weather Forecast API and UI
- Counter and demo components
- Responsive navigation and layout
- Integration between ASP.NET Core backend and React frontend
- User authentication and authorization (planned)
- Data persistence and CRUD operations (planned)
- Error handling and logging

## Team Members
- [Add team member names here]

## Project Structure
- `Controllers/` - ASP.NET Core API controllers
- `Pages/` - Razor pages and error handling
- `ClientApp/` - React frontend
  - `src/components/` - React components
- `Program.cs` - Application entry point
- `WeatherForecast.cs` - Data model

## How to Build
### Prerequisites
- .NET 7 SDK
- Node.js and npm

### Backend (ASP.NET Core)
1. Open a terminal in the project root.
2. Run:
   ```pwsh
   dotnet build
   dotnet run
   ```

### Frontend (React)
1. Navigate to `ClientApp`:
   ```pwsh
   cd ClientApp
   npm install
   npm start
   ```

## Running the Application
- By default, running the backend will also serve the React frontend via ASP.NET Core proxy.
- Access the app at `https://localhost:5001` or the port specified in `launchSettings.json`.

## Configuration
- App settings are in `appsettings.json` and `appsettings.Development.json`.
- Frontend configuration is in `ClientApp/public/` and `ClientApp/src/`.

## Additional Notes
- For development, use the `Development` profile in `launchSettings.json`.
- Error pages are handled in `Pages/Error.cshtml`.
- For more details, see inline comments in source files.

---
Feel free to update this README with new features, team members, and instructions as the project evolves.
