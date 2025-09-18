import React, { Component } from 'react';
import { WeatherForecastModal } from './WeatherForecastModal';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { 
      forecasts: [], 
      loading: true,
      showModal: false,
      successMessage: '',
      errorMessage: '',
      isEditMode: false,
      editingForecast: null,
      isSubmitting: false
    };
  }

  componentDidMount() {
    this.populateWeatherData();
  }

  renderForecastsTable(forecasts) {
    return (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
              <td>
                <button 
                  className="btn btn-warning btn-sm me-1"
                  onClick={() => this.editForecast(forecast)}
                  title="Edit forecast"
                >
                  ✏️
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => this.deleteForecast(forecast.date)}
                  title="Delete forecast"
                >
                  ✕
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderForecastsTable(this.state.forecasts);

    return (
      <div>
        <h1 id="tableLabel">Weather forecast</h1>
        <p>This component demonstrates fetching data from the server (Test).</p>
        
        {this.state.successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {this.state.successMessage}
            <button type="button" className="btn-close" onClick={() => this.setState({ successMessage: '' })}></button>
          </div>
        )}
        
        {this.state.errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {this.state.errorMessage}
            <button type="button" className="btn-close" onClick={() => this.setState({ errorMessage: '' })}></button>
          </div>
        )}
        
        <div className="mb-3">
          <button 
            className="btn btn-primary me-2" 
            onClick={() => this.generateWeatherData()}
            disabled={this.state.loading}
          >
            {this.state.loading ? 'Generating...' : 'Generate New Forecast'}
          </button>
          <button 
            className="btn btn-success" 
            onClick={() => this.openModal()}
            disabled={this.state.loading}
          >
            Add New Forecast
          </button>
        </div>
        {contents}
        
        <WeatherForecastModal
          isVisible={this.state.showModal}
          isEditMode={this.state.isEditMode}
          forecast={this.state.editingForecast}
          isSubmitting={this.state.isSubmitting}
          onSubmit={this.handleModalSubmit}
          onClose={this.closeModal}
        />
      </div>
    );
  }

  async populateWeatherData() {
    const response = await fetch('weatherforecast');
    const data = await response.json();
    this.setState({ forecasts: data, loading: false });
  }

  async generateWeatherData() {
    this.setState({ loading: true });
    const response = await fetch('weatherforecast?count=7', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    this.setState({ forecasts: data, loading: false });
  }

  openModal = () => {
    this.setState({ 
      showModal: true, 
      successMessage: '',
      errorMessage: '',
      isEditMode: false,
      editingForecast: null
    });
  }

  editForecast = (forecast) => {
    this.setState({
      showModal: true,
      successMessage: '',
      errorMessage: '',
      isEditMode: true,
      editingForecast: forecast
    });
  }

  closeModal = () => {
    this.setState({ 
      showModal: false,
      isEditMode: false,
      editingForecast: null,
      isSubmitting: false
    });
  }

  handleModalSubmit = async (formData) => {
    this.setState({ isSubmitting: true });
    
    try {
      const url = 'weatherforecast';
      const method = this.state.isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        this.closeModal();
        const message = this.state.isEditMode 
          ? 'Weather forecast updated successfully!' 
          : 'Weather forecast added successfully!';
        this.setState({ successMessage: message, errorMessage: '' });
        this.populateWeatherData(); // Refresh the table
      } else {
        const message = this.state.isEditMode 
          ? 'Failed to update weather forecast. Please try again.' 
          : 'Failed to add weather forecast. Please try again.';
        this.setState({ errorMessage: message });
      }
    } catch (error) {
      console.error('Error saving weather data:', error);
      const message = this.state.isEditMode 
        ? 'Error updating weather forecast. Please try again.' 
        : 'Error adding weather forecast. Please try again.';
      this.setState({ errorMessage: message });
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  async deleteForecast(date) {
    if (window.confirm(`Are you sure you want to delete the forecast for ${date}?`)) {
      try {
        const response = await fetch(`weatherforecast?date=${date}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          this.setState({ 
            successMessage: 'Weather forecast deleted successfully!', 
            errorMessage: '' 
          });
          this.populateWeatherData(); // Refresh the table
        } else {
          this.setState({ errorMessage: 'Failed to delete weather forecast. Please try again.' });
        }
      } catch (error) {
        console.error('Error deleting weather data:', error);
        this.setState({ errorMessage: 'Error deleting weather forecast. Please try again.' });
      }
    }
  }
}
