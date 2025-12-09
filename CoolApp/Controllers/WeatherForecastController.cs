using Microsoft.AspNetCore.Mvc;
using CoolApp.Models;
using CoolApp.Data;

namespace CoolApp.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;
    private readonly IDataContext _dataContext;

    public WeatherForecastController(IDataContext dataContext, ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
        _dataContext = dataContext;
    }

    [HttpGet]
    public IEnumerable<WeatherForecast> Get()
    {
        return _dataContext.WeatherForecasts;
    }

    [HttpPost]
    public WeatherForecast Create(WeatherForecast forecast)
    {
        _dataContext.WeatherForecasts.Add(forecast)
        return forecast;
    }

    [HttpPut]
    public WeatherForecast Update(WeatherForecast forecast)
    {
        var existing = _dataContext.WeatherForecasts.FirstOrDefault(wf => wf.Date == forecast.Date);
        if (existing != null)
        {
            existing.TemperatureC = forecast.TemperatureC;
            existing.Summary = forecast.Summary;
        }
        else
        {
            existing = forecast;
            _dataContext.WeatherForecasts.Add(existing);
        }
        return existing;
    }

    [HttpDelete]
    public IActionResult Delete(DateOnly date)
    {
        var existing = _dataContext.WeatherForecasts.FirstOrDefault(wf => wf.Date == date);
        if (existing != null)
        {
            _dataContext.WeatherForecasts.Remove(existing);
            return Ok();
        }
        return NotFound();
    }

    [HttpPatch]
    public IEnumerable<WeatherForecast> Generate(int count = 5)
    {
        var generatedList = Enumerable.Range(1, count).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        }).ToArray();

        foreach (var item in generatedList)
        {
            _dataContext.WeatherForecasts.Add(item);
        }

        return generatedList;
    }
}
