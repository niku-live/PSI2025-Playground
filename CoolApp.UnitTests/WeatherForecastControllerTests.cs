using CoolApp.Data;
using Microsoft.Extensions.Logging;
using Moq;

namespace CoolApp.UnitTests;

public sealed class WeatherForecastControllerTests
{
    [Fact]
    public void Test_UpdateWithEmptyCollection()
    {
        // Arrange
        var logger = new Mock<ILogger<CoolApp.Controllers.WeatherForecastController>>();
        var context = new FakeDataContext();
        var controller = new CoolApp.Controllers.WeatherForecastController(
            context,
            logger.Object);
        var forecast = new CoolApp.Models.WeatherForecast
        {
            Date = new DateOnly(2024, 1, 1),
            TemperatureC = 20,
            Summary = "Warm"
        };

        // Act
        controller.Update(forecast);        

        // Assert        
        Assert.Single(context.WeatherForecasts);
        Assert.Equal(forecast.Date, context.WeatherForecasts.First().Date);
        Assert.Equal(forecast.Summary, context.WeatherForecasts.First().Summary);
    }

    [Fact]
    public void Test_UpdateWhenEntryExists()
    {
        // Arrange
        var logger = new Mock<ILogger<CoolApp.Controllers.WeatherForecastController>>();
        var context = new FakeDataContext();
        var controller = new CoolApp.Controllers.WeatherForecastController(
            context,
            logger.Object);
        var forecast = new CoolApp.Models.WeatherForecast
        {
            Date = new DateOnly(2024, 1, 1),
            TemperatureC = 20,
            Summary = "Warm"
        };
        context.WeatherForecasts.Add(new CoolApp.Models.WeatherForecast
        {
            Date = new DateOnly(2024, 1, 1),
            TemperatureC = 15,
            Summary = "Cool"
        });

        // Act
        controller.Update(forecast);        

        // Assert        
        Assert.Single(context.WeatherForecasts);
        Assert.Equal(forecast.Date, context.WeatherForecasts.First().Date);
        Assert.Equal(forecast.Summary, context.WeatherForecasts.First().Summary);
    }
}
