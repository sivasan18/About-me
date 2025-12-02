# Sivaramakrishnan - Portfolio Website

A modern, responsive single-page portfolio website showcasing professional skills, projects, and experience. Built with clean HTML, CSS, and vanilla JavaScript - fast, lightweight, and ready for GitHub Pages deployment.

![Portfolio Preview](./assets/profile.jpg)

## ✨ Features

- **Responsive Design**: Mobile-first approach that looks great on all devices
- **Modern UI**: Clean, professional design with smooth animations
- **Fast Loading**: Lightweight with no heavy frameworks
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Interactive**: Smooth scrolling, project modals, and engaging animations
- **Easy to Customize**: Well-organized code with clear comments

## 📋 Sections

1. **Hero** - Profile photo, name, tagline, and CTA buttons
2. **About** - Professional summary and educational background
3. **Skills** - Visual skill bars for technologies (HTML, CSS, JS, Node.js)
4. **Projects** - Portfolio showcase with modal detail views
5. **Blog** - Latest articles and notes
6. **Contact** - Contact form and information
7. **Footer** - Social links and quick navigation

## 🚀 Quick Start

### Local Development

1. Clone or download this repository
2. Navigate to the project folder
3. Open with a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server -p 8000
```

4. Open your browser to `http://localhost:8000`

### GitHub Pages Deployment

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it: `sivasan18.github.io` (for user site) or any name (for project site)

2. **Upload Your Files**
   ```bash
   # Navigate to project folder
   cd "/Users/tsr/Downloads/About Me"
   
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial portfolio website"
   
   # Add remote repository
   git remote add origin https://github.com/sivasan18/sivasan18.github.io.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Under "Source", select the `main` branch
   - Click "Save"
   - Your site will be live at `https://sivasan18.github.io/`

## 🎨 Customization Guide

### Update Personal Information

**1. Basic Info (index.html)**

Search and replace the following in `index.html`:
- `Sivaramakrishnan` - Your name
- `Front End Developer` - Your title/tagline
- `sivaramakrishnan@example.com` - Your email
- `+91 98765 43210` - Your phone number

**2. Profile Photo**

Replace `assets/profile.jpg` with your professional headshot:
- Recommended size: 400x400px or larger
- Square aspect ratio
- High quality JPG or PNG

**3. Resume**

Replace `assets/resume.pdf` with your actual resume PDF file.

**4. About Section**

Edit the about text in `index.html` (search for `<section class="about"`):
- Update your bio
- Modify education details
- Change focus areas

**5. Skills**

Update skills in `index.html` (search for `<section class="skills"`):
- Change skill names
- Adjust progress bar widths (style="width: XX%")
- Update skill levels
- Add or remove skill cards

### Add/Edit Projects

**1. Update Project Cards (index.html)**

Find the projects section and modify each project card:
```html
<div class="project-card" data-project="1">
    <div class="project-image">
        <img src="./assets/projects/project1.jpg" alt="Project Name">
        ...
    </div>
    <div class="project-info">
        <h3 class="project-title">Your Project Title</h3>
        <p class="project-description">Description...</p>
        <div class="project-tags">
            <span class="tag">Technology</span>
        </div>
    </div>
</div>
```

**2. Update Project Details (script.js)**

Edit the `projectData` object in `script.js`:
```javascript
const projectData = {
    1: {
        title: 'Your Project',
        image: './assets/projects/project1.jpg',
        description: 'Your description...',
        features: ['Feature 1', 'Feature 2'],
        technologies: ['Tech 1', 'Tech 2'],
        liveLink: 'https://your-live-link.com',
        githubLink: 'https://github.com/yourrepo'
    }
};
```

**3. Add Project Images**

Add project screenshots to `assets/projects/`:
- Recommended size: 800x600px or 16:9 aspect ratio
- Use descriptive filenames (e.g., `ecommerce-project.jpg`)

### Update Blog Posts

Edit the blog section in `index.html`:
```html
<article class="blog-card">
    <div class="blog-date">
        <i class="far fa-calendar"></i> Month Year
    </div>
    <h3 class="blog-title">
        <a href="https://your-blog-link.com" target="_blank">Title</a>
    </h3>
    <p class="blog-excerpt">Excerpt...</p>
    <a href="https://your-blog-link.com" class="blog-link" target="_blank">
        Read More <i class="fas fa-arrow-right"></i>
    </a>
</article>
```

### Update Social Links

Edit footer social links in `index.html`:
```html
<div class="social-links">
    <a href="https://github.com/yourusername" target="_blank" aria-label="GitHub">
        <i class="fab fa-github"></i>
    </a>
    <a href="https://linkedin.com/in/yourusername" target="_blank" aria-label="LinkedIn">
        <i class="fab fa-linkedin"></i>
    </a>
    <!-- Add more social links -->
</div>
```

### Change Color Scheme

Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #4A90E2;  /* Main accent color */
    --primary-dark: #357ABD;    /* Darker shade */
    --primary-light: #6BA3E8;   /* Lighter shade */
    /* Adjust other colors as needed */
}
```

## 📁 File Structure

```
About Me/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
├── assets/
│   ├── profile.jpg     # Your profile photo
│   ├── resume.pdf      # Your resume
│   └── projects/       # Project screenshots
│       ├── project1.jpg
│       ├── project2.jpg
│       ├── project3.jpg
│       └── project4.jpg
├── README.md           # This file
└── .gitignore          # Git ignore file (optional)
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **JavaScript (ES6+)** - Vanilla JS, no dependencies
- **Font Awesome** - Icons
- **Google Fonts** - Inter font family

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Advanced Customization

### Adding a New Section

1. Add HTML section in `index.html`
2. Add navigation link in the nav menu
3. Add corresponding styles in `styles.css`
4. Update scroll observer in `script.js` if needed

### Changing Animations

Modify animation settings in `styles.css`:
```css
:root {
    --transition-fast: 0.15s ease;
    --transition-base: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

## 📞 Contact Form Setup

The contact form currently opens the user's email client with pre-filled data. To integrate with a backend service:

1. **Using EmailJS**: Sign up at [EmailJS](https://www.emailjs.com/)
2. **Using Formspree**: Sign up at [Formspree](https://formspree.io/)
3. Update the form handler in `script.js`

## 📄 License

This project is open source and available for personal and commercial use.

## 🙏 Credits

Developed by **Sivaramakrishnan**
Front End Developer

---

**Need Help?** If you have questions or need assistance customizing this portfolio, feel free to reach out!

**Made with ❤️ using HTML, CSS, and JavaScript**
