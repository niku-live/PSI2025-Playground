# Development Guide

Best practices and workflows for developing and extending application.

## Development Environment Setup

### Recommended Tools
- **Visual Studio Code** with extensions:
  - C# for Visual Studio Code
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - REST Client (for API testing)
- **Git** for version control
- **Postman** for API testing
- **Browser DevTools** for frontend debugging

### IDE Configuration
```json
// .vscode/settings.json (recommended)
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "javascript.preferences.quoteStyle": "single",
  "typescript.preferences.quoteStyle": "single"
}
```

## Development Workflow

### Starting Development
```bash
# Start with hot reload for both frontend and backend
dotnet watch run

# Or start backend and frontend separately
# Terminal 1 - Backend
dotnet watch run

# Terminal 2 - Frontend
cd ClientApp
npm start
```

### Daily Development Process
1. **Pull latest changes** from version control
2. **Restore dependencies** if needed
3. **Start development servers** with hot reload
4. **Make changes** incrementally
5. **Test changes** as you go
6. **Commit frequently** with descriptive messages

## Backend Development

### Controller Best Practices

#### 1. RESTful Design
```csharp
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    // GET /weatherforecast
    [HttpGet]
    public IEnumerable<WeatherForecast> Get() { }
    
    // POST /weatherforecast
    [HttpPost]
    public WeatherForecast Create(WeatherForecast forecast) { }
    
    // PUT /weatherforecast
    [HttpPut]
    public WeatherForecast Update(WeatherForecast forecast) { }
    
    // DELETE /weatherforecast
    [HttpDelete]
    public IActionResult Delete(DateOnly date) { }
}
```

#### 2. Dependency Injection
```csharp
public class WeatherForecastController : ControllerBase
{
    private readonly IDataContext _dataContext;
    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(IDataContext dataContext, ILogger<WeatherForecastController> logger)
    {
        _dataContext = dataContext;
        _logger = logger;
    }
}
```

#### 3. Error Handling
```csharp
[HttpDelete]
public IActionResult Delete(DateOnly date)
{
    var existing = _dataContext.WeatherForecasts.FirstOrDefault(wf => wf.Date == date);
    if (existing != null)
    {
        _dataContext.WeatherForecasts.Remove(existing);
        return Ok();
    }
    return NotFound(); // Proper HTTP status codes
}
```

### Adding New Endpoints

#### Step 1: Define the Model (if needed)
```csharp
// Models/NewModel.cs
public class NewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime Created { get; set; }
}
```

#### Step 2: Update Data Context
```csharp
// Data/IDataContext.cs
public interface IDataContext
{
    List<WeatherForecast> WeatherForecasts { get; }
    List<NewModel> NewModels { get; } // Add new collection
}

// Data/FakeDataContext.cs
public List<NewModel> NewModels { get; } = new();
```

#### Step 3: Create Controller
```csharp
// Controllers/NewModelController.cs
[ApiController]
[Route("[controller]")]
public class NewModelController : ControllerBase
{
    private readonly IDataContext _dataContext;
    
    public NewModelController(IDataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    [HttpGet]
    public IEnumerable<NewModel> Get()
    {
        return _dataContext.NewModels;
    }
}
```

## Frontend Development

### React Component Structure
```javascript
// Standard component template
import React, { Component } from 'react';

export class ComponentName extends Component {
  static displayName = ComponentName.name;

  constructor(props) {
    super(props);
    this.state = {
      // Initial state
    };
  }

  componentDidMount() {
    // Initial data loading
  }

  // Event handlers
  handleSomething = () => {
    // Use arrow functions for proper 'this' binding
  }

  render() {
    return (
      <div>
        {/* Component JSX */}
      </div>
    );
  }
}
```

### State Management Best Practices

#### 1. Organize State Logically
```javascript
constructor(props) {
  super(props);
  this.state = {
    // Data
    forecasts: [],
    
    // UI State
    loading: true,
    showModal: false,
    
    // Form Data
    newForecast: {
      date: '',
      temperatureC: '',
      summary: ''
    },
    
    // Validation
    validationErrors: {},
    
    // Feedback
    successMessage: '',
    errorMessage: ''
  };
}
```

#### 2. Update State Immutably
```javascript
// Good - creates new object
this.setState({
  newForecast: { ...this.state.newForecast, date: newDate }
});

// Bad - mutates existing object
this.state.newForecast.date = newDate;
this.setState({ newForecast: this.state.newForecast });
```

### API Integration Patterns

#### 1. Async/Await Pattern
```javascript
async populateWeatherData() {
  try {
    this.setState({ loading: true, errorMessage: '' });
    const response = await fetch('weatherforecast');
    const data = await response.json();
    this.setState({ forecasts: data, loading: false });
  } catch (error) {
    console.error('Error fetching data:', error);
    this.setState({ 
      errorMessage: 'Failed to load data', 
      loading: false 
    });
  }
}
```

#### 2. Form Submission Pattern
```javascript
async submitForm() {
  // Validate first
  const errors = this.validateForm();
  if (Object.keys(errors).length > 0) {
    this.setState({ validationErrors: errors });
    return;
  }

  try {
    const response = await fetch('weatherforecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.formData)
    });
    
    if (response.ok) {
      this.handleSuccess();
    } else {
      this.handleError('Failed to save data');
    }
  } catch (error) {
    this.handleError('Network error occurred');
  }
}
```

### Adding New Components

#### Step 1: Create Component File
```javascript
// ClientApp/src/components/NewComponent.js
import React, { Component } from 'react';

export class NewComponent extends Component {
  // Component implementation
}
```

#### Step 2: Update Routes (if needed)
```javascript
// ClientApp/src/AppRoutes.js
const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/new-feature', // Add new route
    element: <NewComponent />
  }
];
```

#### Step 3: Update Navigation
```javascript
// ClientApp/src/components/NavMenu.js
<NavItem>
  <NavLink tag={Link} className="text-dark" to="/new-feature">
    New Feature
  </NavLink>
</NavItem>
```

### Component Refactoring Best Practices

When components become too large (>200 lines), consider refactoring:

#### Identifying Refactoring Opportunities
- **Mixed Responsibilities**: Component handling both data and UI logic
- **Large Render Methods**: Complex JSX with multiple concerns
- **Excessive State**: Too many state properties for different features
- **Duplicate Logic**: Similar patterns that could be abstracted

#### Example: Modal Component Extraction

**Before (Large Component):**
```javascript
// FetchData.js - 280 lines with mixed responsibilities
export class FetchData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forecasts: [],          // Data management
      showModal: false,       // Modal state
      formData: {...},        // Form state
      validationErrors: {...}, // Validation state
      // ... many more properties
    };
  }

  renderModal() {
    // 100+ lines of modal JSX
  }

  handleFormSubmit() {
    // Form handling logic
  }

  // ... rest of component
}
```

**After (Separated Components):**
```javascript
// FetchData.js - 180 lines, focused on data management
export class FetchData extends Component {
  render() {
    return (
      <div>
        {/* Table and main UI */}
        <WeatherForecastModal
          isVisible={this.state.showModal}
          isEditMode={this.state.isEditMode}
          forecast={this.state.editingForecast}
          onSubmit={this.handleModalSubmit}
          onClose={this.closeModal}
        />
      </div>
    );
  }
}

// WeatherForecastModal.js - 140 lines, focused on form logic
export class WeatherForecastModal extends Component {
  // Dedicated modal logic only
}
```

#### Benefits of Component Separation:
- **Single Responsibility**: Each component has one clear purpose
- **Better Testability**: Easier to test smaller, focused components
- **Reusability**: Extracted components can be reused elsewhere
- **Maintainability**: Changes to modal don't affect main component
- **Code Organization**: Cleaner, more readable codebase

#### Refactoring Steps:
1. **Identify Boundaries**: Determine what logic belongs together
2. **Extract State**: Move relevant state to the new component
3. **Define Props Interface**: Create clear communication between components
4. **Move Methods**: Transfer related methods to the new component
5. **Test Integration**: Ensure components work together correctly

## Code Style Guidelines

### Backend (C#)
- **PascalCase** for public members
- **camelCase** for private fields (with underscore prefix: `_field`)
- **Descriptive names** over short names
- **Async methods** should end with "Async"
- **Use explicit types** when clarity is important

```csharp
// Good
public async Task<WeatherForecast> CreateWeatherForecastAsync(WeatherForecast forecast)
{
    var existingForecast = await _dataContext.FindByDateAsync(forecast.Date);
    // ...
}
```

### Frontend (JavaScript/React)
- **PascalCase** for React components
- **camelCase** for variables, functions, props
- **Arrow functions** for event handlers
- **Destructuring** for cleaner code

```javascript
// Good
const { forecasts, loading, errorMessage } = this.state;

handleInputChange = (field, value) => {
  this.setState({
    newForecast: { ...this.state.newForecast, [field]: value }
  });
}
```

## Testing During Development

### Quick Testing Workflow
1. **Manual UI Testing**: Test each feature as you build it
2. **API Testing**: Use browser DevTools or Postman
3. **Cross-browser Testing**: Test in different browsers
4. **Responsive Testing**: Test different screen sizes

### Debugging Tips

#### Backend Debugging
```csharp
// Add breakpoints in controllers
[HttpPost]
public WeatherForecast Create(WeatherForecast forecast)
{
    _logger.LogInformation($"Creating forecast for {forecast.Date}");
    // Breakpoint here
    _dataContext.WeatherForecasts.Add(forecast);
    return forecast;
}
```

#### Frontend Debugging
```javascript
// Use console.log strategically
async addWeatherData() {
  console.log('Form data:', this.state.newForecast);
  
  try {
    const response = await fetch('weatherforecast', {
      method: 'POST',
      // ...
    });
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Performance Considerations

### Backend Optimization
- **Use appropriate data types** (DateOnly vs DateTime)
- **Implement caching** for expensive operations
- **Optimize database queries** (when adding real database)
- **Use async/await** for I/O operations

### Frontend Optimization
- **Minimize API calls** - cache data when possible
- **Optimize re-renders** - careful with setState calls
- **Lazy load components** for large applications
- **Bundle optimization** - code splitting for production

## Git Workflow

### Commit Messages
```bash
# Good commit messages
git commit -m "Add weather forecast validation to frontend form"
git commit -m "Fix temperature conversion calculation"
git commit -m "Update API documentation for new endpoints"

# Branch naming
feature/add-user-authentication
bugfix/fix-temperature-display
docs/update-api-reference
```

### Before Committing
1. **Test your changes** thoroughly
2. **Run the application** to ensure it starts
3. **Check for console errors** in browser/terminal
4. **Update documentation** if needed

## Common Development Tasks

### Adding Validation
```javascript
// Frontend validation
validateForm() {
  const errors = {};
  const { date, temperatureC, summary } = this.state.newForecast;

  if (!date) errors.date = 'Date is required';
  if (!temperatureC || isNaN(temperatureC)) {
    errors.temperatureC = 'Valid temperature is required';
  }
  if (!summary?.trim()) errors.summary = 'Summary is required';

  return errors;
}
```

### Error Handling Patterns
```javascript
// Consistent error handling
handleError(message) {
  this.setState({ 
    errorMessage: message,
    loading: false,
    successMessage: '' 
  });
}

handleSuccess(message) {
  this.setState({ 
    successMessage: message,
    errorMessage: '',
    loading: false 
  });
}
```

## Next Steps

After making changes:
1. **Test thoroughly** using the [Testing Guide](testing-guide.md)
2. **Update documentation** if you added features
3. **Consider configuration changes** in [Configuration](configuration.md)
4. **Check for common issues** in [Troubleshooting](troubleshooting.md)

---

**Ready to test your changes?** Continue to the [Testing Guide](testing-guide.md) for comprehensive testing strategies.