## 2024-06-18 - Added secureHeaders middleware
**Vulnerability:** Missing security headers
**Learning:** The application was vulnerable to basic web attacks like clickjacking and MIME-sniffing.
**Prevention:** Always use secure headers globally using the Hono \`secureHeaders\` middleware to protect the application.
