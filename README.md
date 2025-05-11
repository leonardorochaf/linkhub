# LinkHub - Your Personal Link Hub

🌐 **Live Demo:** [https://leonardorochaf.github.io/linkhub](https://leonardorochaf.github.io/linkhub)

LinkHub is a modern, privacy-focused alternative to Linktree, built with React, TypeScript, and Supabase. It allows users to create a personalized landing page with their important links, all while maintaining full control over their data.

## 🌟 Features

### Core Features

- **Personalized Landing Pages**: Create and customize your unique profile page
- **Link Management**: Add, edit, and delete links with ease
- **User Authentication**: Secure login system for managing your links
- **Privacy Controls**: Granular control over what information is displayed publicly

### Technical Features

- Built with React + TypeScript + Vite
- Modern, responsive design
- Secure authentication system
- Powered by Supabase for backend services:
  - Real-time database
  - Authentication
  - Storage for profile images
  - Row Level Security (RLS) for data protection

## 📝 Scope Decisions & Trade-offs

### Implemented Features

- Basic authentication system for user management
- Public profile pages with customizable URLs
- CRUD operations for links
- Privacy controls for profile information
- Responsive design for all devices

### Trade-offs

- Focused on core functionality over advanced features
- Prioritized user experience and simplicity
- Chose lightweight authentication for MVP
- Limited analytics to basic view counts

## 🔒 Privacy & Security

- User data is stored securely in Supabase with Row Level Security
- Public profiles only show approved information
- Authentication uses Supabase Auth with industry-standard practices
