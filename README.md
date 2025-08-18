# ResumePro - Professional Resume Builder

A modern, responsive resume builder web application that allows users to create professional resumes with multiple templates and real-time preview.

## ✨ Features

- **5 Professional Templates** - Modern, Professional, Creative, Minimalist, and Corporate designs
- **Real-time Preview** - See your resume update as you type
- **Photo Upload** - Add your profile picture to resumes
- **Mobile Responsive** - Works perfectly on all devices
- **PDF Export** - Download your resume as a professional PDF
- **Dark Mode** - Toggle between light and dark themes
- **Local Storage** - Your data is automatically saved

## 🚀 Live Demo

[View Live Demo](https://resumepro-builder.vercel.app)

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Dynamic functionality
- **html2pdf.js** - PDF generation
- **html2canvas** - Image conversion
- **Google Fonts** - Typography

## 📱 Templates

1. **Modern Professional** - Clean, centered design with blue accents
2. **Professional** - Single-column layout with photo support
3. **Creative Modern** - Gradient header with modern styling
4. **Minimalist** - Simple, elegant design
5. **Corporate** - Professional dark header design

## 🎯 Getting Started

### Prerequisites

- A modern web browser
- Basic knowledge of HTML/CSS/JavaScript (for customization)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resumepro-builder.git
   cd resumepro-builder
   ```

2. **Open in your browser**
   - Open `index.html` in your web browser
   - Or use a local server like Live Server in VS Code

3. **Start building your resume**
   - Fill in your information in the form
   - Choose from 5 different templates
   - Download your resume as PDF

## 📁 Project Structure

```
resumepro-builder/
├── index.html              # Landing page
├── builder.html            # Main resume builder
├── css/
│   ├── style.css          # Landing page styles
│   └── builder.css        # Builder and template styles
├── js/
│   ├── auth.js            # Authentication (placeholder)
│   └── builder.js         # Main builder functionality
├── README.md              # This file
└── vercel.json            # Vercel configuration
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Deploy!

### Deploy to Other Platforms

- **Netlify**: Drag and drop the folder to Netlify
- **GitHub Pages**: Enable GitHub Pages in repository settings
- **Any static hosting**: Upload files to any web server

## 🎨 Customization

### Adding New Templates

1. Add template HTML in `builder.js` (renderPreview function)
2. Add CSS styles in `builder.css`
3. Add template button in `builder.html`

### Styling

- Modify CSS variables in `:root` for easy theming
- Update colors, fonts, and spacing in respective CSS files
- Add new CSS classes for custom styling

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Email: support@resumepro.com

## 🙏 Acknowledgments

- Icons from various icon libraries
- Fonts from Google Fonts
- PDF generation with html2pdf.js
- Inspiration from modern resume designs

---

**Made with ❤️ for job seekers everywhere**
