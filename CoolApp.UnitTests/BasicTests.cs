namespace CoolApp.UnitTests;

public sealed class BasicTests
{
    [Fact]
    public void Test_TemperatureCalculation()
    {
        // Arrange
        var forecast = new CoolApp.Models.WeatherForecast
        {
            TemperatureC = 100
        };

        // Act
        var temperatureF = forecast.TemperatureF;

        // Assert        
        Assert.Equal(211, temperatureF);
    }
}
