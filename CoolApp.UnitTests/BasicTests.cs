namespace CoolApp.UnitTests;

[TestClass]
public sealed class BasicTests
{
    [TestMethod]
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
        Assert.AreEqual(211, temperatureF);
    }
}
