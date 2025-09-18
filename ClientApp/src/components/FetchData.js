import React, { Component } from 'react';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { 
      forecasts: [], 
      loading: true,
      showModal: false,
      newForecast: {
        date: '',
        temperatureC: '',
        summary: ''
      },
      successMessage: '',
      validationErrors: {},
      errorMessage: '',
      isEditMode: false,
      editingForecast: null
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
        
        {this.renderModal()}
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

  openModal() {
    this.setState({ 
      showModal: true, 
      newForecast: { date: '', temperatureC: '', summary: '' },
      validationErrors: {},
      successMessage: '',
      errorMessage: '',
      isEditMode: false,
      editingForecast: null
    });
  }

  editForecast(forecast) {
    this.setState({
      showModal: true,
      newForecast: {
        date: forecast.date,
        temperatureC: forecast.temperatureC.toString(),
        summary: forecast.summary
      },
      validationErrors: {},
      successMessage: '',
      errorMessage: '',
      isEditMode: true,
      editingForecast: forecast
    });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  handleInputChange(field, value) {
    this.setState({
      newForecast: { ...this.state.newForecast, [field]: value },
      validationErrors: { ...this.state.validationErrors, [field]: '' }
    });
  }

  validateForm() {
    const errors = {};
    const { date, temperatureC, summary } = this.state.newForecast;

    if (!date) {
      errors.date = 'Date is required';
    }

    if (!temperatureC || temperatureC === '') {
      errors.temperatureC = 'Temperature is required';
    } else if (isNaN(temperatureC)) {
      errors.temperatureC = 'Temperature must be a number';
    }

    if (!summary || summary.trim() === '') {
      errors.summary = 'Summary is required';
    }

    return errors;
  }

  async addWeatherData() {
    const errors = this.validateForm();
    
    if (Object.keys(errors).length > 0) {
      this.setState({ validationErrors: errors });
      return;
    }

    try {
      const url = this.state.isEditMode ? 'weatherforecast' : 'weatherforecast';
      const method = this.state.isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: this.state.newForecast.date,
          temperatureC: parseInt(this.state.newForecast.temperatureC),
          summary: this.state.newForecast.summary
        })
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

  renderModal() {
    if (!this.state.showModal) return null;

    return (
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {this.state.isEditMode ? 'Edit Weather Forecast' : 'Add New Weather Forecast'}
              </h5>
              <button type="button" className="btn-close" onClick={() => this.closeModal()}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input 
                    type="date" 
                    className={`form-control ${this.state.validationErrors.date ? 'is-invalid' : ''}`}
                    value={this.state.newForecast.date}
                    onChange={(e) => this.handleInputChange('date', e.target.value)}
                    readOnly={this.state.isEditMode}
                  />
                  {this.state.validationErrors.date && (
                    <div className="invalid-feedback">{this.state.validationErrors.date}</div>
                  )}
                  {this.state.isEditMode && (
                    <div className="form-text">Date cannot be changed when editing.</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Temperature (°C)</label>
                  <input 
                    type="number" 
                    className={`form-control ${this.state.validationErrors.temperatureC ? 'is-invalid' : ''}`}
                    value={this.state.newForecast.temperatureC}
                    onChange={(e) => this.handleInputChange('temperatureC', e.target.value)}
                  />
                  {this.state.validationErrors.temperatureC && (
                    <div className="invalid-feedback">{this.state.validationErrors.temperatureC}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Summary</label>
                  <input 
                    type="text" 
                    className={`form-control ${this.state.validationErrors.summary ? 'is-invalid' : ''}`}
                    value={this.state.newForecast.summary}
                    onChange={(e) => this.handleInputChange('summary', e.target.value)}
                    placeholder="Enter weather summary"
                  />
                  {this.state.validationErrors.summary && (
                    <div className="invalid-feedback">{this.state.validationErrors.summary}</div>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => this.closeModal()}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={() => this.addWeatherData()}>
                {this.state.isEditMode ? 'Update Forecast' : 'Add Forecast'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
