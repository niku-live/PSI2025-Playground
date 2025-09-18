import React, { Component } from 'react';

export class WeatherForecastModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        date: '',
        temperatureC: '',
        summary: ''
      },
      validationErrors: {}
    };
  }

  componentDidMount() {
    // Initialize form data when component mounts
    this.updateFormData();
  }

  componentDidUpdate(prevProps) {
    // Update form data when props change (e.g., when switching between add/edit modes)
    if (prevProps.forecast !== this.props.forecast || 
        prevProps.isEditMode !== this.props.isEditMode ||
        prevProps.isVisible !== this.props.isVisible) {
      this.updateFormData();
    }
  }

  updateFormData() {
    if (this.props.isEditMode && this.props.forecast) {
      this.setState({
        formData: {
          date: this.props.forecast.date,
          temperatureC: this.props.forecast.temperatureC.toString(),
          summary: this.props.forecast.summary
        },
        validationErrors: {}
      });
    } else if (!this.props.isEditMode) {
      this.setState({
        formData: {
          date: '',
          temperatureC: '',
          summary: ''
        },
        validationErrors: {}
      });
    }
  }

  handleInputChange = (field, value) => {
    this.setState({
      formData: { ...this.state.formData, [field]: value },
      validationErrors: { ...this.state.validationErrors, [field]: '' }
    });
  }

  validateForm = () => {
    const errors = {};
    const { date, temperatureC, summary } = this.state.formData;

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

  handleSubmit = () => {
    const errors = this.validateForm();
    
    if (Object.keys(errors).length > 0) {
      this.setState({ validationErrors: errors });
      return;
    }

    // Convert temperatureC to number and call parent's submit handler
    const submissionData = {
      ...this.state.formData,
      temperatureC: parseInt(this.state.formData.temperatureC)
    };

    this.props.onSubmit(submissionData);
  }

  handleClose = () => {
    this.setState({
      formData: {
        date: '',
        temperatureC: '',
        summary: ''
      },
      validationErrors: {}
    });
    this.props.onClose();
  }

  render() {
    if (!this.props.isVisible) return null;

    const { isEditMode } = this.props;
    const { formData, validationErrors } = this.state;

    return (
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditMode ? 'Edit Weather Forecast' : 'Add New Weather Forecast'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={this.handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); this.handleSubmit(); }}>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input 
                    type="date" 
                    className={`form-control ${validationErrors.date ? 'is-invalid' : ''}`}
                    value={formData.date}
                    onChange={(e) => this.handleInputChange('date', e.target.value)}
                    readOnly={isEditMode}
                  />
                  {validationErrors.date && (
                    <div className="invalid-feedback">{validationErrors.date}</div>
                  )}
                  {isEditMode && (
                    <div className="form-text">Date cannot be changed when editing.</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Temperature (°C)</label>
                  <input 
                    type="number" 
                    className={`form-control ${validationErrors.temperatureC ? 'is-invalid' : ''}`}
                    value={formData.temperatureC}
                    onChange={(e) => this.handleInputChange('temperatureC', e.target.value)}
                    placeholder="Enter temperature in Celsius"
                  />
                  {validationErrors.temperatureC && (
                    <div className="invalid-feedback">{validationErrors.temperatureC}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Summary</label>
                  <input 
                    type="text" 
                    className={`form-control ${validationErrors.summary ? 'is-invalid' : ''}`}
                    value={formData.summary}
                    onChange={(e) => this.handleInputChange('summary', e.target.value)}
                    placeholder="Enter weather summary"
                    maxLength="100"
                  />
                  {validationErrors.summary && (
                    <div className="invalid-feedback">{validationErrors.summary}</div>
                  )}
                  <div className="form-text">
                    {formData.summary.length}/100 characters
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={this.handleClose}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={this.handleSubmit}
                disabled={this.props.isSubmitting}
              >
                {this.props.isSubmitting 
                  ? (isEditMode ? 'Updating...' : 'Adding...') 
                  : (isEditMode ? 'Update Forecast' : 'Add Forecast')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}