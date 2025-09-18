using CoolApp.Models;

namespace CoolApp.Data;

public class FakeDataContext : IDataContext
{
    public ICollection<WeatherForecast> WeatherForecasts { get; private set; } = new List<WeatherForecast>();
}