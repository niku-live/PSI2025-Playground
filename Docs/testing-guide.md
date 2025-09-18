# Testing Guide

Comprehensive testing strategies and procedures for application.

## Testing Overview

Project uses multiple testing approaches to ensure reliability:
- **Manual Testing**: UI and workflow verification
- **API Testing**: Postman collection with automated validation
- **Browser Testing**: Cross-browser compatibility
- **Integration Testing**: End-to-end workflow verification

## Postman Collection Testing

### Setup Postman Collection
1. **Import Collection**:
   - Open Postman
   - Click "Import" → "Upload Files"
   - Select `api-postman-collection.json` from the project Docs folder
   - Collection "WeatherForecast API Collection" will be imported

2. **Configure Environment**:
   - The collection includes a `baseUrl` variable
   - Default: `https://localhost:7039`
   - Update if your app runs on a different port

### Running the Collection

#### Individual Request Testing
```
1. Start your application: dotnet run
2. In Postman, expand "WeatherForecast API Collection"
3. Run requests in this order for best results:
   - Hello World Endpoint (connectivity test)
   - Test Endpoint (basic functionality)
   - Get All Weather Forecasts (check initial data)
   - Generate Weather Forecasts (create test data)
   - Create Weather Forecast (test POST)
   - Update Weather Forecast (test PUT)
   - Delete Weather Forecast (test DELETE)
```

#### Full Collection Run
```
1. Click the collection name "WeatherForecast API Collection"
2. Click "Run collection"
3. Select all requests
4. Click "Run WeatherForecast API Collection"
5. Review the test results
```

### Test Scenarios Included

#### 1. **Connectivity Tests**
- **Hello World**: Verifies basic connectivity
- **Test Endpoint**: Confirms minimal API functionality

#### 2. **Weather Forecast CRUD Tests**
- **GET All**: Retrieves and validates forecast list
- **POST Create**: Creates new forecast with validation
- **PUT Update**: Updates existing forecast
- **DELETE**: Removes forecast by date
- **PATCH Generate**: Creates random test data

#### 3. **Automated Validations**
Each request includes automatic tests for:
- **Status codes** (200, 201, 404, etc.)
- **Response time** (< 2000ms)
- **Content type** validation
- **Response data** format validation
- **Specific endpoint** response content

### Example Test Results
```
✓ Status code is success
✓ Response time is less than 2000ms
✓ Response is valid JSON
✓ Hello endpoint returns correct message
✗ Failed test example (if any)
```

## Manual Testing Procedures

### Frontend UI Testing

#### Complete CRUD Workflow Test
1. **Start Application**:
   ```bash
   dotnet run
   ```

2. **Navigate to Weather Forecast Page**:
   - Go to `https://localhost:7039`
   - Click "Fetch data" in navigation

3. **Test Read Operation**:
   - ✅ Verify table displays existing forecasts
   - ✅ Check all columns are populated (Date, Temp C, Temp F, Summary, Actions)
   - ✅ Confirm temperature conversion is correct

4. **Test Generate Operation**:
   - ✅ Click "Generate New Forecast" button
   - ✅ Verify loading state appears
   - ✅ Confirm new random data appears in table
   - ✅ Check success message displays

5. **Test Create Operation**:
   - ✅ Click "Add New Forecast" button
   - ✅ Verify modal opens with empty form
   - ✅ Test form validation:
     - Leave fields empty and submit → Errors should appear
     - Enter invalid temperature → Error should appear
     - Enter duplicate date → Should be handled gracefully
   - ✅ Fill valid data and submit
   - ✅ Verify modal closes and success message appears
   - ✅ Confirm new forecast appears in table

6. **Test Update Operation**:
   - ✅ Click ✏️ edit button on any row
   - ✅ Verify modal opens with pre-filled data
   - ✅ Confirm date field is read-only
   - ✅ Modify temperature and/or summary
   - ✅ Submit changes
   - ✅ Verify modal closes and success message appears
   - ✅ Confirm changes appear in table

7. **Test Delete Operation**:
   - ✅ Click ✕ delete button on any row
   - ✅ Verify confirmation dialog appears
   - ✅ Click "Cancel" → No action should occur
   - ✅ Click ✕ again and confirm deletion
   - ✅ Verify success message appears
   - ✅ Confirm row is removed from table

#### Error Handling Test
1. **Stop Backend Server**:
   - Stop `dotnet run`
   - Keep frontend running

2. **Test Error States**:
   - ✅ Try any operation → Should show error message
   - ✅ Error messages should be user-friendly
   - ✅ UI should not crash or become unresponsive

3. **Restart Backend**:
   - Start `dotnet run` again
   - ✅ Refresh page → Should work normally

### Cross-Browser Testing

#### Browser Compatibility
Test in multiple browsers:
- ✅ **Chrome** (primary development browser)
- ✅ **Firefox**
- ✅ **Edge**
- ✅ **Safari** (if on Mac)

#### Test Checklist per Browser:
- ✅ Application loads correctly
- ✅ Navigation works
- ✅ Modals open and close properly
- ✅ Form submissions work
- ✅ Buttons and interactions respond
- ✅ Styling appears correct

### Responsive Design Testing

#### Screen Sizes to Test:
- ✅ **Desktop**: 1920x1080, 1366x768
- ✅ **Tablet**: 768x1024 (portrait), 1024x768 (landscape)
- ✅ **Mobile**: 375x667 (iPhone), 360x640 (Android)

#### Responsive Checklist:
- ✅ Table scrolls horizontally on mobile
- ✅ Buttons remain accessible
- ✅ Modal fits screen size
- ✅ Navigation collapses appropriately
- ✅ Text remains readable

## API Testing with Browser Tools

### Using Browser DevTools

#### Network Tab Testing:
1. **Open DevTools** (F12) → Network tab
2. **Perform UI actions** and monitor network requests
3. **Verify API calls**:
   - ✅ Correct HTTP methods (GET, POST, PUT, DELETE, PATCH)
   - ✅ Proper request headers
   - ✅ Valid request payloads
   - ✅ Expected response status codes
   - ✅ Correct response data

#### Console Testing:
```javascript
// Test API directly in browser console
fetch('/weatherforecast')
  .then(response => response.json())
  .then(data => console.log('Weather data:', data));

// Test POST operation
fetch('/weatherforecast', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    date: '2025-12-25',
    temperatureC: 20,
    summary: 'Christmas Weather'
  })
}).then(response => console.log('Status:', response.status));
```

### Using curl Commands

#### Quick API Tests:
```bash
# Test GET
curl -X GET "https://localhost:7039/weatherforecast"

# Test POST
curl -X POST "https://localhost:7039/weatherforecast" \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-09-30","temperatureC":25,"summary":"Test"}'

# Test PUT
curl -X PUT "https://localhost:7039/weatherforecast" \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-09-30","temperatureC":30,"summary":"Updated"}'

# Test DELETE
curl -X DELETE "https://localhost:7039/weatherforecast?date=2025-09-30"

# Test PATCH (Generate)
curl -X PATCH "https://localhost:7039/weatherforecast?count=3"

# Test additional endpoints
curl -X GET "https://localhost:7039/hello"
curl -X GET "https://localhost:7039/test"
```

## Performance Testing

### Response Time Testing
- ✅ All API endpoints should respond < 500ms
- ✅ UI interactions should feel responsive
- ✅ Modal animations should be smooth
- ✅ Table updates should be immediate

### Load Testing (Basic)
```bash
# Simple concurrent request test
for i in {1..10}; do
  curl -X GET "https://localhost:7039/weatherforecast" &
done
wait
```

## Test Data Management

### Creating Test Data
```javascript
// Use the generate endpoint to create test data
fetch('/weatherforecast?count=10', { method: 'PATCH' })
  .then(response => response.json())
  .then(data => console.log('Generated:', data.length, 'forecasts'));
```

### Resetting Test Data
Since the app uses in-memory storage:
1. **Restart the application** to reset data
2. **Or create a reset endpoint** (future enhancement)

## Common Test Scenarios

### Edge Cases to Test
1. **Empty Data State**:
   - ✅ Start with fresh app (no data)
   - ✅ Verify empty state displays correctly
   - ✅ Add first item works properly

2. **Large Data Sets**:
   - ✅ Generate 50+ forecasts
   - ✅ Verify table performance
   - ✅ Test scrolling behavior

3. **Invalid Data**:
   - ✅ Submit forms with invalid dates
   - ✅ Use extreme temperature values
   - ✅ Submit very long summary text

4. **Network Issues**:
   - ✅ Slow network simulation
   - ✅ Interrupted requests
   - ✅ Server errors (stop backend mid-request)

### Integration Test Workflow
```
1. Fresh application start
2. Verify empty/initial state
3. Generate test data
4. Perform complete CRUD cycle
5. Verify data persistence during session
6. Test error scenarios
7. Verify recovery from errors
```

## Debugging Failed Tests

### Common Issues and Solutions

#### 1. **API Connection Errors**
- ✅ Verify backend is running (`dotnet run`)
- ✅ Check correct port in Postman (`baseUrl` variable)
- ✅ Confirm HTTPS/HTTP settings

#### 2. **Frontend Not Loading**
- ✅ Check browser console for errors
- ✅ Verify proxy configuration in `setupProxy.js`
- ✅ Clear browser cache and cookies

#### 3. **Modal/Form Issues**
- ✅ Check browser console for JavaScript errors
- ✅ Verify Bootstrap CSS is loading
- ✅ Test in different browsers

#### 4. **Data Not Updating**
- ✅ Check Network tab for API calls
- ✅ Verify response status codes
- ✅ Check state management in React components

### Component Architecture Testing

The application now uses a modular component architecture. When testing, pay attention to:

#### **Component Interaction**
- **FetchData ↔ WeatherForecastModal**: 
  - ✅ Modal opens/closes correctly from main component
  - ✅ Data passes correctly between components via props
  - ✅ Form submission triggers parent component updates
  - ✅ Success/error messages appear in correct component

#### **Component Isolation**
- **WeatherForecastModal Testing**:
  - ✅ Modal handles its own form validation
  - ✅ Form data resets properly when modal closes
  - ✅ Edit mode pre-fills data correctly
  - ✅ Loading states work independently

#### **State Management**
- **FetchData State**:
  - ✅ Forecast data management
  - ✅ Loading states
  - ✅ Success/error messages
  - ✅ Modal visibility control

- **WeatherForecastModal State**:
  - ✅ Form data handling
  - ✅ Validation error display
  - ✅ Input change tracking

#### **Browser Developer Tools Testing**
```javascript
// Test component props in browser console:
// 1. Open React Developer Tools
// 2. Find WeatherForecastModal component
// 3. Check props:
//    - isVisible: boolean
//    - isEditMode: boolean  
//    - forecast: object (when editing)
//    - onSubmit: function
//    - onClose: function
```

## Test Reporting

### Manual Test Report Template
```
Test Date: [Date]
Tester: [Name]
Environment: [Browser/OS]
Application Version: [Version/Commit]

✅ PASSED Tests:
- [List successful tests]

❌ FAILED Tests:
- [List failed tests with details]

🐛 Issues Found:
- [Describe any bugs or problems]

📝 Notes:
- [Additional observations]
```

## Next Steps

After testing:
1. **Document any issues** found during testing
2. **Update test procedures** if new features are added
3. **Review configuration** if environment issues occur
4. **Check troubleshooting guide** for known solutions

---

**Found issues during testing?** Check the [Troubleshooting Guide](troubleshooting.md) for solutions to common problems.