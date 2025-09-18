# Troubleshooting

Common issues, solutions, and debugging tips for application.

## Quick Diagnostic Checklist

Before diving into specific issues, run this quick diagnostic:

1. **Check Application Status**: Is the backend running on the correct port?
2. **Verify Frontend Connection**: Can the React app reach the API?
3. **Review Console Logs**: Check browser developer tools and terminal output
4. **Validate Configuration**: Ensure all configuration files are correct

## Common Issues

### 1. Application Won't Start

#### Problem: Backend fails to start
```
Unable to bind to https://localhost:7039 on the IPv4 loopback interface
```

**Causes & Solutions:**
- **Port in use**: Another application is using port 7039
  ```bash
  # Check what's using the port
  netstat -ano | findstr :7039
  
  # Kill the process (replace PID)
  taskkill /PID <process_id> /F
  ```

- **HTTPS certificate issues**: Development certificate is corrupted
  ```bash
  # Clean and regenerate certificates
  dotnet dev-certs https --clean
  dotnet dev-certs https --trust
  ```

- **Permission issues**: Insufficient permissions to bind to port
  ```bash
  # Run as administrator or use different port
  # Edit launchSettings.json to use ports > 1024
  ```

#### Problem: Frontend fails to start
```
Error: ENOSPC: System limit for number of file watchers reached
```

**Solutions:**
- **Increase file watcher limit** (Linux/Mac):
  ```bash
  echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
  ```

- **Clean and reinstall dependencies**:
  ```bash
  cd ClientApp
  rm -rf node_modules package-lock.json
  npm install
  ```

### 2. API Connection Issues

#### Problem: Frontend can't reach backend
```
Failed to fetch
TypeError: NetworkError when attempting to fetch resource
```

**Diagnostic Steps:**
1. **Check backend URL**: Verify the API is running
   ```bash
   curl https://localhost:7039/weatherforecast
   ```

2. **Verify proxy configuration**: Check `ClientApp/src/setupProxy.js`
   ```javascript
   // Ensure target matches your backend URL
   const target = 'https://localhost:7039';
   ```

3. **Check browser network tab**: Look for failed requests

**Solutions:**
- **CORS issues**: Add CORS policy to backend
  ```csharp
  // Program.cs
  builder.Services.AddCors();
  app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
  ```

- **Proxy not working**: Restart both frontend and backend
  ```bash
  # Stop both applications
  # Start backend first: dotnet run
  # Then start frontend: cd ClientApp && npm start
  ```

#### Problem: API returns 404 for endpoints
```
GET https://localhost:7039/weatherforecast 404 (Not Found)
```

**Diagnostic Steps:**
1. **Check controller routing**: Verify controller and action attributes
2. **Check application startup**: Ensure controllers are registered
3. **Test minimal API endpoints**: Try `/hello` or `/test` endpoints

**Solutions:**
- **Missing [ApiController] attribute**:
  ```csharp
  [ApiController]
  [Route("[controller]")]
  public class WeatherForecastController : ControllerBase
  ```

- **Routing conflicts**: Check for duplicate routes
- **Controller not registered**: Ensure `AddControllers()` is called

### 3. Data Issues

#### Problem: Weather forecast data not updating
```
Generate button doesn't refresh the table
```

**Diagnostic Steps:**
1. **Check network requests**: Look for successful POST to `/weatherforecast/generate`
2. **Verify state updates**: Check React component state in browser dev tools
3. **Check console for errors**: Look for JavaScript errors

**Solutions:**
- **State not updating**: Ensure `setState` is called properly
  ```javascript
  generateWeatherData = async () => {
    try {
      const response = await fetch('/weatherforecast/generate', { method: 'POST' });
      const data = await response.json();
      this.setState({ forecasts: data }); // Must update state
    } catch (error) {
      console.error('Error generating data:', error);
    }
  }
  ```

- **API endpoint not working**: Test endpoint directly
  ```bash
  curl -X POST https://localhost:7039/weatherforecast/generate
  ```

#### Problem: CRUD operations fail
```
Add/Edit/Delete buttons don't work
```

**Diagnostic Steps:**
1. **Check HTTP methods**: Verify correct HTTP verbs are used
2. **Validate request payloads**: Ensure data is sent correctly
3. **Check response status codes**: Look for 4xx/5xx errors

**Solutions:**
- **Incorrect HTTP method**:
  ```javascript
  // Correct methods for each operation
  const response = await fetch('/weatherforecast', {
    method: 'POST',    // Create
    method: 'PUT',     // Update
    method: 'DELETE'   // Delete
  });
  ```

- **Missing request headers**:
  ```javascript
  const response = await fetch('/weatherforecast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  ```

### 4. Build and Deployment Issues

#### Problem: Build fails
```
error CS1002: ; expected
```

**Diagnostic Steps:**
1. **Check for syntax errors**: Review recent code changes
2. **Verify using statements**: Ensure all namespaces are imported
3. **Check for missing dependencies**: Verify NuGet packages

**Solutions:**
- **Clean and rebuild**:
  ```bash
  dotnet clean
  dotnet build
  ```

- **Restore packages**:
  ```bash
  dotnet restore
  ```

#### Problem: Frontend build fails
```
Module not found: Can't resolve 'bootstrap'
```

**Solutions:**
- **Install missing dependencies**:
  ```bash
  cd ClientApp
  npm install bootstrap react react-dom react-router-dom
  ```

- **Clear cache**:
  ```bash
  npm cache clean --force
  rm -rf node_modules package-lock.json
  npm install
  ```

### 5. Performance Issues

#### Problem: Application is slow
**Symptoms**: Long response times, UI freezing, high CPU usage

**Diagnostic Steps:**
1. **Check network tab**: Look for slow API requests
2. **Profile React components**: Use React Developer Tools
3. **Monitor backend performance**: Check logs for slow operations

**Solutions:**
- **Frontend optimization**:
  ```javascript
  // Use useCallback for expensive operations
  const handleSubmit = useCallback(() => {
    // Expensive operation
  }, [dependencies]);
  
  // Debounce search inputs
  const debouncedSearch = useMemo(() => 
    debounce(searchFunction, 300), []);
  ```

- **Backend optimization**:
  ```csharp
  // Add caching for expensive operations
  [HttpGet]
  [ResponseCache(Duration = 60)]
  public IActionResult GetWeatherForecast()
  {
    // Cached for 60 seconds
  }
  ```

#### Problem: Memory leaks
**Symptoms**: Increasing memory usage over time

**Solutions:**
- **Clean up event listeners**:
  ```javascript
  componentWillUnmount() {
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
  }
  ```

- **Cancel pending requests**:
  ```javascript
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    });
  
  // Cancel on unmount
  componentWillUnmount() {
    controller.abort();
  }
  ```

## Browser-Specific Issues

### Chrome
- **CORS errors**: Use `--disable-web-security` flag for testing (development only)
- **Certificate warnings**: Go to chrome://flags and enable "Allow invalid certificates for localhost"

### Firefox
- **Mixed content blocking**: Ensure all resources use HTTPS in production
- **Developer tools network filtering**: Enable "Persist logs" for better debugging

### Safari
- **Webkit-specific CSS issues**: Add vendor prefixes for CSS properties
- **Fetch API limitations**: Use polyfills for older Safari versions

## Database Issues (Future)

When implementing a real database, common issues include:

### Connection String Problems
```csharp
// Verify connection string format
"Server=(localdb)\\mssqllocaldb;Database=CoolAppDb;Trusted_Connection=true"
```

### Entity Framework Migrations
```bash
# Add migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update

# Reset database
dotnet ef database drop
dotnet ef database update
```

## Security Issues

### HTTPS in Development
```bash
# Trust development certificate
dotnet dev-certs https --trust

# Verify certificate
dotnet dev-certs https --check --trust
```

### Cross-Origin Requests
```csharp
// Proper CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("https://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
```

## Debugging Techniques

### Backend Debugging
```csharp
// Add logging to controllers
private readonly ILogger<WeatherForecastController> _logger;

[HttpPost]
public IActionResult Create([FromBody] WeatherForecast forecast)
{
    _logger.LogInformation("Creating forecast: {@Forecast}", forecast);
    
    try
    {
        // Implementation
        _logger.LogInformation("Forecast created successfully");
        return Ok(result);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error creating forecast");
        return StatusCode(500, "Internal server error");
    }
}
```

### Frontend Debugging
```javascript
// Add debug logging
console.group('Weather Forecast Operations');
console.log('Current state:', this.state);
console.log('Making API call to:', url);
console.groupEnd();

// Use React Developer Tools
// Install browser extension for component inspection

// Network debugging
const response = await fetch('/api/endpoint');
console.log('Response status:', response.status);
console.log('Response headers:', [...response.headers.entries()]);
```

### Network Debugging
```bash
# Test API endpoints directly
curl -X GET https://localhost:7039/weatherforecast
curl -X POST https://localhost:7039/weatherforecast/generate
curl -X POST -H "Content-Type: application/json" -d '{"date":"2024-01-01","temperatureC":25,"summary":"Warm"}' https://localhost:7039/weatherforecast
```

## Development Tools

### Recommended Browser Extensions
- **React Developer Tools**: Component inspection and profiling
- **Redux DevTools**: State management debugging (if using Redux)
- **Postman Interceptor**: API testing integration

### VS Code Extensions
- **C# Dev Kit**: Enhanced C# support
- **ES7+ React/Redux/React-Native snippets**: React development shortcuts
- **REST Client**: Test API endpoints from VS Code

## Error Reporting

### Structured Error Reporting
When reporting issues, include:

1. **Environment Information**:
   - Operating System
   - .NET version (`dotnet --version`)
   - Node.js version (`node --version`)
   - Browser version

2. **Steps to Reproduce**:
   - Exact steps that lead to the issue
   - Expected vs actual behavior

3. **Error Details**:
   - Full error messages
   - Stack traces
   - Browser console logs
   - Network request details

4. **Configuration**:
   - Relevant configuration files
   - Environment variables
   - Port configurations

### Log Collection
```bash
# Backend logs
dotnet run > app.log 2>&1

# Frontend logs (save browser console output)
# Use browser developer tools -> Console -> Save as...

# Network logs
# Use browser developer tools -> Network -> Export HAR
```

## Getting Additional Help

### Resources
- **ASP.NET Core Documentation**: https://docs.microsoft.com/en-us/aspnet/core/
- **React Documentation**: https://reactjs.org/docs/
- **Bootstrap Documentation**: https://getbootstrap.com/docs/

### Community Support
- **Stack Overflow**: Tag questions with `asp.net-core`, `react`, or `bootstrap`
- **GitHub Issues**: Check project repositories for known issues
- **Discord/Slack Communities**: Join relevant development communities

### Professional Support
- **Microsoft Support**: For ASP.NET Core issues
- **Commercial Support**: Consider hiring experienced developers for complex issues

---

**Still having issues?** If these troubleshooting steps don't resolve your problem, please check the [Development Guide](development-guide.md) for more detailed development practices or refer to the [Configuration Guide](configuration.md) for setup-related issues.