// Resume Builder Main JS
console.log('Builder.js loaded successfully!');

// Data store for all form fields - global scope
let resumeData = {
    'user-info': {},
    'about': {},
    'education': {},
    'skills': {},
    'experience': {},
  };
  let currentSection = 'user-info';

document.addEventListener('DOMContentLoaded', () => {
  // Sidebar navigation
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      saveCurrentSection();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const section = link.getAttribute('href').substring(1);
      currentSection = section;
      renderForm(section);
    });
  });

  // Template switching
  const templateBtns = document.querySelectorAll('.template-btn');
  templateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      templateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPreview();
    });
  });

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
    }
  }

  // Download PDF button
  const downloadPdfBtn = document.getElementById('download-pdf');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      saveCurrentSection();
      renderPreview();
      downloadPDF();
    });
  }

  // Initial render
  renderForm(currentSection);
    renderPreview();
  if (templateBtns[0]) templateBtns[0].classList.add('active');
  // Responsive: scale resume preview on small screens
  setupResponsiveScale();
});

// Render form based on current section
  function renderForm(section) {
    const formSection = document.getElementById('form-section');
  const data = resumeData[section] || {};
    let html = '';

    switch(section) {
      case 'user-info':
        html = `<h2>User Info</h2>
          <form>
          <label>Profile Picture
            <div class="photo-upload-container">
              <input type="file" id="profilePicture" accept="image/*" style="display: none;" />
              <div class="photo-preview" id="photoPreview">
                <img id="previewImage" src="${data.profilePicture || ''}" alt="Profile" style="display: ${data.profilePicture ? 'block' : 'none'};" />
                <div class="upload-placeholder" id="uploadPlaceholder" style="display: ${data.profilePicture ? 'none' : 'flex'};">
                  <span>📷</span>
                  <span>Click to upload photo</span>
                </div>
              </div>
              <button type="button" class="upload-btn" onclick="document.getElementById('profilePicture').click()">Choose Photo</button>
              <button type="button" class="remove-btn" id="removePhoto" style="display: ${data.profilePicture ? 'block' : 'none'};" onclick="removeProfilePhoto()">Remove</button>
            </div>
          </label>
            <label>Full Name<input type="text" id="fullName" value="${data.fullName || ''}" placeholder="John Doe" /></label>
            <label>Email<input type="email" id="email" value="${data.email || ''}" placeholder="john@example.com" /></label>
            <label>Phone<input type="text" id="phone" value="${data.phone || ''}" placeholder="(555) 123-4567" /></label>
            <label>Location<input type="text" id="location" value="${data.location || ''}" placeholder="City, State" /></label>
            <label>LinkedIn<input type="url" id="linkedin" value="${data.linkedin || ''}" placeholder="linkedin.com/in/username" /></label>
            <label>Website<input type="url" id="website" value="${data.website || ''}" placeholder="yourwebsite.com" /></label>
          </form>`;
        break;
      case 'about':
        html = `<h2>About Me</h2>
          <form>
            <label>Summary/About Me<textarea id="aboutMe">${data.aboutMe || ''}</textarea></label>
          </form>`;
        break;
      case 'education':
        html = `<h2>Education</h2>
          <form>
            <label>School<input type="text" id="school" value="${data.school || ''}" /></label>
            <label>Degree<input type="text" id="degree" value="${data.degree || ''}" /></label>
            <label>Year<input type="text" id="gradYear" value="${data.gradYear || ''}" /></label>
          </form>`;
        break;
      case 'skills':
        html = `<h2>Skills</h2>
          <form>
            <label>Skills<textarea id="skills">${data.skills || ''}</textarea></label>
          </form>`;
        break;
      case 'experience':
        html = `<h2>Experience</h2>
          <form>
            <label>Company<input type="text" id="company" value="${data.company || ''}" placeholder="Tech Corp" /></label>
            <label>Role<input type="text" id="role" value="${data.role || ''}" placeholder="Frontend Developer" /></label>
            <label>Duration<input type="text" id="years" value="${data.years || ''}" placeholder="2021-2023" /></label>
            <label>Description<textarea id="description" placeholder="Describe your responsibilities and achievements...">${data.description || ''}</textarea></label>
          </form>`;
        break;
      case 'templates':
        html = `<h2>Templates</h2>
          <p>Switch templates using the buttons above the preview.</p>`;
        break;
      default:
        html = '';
    }
  
    formSection.innerHTML = html;

    // Add input listeners to update preview and save data
    formSection.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        saveCurrentSection();
        renderPreview();
      });
    });

  // Add photo upload functionality
  const profilePictureInput = formSection.querySelector('#profilePicture');
  if (profilePictureInput) {
    profilePictureInput.addEventListener('change', handlePhotoUpload);
  }

  // Load saved photo data if this is the user-info section
  if (currentSection === 'user-info') {
    loadSavedPhotoData();
  }
  }

  // Save current section's form data
  function saveCurrentSection() {
    const formSection = document.getElementById('form-section');
    if (!formSection) return;
    const inputs = formSection.querySelectorAll('input, textarea');
    if (!inputs.length) return;
    const data = {};
    inputs.forEach(input => {
      data[input.id] = input.value;
    });
  
  // If this is the user-info section, also include the profile picture data
  if (currentSection === 'user-info') {
    const userData = JSON.parse(localStorage.getItem('resumeData') || '{}');
    if (userData.user && userData.user.profilePicture) {
      data.profilePicture = userData.user.profilePicture;
    }
  }
  
    resumeData[currentSection] = data;
  }

  // Render preview using all data
  function renderPreview() {
    const preview = document.getElementById('resume-preview');
    const user = resumeData['user-info'] || {};
    const about = resumeData['about'] || {};
    const edu = resumeData['education'] || {};
    const skills = resumeData['skills'] || {};
    const exp = resumeData['experience'] || {};
  
  // Check localStorage for profile picture if not in resumeData
  if (!user.profilePicture) {
    const userData = JSON.parse(localStorage.getItem('resumeData') || '{}');
    if (userData.user && userData.user.profilePicture) {
      user.profilePicture = userData.user.profilePicture;
    }
  }
    
    // Get current template
    const activeTemplate = document.querySelector('.template-btn.active');
    const templateNum = activeTemplate ? activeTemplate.dataset.template : '1';
    
  // Build contact info string
    const contactParts = [];
    if (user.email) contactParts.push(user.email);
    if (user.phone) contactParts.push(user.phone);
    if (user.location) contactParts.push(user.location);
    
    let contactInfo = contactParts.length > 0 ? contactParts.join(' | ') : 'john@example.com | (555) 123-4567';
    
    if (contactInfo.length > 60) {
      const parts = contactInfo.split(' | ');
      if (parts.length >= 3) {
        contactInfo = parts.slice(0, 2).join(' | ') + '<br>' + parts.slice(2).join(' | ');
      }
    }
    
    // Build additional links
    const links = [];
    if (user.linkedin) links.push(`<a href="${user.linkedin}" target="_blank">LinkedIn</a>`);
    if (user.website) links.push(`<a href="${user.website}" target="_blank">Website</a>`);
    const linksHtml = links.length > 0 ? `<div class="links">${links.join(' | ')}</div>` : '';
    
    let templateHTML = '';
    
    switch(templateNum) {
      case '1': // Modern Professional
        templateHTML = `
          <div class="resume-template template-1">
            <div class="header">
              <h1 class="name">${user.fullName || 'John Doe'}</h1>
              <div class="contact-info">${contactInfo}</div>
              <div class="links-section">${linksHtml}</div>
            </div>
            <div class="section">
              <h2 class="section-title">About Me</h2>
              <div class="content">${about.aboutMe || 'A passionate professional seeking new opportunities.'}</div>
            </div>
            <div class="section">
              <h2 class="section-title">Education</h2>
              <div class="content">${edu.degree || 'B.Sc. Computer Science'}, ${edu.school || 'Sample University'} (${edu.gradYear || '2023'})</div>
            </div>
            <div class="section">
              <h2 class="section-title">Skills</h2>
              <div class="content">${skills.skills || 'JavaScript, HTML, CSS'}</div>
            </div>
                          <div class="section">
                <h2 class="section-title">Experience</h2>
                <div class="content">
                  <strong>${exp.role || 'Frontend Developer'}</strong> at ${exp.company || 'Tech Corp'} (${exp.years || '2021-2023'})
                  ${exp.description ? `<br><br>${exp.description}` : ''}
                </div>
              </div>
          </div>
        `;
        break;
        
         case '2': // Professional
        templateHTML = `
          <div class="resume-template template-2">
           <div class="top-decoration"></div>
           <div class="header">
             <div class="profile-section">
               ${user.profilePicture ? `<img src="${user.profilePicture}" alt="Profile" class="profile-picture">` : ''}
               <h1 class="name">${user.fullName || 'Your Name'}</h1>
             </div>
            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-icon">📍</span>
                <span>${user.location || 'Your Location'}</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <span>${user.phone || 'Your Phone'}</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">✉️</span>
                <span>${user.email || 'your.email@example.com'}</span>
              </div>
              ${user.linkedin ? `<div class="contact-item">
                <span class="contact-icon">🔗</span>
                <span>${user.linkedin}</span>
              </div>` : ''}
              ${user.website ? `<div class="contact-item">
                <span class="contact-icon">🌐</span>
                <span>${user.website}</span>
              </div>` : ''}
            </div>
          </div>
          
              <div class="section">
            <h2 class="section-title">SUMMARY</h2>
                <div class="content">${about.aboutMe || 'A passionate professional seeking new opportunities.'}</div>
              </div>
          
              <div class="section">
            <h2 class="section-title">SKILLS</h2>
            <div class="skills-grid">
              ${skills.skills ? skills.skills.split(',').map(skill => `
                <div class="skill-item">
                  <span class="skill-bullet"></span>
                  <span>${skill.trim()}</span>
                </div>
              `).join('') : `
                <div class="skill-item">
                  <span class="skill-bullet"></span>
                  <span>Skill 1</span>
                </div>
                <div class="skill-item">
                  <span class="skill-bullet"></span>
                  <span>Skill 2</span>
              </div>
                <div class="skill-item">
                  <span class="skill-bullet"></span>
                  <span>Skill 3</span>
                </div>
              `}
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">EXPERIENCE</h2>
            <div class="experience-item">
              <div class="job-title">${exp.role || 'Your Job Title'}, ${exp.years || 'Duration'}</div>
              <div class="job-details">${exp.company || 'Company Name'}, ${exp.location || 'Location'}</div>
              <div class="job-description">
                ${exp.description || '• Add your job responsibilities and achievements here<br>• Include quantifiable results when possible<br>• Highlight relevant skills and experiences'}
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">EDUCATION</h2>
            <div class="content">
              <strong>${edu.degree || 'Your Degree'}</strong>, ${edu.school || 'School/University'} (${edu.gradYear || 'Graduation Year'})
              </div>
            </div>
          </div>
        `;
        break;
        
      case '3': // Creative Modern
        templateHTML = `
          <div class="resume-template template-3">
            <div class="header">
              <h1 class="name">${user.fullName || 'John Doe'}</h1>
              <p class="title">${exp.role || 'Frontend Developer'}</p>
            <div class="contact-info">${contactInfo}</div>
            <div class="links">${linksHtml}</div>
            </div>
            <div class="section">
              <h2 class="section-title">About Me</h2>
              <div class="content">${about.aboutMe || 'A passionate professional seeking new opportunities.'}</div>
            </div>
          <div class="section">
            <h2 class="section-title">Experience</h2>
            <div class="content">
              <strong>${exp.role || 'Frontend Developer'}</strong> at ${exp.company || 'Tech Corp'} (${exp.years || '2021-2023'})
              ${exp.description ? `<br><br>${exp.description}` : ''}
            </div>
          </div>
            <div class="section">
              <h2 class="section-title">Education</h2>
              <div class="content">${edu.degree || 'B.Sc. Computer Science'}, ${edu.school || 'Sample University'} (${edu.gradYear || '2023'})</div>
            </div>
            <div class="section">
              <h2 class="section-title">Skills</h2>
              <div class="content">${skills.skills || 'JavaScript, HTML, CSS'}</div>
            </div>
          </div>
        `;
        break;
        
      case '4': // Minimalist
        templateHTML = `
          <div class="resume-template template-4">
            <div class="header">
              <h1 class="name">${user.fullName || 'John Doe'}</h1>
            <div class="contact-info">${contactInfo}</div>
            <div class="links">${linksHtml}</div>
            </div>
            <div class="section">
              <h2 class="section-title">About Me</h2>
              <div class="content">${about.aboutMe || 'A passionate professional seeking new opportunities.'}</div>
            </div>
          <div class="section">
            <h2 class="section-title">Experience</h2>
            <div class="content">
              <strong>${exp.role || 'Frontend Developer'}</strong> at ${exp.company || 'Tech Corp'} (${exp.years || '2021-2023'})
              ${exp.description ? `<br><br>${exp.description}` : ''}
            </div>
          </div>
            <div class="section">
              <h2 class="section-title">Education</h2>
              <div class="content">${edu.degree || 'B.Sc. Computer Science'}, ${edu.school || 'Sample University'} (${edu.gradYear || '2023'})</div>
            </div>
            <div class="section">
              <h2 class="section-title">Skills</h2>
              <div class="content">${skills.skills || 'JavaScript, HTML, CSS'}</div>
            </div>
          </div>
        `;
        break;
        
      case '5': // Corporate
        templateHTML = `
          <div class="resume-template template-5">
            <div class="header">
              <h1 class="name">${user.fullName || 'John Doe'}</h1>
              <p class="title">${exp.role || 'Frontend Developer'}</p>
            <div class="contact-info">${contactInfo}</div>
            <div class="links">${linksHtml}</div>
            </div>
            <div class="body">
              <div class="section">
                <h2 class="section-title">About Me</h2>
                <div class="content">${about.aboutMe || 'A passionate professional seeking new opportunities.'}</div>
              </div>
              <div class="section">
                <h2 class="section-title">Experience</h2>
                <div class="content">
                  <strong>${exp.role || 'Frontend Developer'}</strong> at ${exp.company || 'Tech Corp'} (${exp.years || '2021-2023'})
                  ${exp.description ? `<br><br>${exp.description}` : ''}
                </div>
            </div>
            <div class="section">
              <h2 class="section-title">Education</h2>
              <div class="content">${edu.degree || 'B.Sc. Computer Science'}, ${edu.school || 'Sample University'} (${edu.gradYear || '2023'})</div>
            </div>
            <div class="section">
              <h2 class="section-title">Skills</h2>
              <div class="content">${skills.skills || 'JavaScript, HTML, CSS'}</div>
              </div>
            </div>
      </div>
    `;
      break;
    }
    
    preview.innerHTML = templateHTML;
    // Re-apply responsive scaling after preview updates
    applyScaleToPreview();
  }

// Load saved photo data on page load
function loadSavedPhotoData() {
  const userData = JSON.parse(localStorage.getItem('resumeData') || '{}');
  if (userData.user && userData.user.profilePicture) {
    // Update the resumeData to include the photo
    if (!resumeData['user-info']) {
      resumeData['user-info'] = {};
    }
    resumeData['user-info'].profilePicture = userData.user.profilePicture;
    
    // Update the form preview if it exists
    const previewImage = document.getElementById('previewImage');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const removeBtn = document.getElementById('removePhoto');
    
    if (previewImage) {
      previewImage.src = userData.user.profilePicture;
      previewImage.style.display = 'block';
    }
    if (uploadPlaceholder) {
      uploadPlaceholder.style.display = 'none';
    }
    if (removeBtn) {
      removeBtn.style.display = 'block';
    }
  }
}

// Photo upload handling functions
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.');
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;
    
    // Update preview
    const previewImage = document.getElementById('previewImage');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const removeBtn = document.getElementById('removePhoto');
    
    if (previewImage) {
      previewImage.src = imageData;
      previewImage.style.display = 'block';
    }
    if (uploadPlaceholder) {
      uploadPlaceholder.style.display = 'none';
    }
    if (removeBtn) {
      removeBtn.style.display = 'block';
    }

    // Save to resume data
    const userInfo = resumeData['user-info'] || {};
    userInfo.profilePicture = imageData;
    resumeData['user-info'] = userInfo;

    // Also save to localStorage
    const userData = JSON.parse(localStorage.getItem('resumeData') || '{}');
    userData.user = userData.user || {};
    userData.user.profilePicture = imageData;
    localStorage.setItem('resumeData', JSON.stringify(userData));

    // Update preview
    renderPreview();
    
    // Also update the form input value for consistency
    const profilePictureInput = document.getElementById('profilePicture');
    if (profilePictureInput) {
      profilePictureInput.value = imageData;
    }
  };
  reader.readAsDataURL(file);
}

function removeProfilePhoto() {
  // Clear preview
  const previewImage = document.getElementById('previewImage');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const removeBtn = document.getElementById('removePhoto');
  const fileInput = document.getElementById('profilePicture');
  
  if (previewImage) {
    previewImage.src = '';
    previewImage.style.display = 'none';
  }
  if (uploadPlaceholder) {
    uploadPlaceholder.style.display = 'flex';
  }
  if (removeBtn) {
    removeBtn.style.display = 'none';
  }
  if (fileInput) {
    fileInput.value = '';
  }

  // Remove from resume data
  const userInfo = resumeData['user-info'] || {};
  delete userInfo.profilePicture;
  resumeData['user-info'] = userInfo;

  // Also clear from localStorage
  const userData = JSON.parse(localStorage.getItem('resumeData') || '{}');
  userData.user = userData.user || {};
  delete userData.user.profilePicture;
  localStorage.setItem('resumeData', JSON.stringify(userData));

  // Update preview
  renderPreview();
  
  // Also clear the form input value
  const profilePictureInput = document.getElementById('profilePicture');
  if (profilePictureInput) {
    profilePictureInput.value = '';
  }
}

// Improved PDF download function
function downloadPDF() {
  const preview = document.getElementById('resume-preview');
  const downloadBtn = document.getElementById('download-pdf');
  if (!preview) {
    alert('Resume preview not found.');
    return;
  }
  if (!window.html2pdf) {
    alert('PDF library not loaded. Please refresh the page and try again.');
    return;
  }

  // Show loading state
  const originalText = downloadBtn.textContent;
  downloadBtn.textContent = 'Generating PDF...';
  downloadBtn.disabled = true;

  // Toggle export-friendly mode
  const hadDark = document.body.classList.contains('dark');
  if (hadDark) document.body.classList.remove('dark');
  // Temporarily disable on-screen scale while exporting
  const hadScale = preview.classList.contains('scale-fit');
  if (hadScale) preview.classList.remove('scale-fit');
  preview.style.transform = '';
  preview.classList.add('pdf-mode');

  // Wait for fonts/images
  const waitForFonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  const waitForImages = Promise.all(
    Array.from(preview.querySelectorAll('img')).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => { img.onload = img.onerror = () => resolve(); });
    })
  );

  Promise.all([waitForFonts, waitForImages]).then(() => {
    setTimeout(() => {
      generatePDF(preview, downloadBtn, originalText, hadDark, hadScale);
    }, 30);
  });
}

function generatePDF(pdfElement, downloadBtn, originalText, restoreDark, restoreScale) {
  // Detect if it's a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const pdfOptions = {
    margin: isMobile ? [0, 0, 0, 0] : [5, 5, 5, 5],
    filename: 'Resume.pdf',
    image: { 
      type: 'jpeg', 
      quality: isMobile ? 0.7 : 0.9
    },
    html2canvas: { 
      scale: isMobile ? 1 : 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      logging: false,
      foreignObjectRendering: false,
      removeContainer: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true,
      precision: 16
    }
  };

  // Try to generate PDF
  window.html2pdf()
    .set(pdfOptions)
    .from(pdfElement)
    .save()
    .then(() => {
      console.log('PDF generated successfully');
      downloadBtn.textContent = originalText;
      downloadBtn.disabled = false;
      pdfElement.classList.remove('pdf-mode');
      if (restoreDark) document.body.classList.add('dark');
      if (restoreScale) { pdfElement.classList.add('scale-fit'); applyScaleToPreview(); }
    })
    .catch((error) => {
      console.error('PDF generation failed:', error);
      
      // Try simpler method for mobile
      if (isMobile) {
        tryMobilePDF(pdfElement, downloadBtn, originalText, restoreDark, restoreScale);
      } else {
        trySimplePDF(pdfElement, downloadBtn, originalText, restoreDark, restoreScale);
      }
    });
}

function tryMobilePDF(pdfElement, downloadBtn, originalText, restoreDark, restoreScale) {
  console.log('Trying mobile-specific PDF method');
  
  const mobileOptions = {
    margin: [5, 5, 5, 5],
    filename: 'Resume.pdf',
    image: { type: 'jpeg', quality: 0.5 },
    html2canvas: { 
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      removeContainer: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    }
  };

  window.html2pdf()
    .set(mobileOptions)
    .from(pdfElement)
    .save()
    .then(() => {
      downloadBtn.textContent = originalText;
      downloadBtn.disabled = false;
      pdfElement.classList.remove('pdf-mode');
      if (restoreDark) document.body.classList.add('dark');
      if (restoreScale) { pdfElement.classList.add('scale-fit'); applyScaleToPreview(); }
    })
    .catch((error) => {
      console.error('Mobile PDF method failed:', error);
      // Try print method as last resort
      tryPrintMethod(pdfElement, downloadBtn, originalText, restoreDark, restoreScale);
    });
}

function tryPrintMethod(pdfElement, downloadBtn, originalText, restoreDark, restoreScale) {
  console.log('Trying print method as fallback');
  
  // Make the element visible for printing
  pdfElement.style.position = 'fixed';
  pdfElement.style.left = '0';
  pdfElement.style.top = '0';
  pdfElement.style.zIndex = '9999';
  pdfElement.style.backgroundColor = 'white';
  
  // Try to print
  try {
    window.print();
    downloadBtn.textContent = originalText;
    downloadBtn.disabled = false;
    pdfElement.classList.remove('pdf-mode');
    if (restoreDark) document.body.classList.add('dark');
    if (restoreScale) { pdfElement.classList.add('scale-fit'); applyScaleToPreview(); }
  } catch (error) {
    console.error('Print method failed:', error);
    alert('PDF generation is not supported on this device. Please try on a desktop computer or use the print function in your browser.');
    downloadBtn.textContent = originalText;
    downloadBtn.disabled = false;
    pdfElement.classList.remove('pdf-mode');
    if (restoreDark) document.body.classList.add('dark');
    if (restoreScale) { pdfElement.classList.add('scale-fit'); applyScaleToPreview(); }
  }
}

function trySimplePDF(pdfElement, downloadBtn, originalText, restoreDark, restoreScale) {
  console.log('Trying simple PDF method');
  
  const simpleOptions = {
    margin: [10, 10, 10, 10],
    filename: 'Resume.pdf',
    image: { type: 'jpeg', quality: 0.8 },
    html2canvas: { 
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    }
  };

  window.html2pdf()
    .set(simpleOptions)
    .from(pdfElement)
    .save()
    .then(() => {
      downloadBtn.textContent = originalText;
      downloadBtn.disabled = false;
      pdfElement.classList.remove('pdf-mode');
      if (restoreDark) document.body.classList.add('dark');
      if (restoreScale) { pdfElement.classList.add('scale-fit'); applyScaleToPreview(); }
    })
    .catch((error) => {
      console.error('Simple PDF method failed:', error);
      alert('PDF generation failed. Please try again or use a different browser.');
      downloadBtn.textContent = originalText;
      downloadBtn.disabled = false;
      pdfElement.classList.remove('pdf-mode');
      if (restoreDark) document.body.classList.add('dark');
      if (restoreScale) { pdfElement.classList.add('scale-fit'); applyScaleToPreview(); }
    });
} 

// Add responsive scaling logic
function setupResponsiveScale() {
  const apply = () => applyScaleToPreview();
  window.addEventListener('resize', apply);
  apply();
}

function applyScaleToPreview() {
  const preview = document.getElementById('resume-preview');
  if (!preview) return;
  preview.classList.add('scale-fit');
  const container = preview.parentElement;
  if (!container) return;
  const available = container.clientWidth - 24;
  const baseWidth = 595; // A4 px width used for preview
  const scale = Math.min(1, Math.max(0.6, available / baseWidth));
  preview.style.transform = `scale(${scale})`;
}