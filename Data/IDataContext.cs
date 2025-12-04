using CoolApp.Models;

namespace CoolApp.Data;

public interface IDataContext
{
    ICollection<WeatherForecast> WeatherForecasts { get; }
    ICollection<WeatherForecast> SecondSourceForecasts { get; } 
}
