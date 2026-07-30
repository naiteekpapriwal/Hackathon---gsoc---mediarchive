import React, { useState } from 'react';
import './UploadRecord.css';

export default function UploadRecord() {
  const [formData, setFormData] = useState({
    recordType: 'consultation',
    date: new Date().toISOString().split('T')[0],
    doctorName: '',
    hospitalName: '',
    diagnosis: '',
    notes: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files).map(file => ({
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setSelectedFiles(prev => [...prev, ...fileArray]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please upload at least one file');
      return;
    }

    // Simulate upload
    alert(`Record Upload Successful!\n\nType: ${formData.recordType}\nDate: ${formData.date}\nDoctor: ${formData.doctorName}\nFiles: ${selectedFiles.length}\n\nYour medical record has been uploaded and will be added to your medical history.`);
    
    // Reset form
    setFormData({
      recordType: 'consultation',
      date: new Date().toISOString().split('T')[0],
      doctorName: '',
      hospitalName: '',
      diagnosis: '',
      notes: ''
    });
    setSelectedFiles([]);
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    } else if (type === 'application/pdf') {
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M14 2v6h6M10 13h4M10 17h4M10 9h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    } else {
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13 2v7h7" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      );
    }
  };

  return (
    <div className="upload-record">
      <div className="upload-header">
        <h2>Upload Medical Record</h2>
        <p className="upload-subtitle">Add new medical records, reports, or prescriptions to your health archive</p>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Record Type */}
          <div className="form-field">
            <label>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Record Type
            </label>
            <select 
              name="recordType" 
              value={formData.recordType} 
              onChange={handleInputChange}
              required
            >
              <option value="consultation">Consultation Report</option>
              <option value="prescription">Prescription</option>
              <option value="lab">Lab Report</option>
              <option value="imaging">Imaging (X-Ray, MRI, CT Scan)</option>
              <option value="surgery">Surgery Report</option>
              <option value="vaccination">Vaccination Record</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date */}
          <div className="form-field">
            <label>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Date of Record
            </label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Doctor Name */}
          <div className="form-field">
            <label>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Doctor Name (Optional)
            </label>
            <input 
              type="text" 
              name="doctorName" 
              value={formData.doctorName} 
              onChange={handleInputChange}
              placeholder="Enter doctor's name"
            />
          </div>

          {/* Hospital Name */}
          <div className="form-field">
            <label>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Hospital/Clinic Name (Optional)
            </label>
            <input 
              type="text" 
              name="hospitalName" 
              value={formData.hospitalName} 
              onChange={handleInputChange}
              placeholder="Enter hospital or clinic name"
            />
          </div>
        </div>

        {/* Diagnosis */}
        <div className="form-field full-width">
          <label>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Diagnosis/Description (Optional)
          </label>
          <input 
            type="text" 
            name="diagnosis" 
            value={formData.diagnosis} 
            onChange={handleInputChange}
            placeholder="Brief description of diagnosis or condition"
          />
        </div>

        {/* Notes */}
        <div className="form-field full-width">
          <label>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Additional Notes (Optional)
          </label>
          <textarea 
            name="notes" 
            value={formData.notes} 
            onChange={handleInputChange}
            placeholder="Add any additional information or notes"
            rows="4"
          />
        </div>

        {/* File Upload Area */}
        <div className="form-field full-width">
          <label>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upload Files *
          </label>
          
          <div 
            className={`file-drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="drop-text">Drag & drop files here</p>
            <p className="drop-subtext">or</p>
            <label className="browse-btn">
              Browse Files
              <input 
                type="file" 
                onChange={handleFileInput}
                accept="image/*,.pdf,.doc,.docx"
                multiple
                hidden
              />
            </label>
            <p className="file-info">Supported formats: JPG, PNG, PDF, DOC (Max 10MB per file)</p>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="selected-files">
            <h4>Selected Files ({selectedFiles.length})</h4>
            <div className="files-grid">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  {file.preview ? (
                    <div className="file-preview">
                      <img src={file.preview} alt={file.name} />
                    </div>
                  ) : (
                    <div className="file-icon">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <div className="file-details">
                    <p className="file-name" title={file.name}>{file.name}</p>
                    <p className="file-size">{file.size}</p>
                  </div>
                  <button 
                    type="button"
                    className="remove-file-btn" 
                    onClick={() => removeFile(index)}
                    title="Remove file"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => window.history.back()}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upload Record
          </button>
        </div>
      </form>
    </div>
  );
}
