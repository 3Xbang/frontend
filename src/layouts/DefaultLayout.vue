<!-- 
  DefaultLayout.vue
  Public-facing layout used for customer-facing pages
-->
<template>
  <div class="default-layout">
    <!-- Header with navigation -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <router-link to="/">
            <h1>3XBANG</h1>
          </router-link>
        </div>
        
        <nav class="main-nav">
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/projects">Projects</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
            <li><router-link to="/login" class="login-btn">登录系统</router-link></li>
          </ul>
        </nav>
      </div>
    </header>
    
    <!-- Main content area -->
    <main class="main-content">
      <slot></slot>
    </main>
    
    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Company info -->
          <div class="footer-company">
            <h3>3XBANG Construction</h3>
            <p>Building the future, one project at a time.</p>
            <div class="social-links">
              <a href="#" class="social-link">Facebook</a>
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">LinkedIn</a>
              <a href="#" class="social-link">Instagram</a>
            </div>
          </div>
          
          <!-- Quick links -->
          <div class="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/about">About Us</router-link></li>
              <li><router-link to="/projects">Our Projects</router-link></li>
              <li><router-link to="/contact">Contact Us</router-link></li>
              <li><router-link to="/login">登录系统</router-link></li>
            </ul>
          </div>
          
          <!-- Services -->
          <div class="footer-services">
            <h4>Our Services</h4>
            <ul>
              <li><a href="#">Commercial Construction</a></li>
              <li><a href="#">Residential Construction</a></li>
              <li><a href="#">Industrial Projects</a></li>
              <li><a href="#">Renovations</a></li>
            </ul>
          </div>
          
          <!-- Contact info -->
          <div class="footer-contact">
            <h4>Contact Us</h4>
            <p><strong>Address:</strong> 123 Construction Avenue, City, Country</p>
            <p><strong>Phone:</strong> +1 (123) 456-7890</p>
            <p><strong>Email:</strong> info@3xbang.com</p>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2023 3XBANG Construction Company. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No extra logic required for the basic layout
</script>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header styles */
.header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.logo h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #333;
}

.main-nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.main-nav li {
  margin-left: 30px;
}

.main-nav a {
  color: #555;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.3s;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  color: #ffd700;
}

.login-btn {
  background-color: #ffd700;
  color: #333 !important;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #e0be00;
}

/* Main content styles */
.main-content {
  flex: 1;
}

/* Footer styles */
.footer {
  background-color: #333;
  color: #fff;
  padding: 60px 0 20px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #fff;
}

.footer h4 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #fff;
}

.footer p {
  color: #bbb;
  margin-bottom: 15px;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-link {
  color: #bbb;
  transition: color 0.3s;
}

.social-link:hover {
  color: #ffd700;
}

.footer-links ul,
.footer-services ul {
  list-style: none;
  padding: 0;
}

.footer-links li,
.footer-services li {
  margin-bottom: 10px;
}

.footer-links a,
.footer-services a {
  color: #bbb;
  transition: color 0.3s;
}

.footer-links a:hover,
.footer-services a:hover {
  color: #ffd700;
}

.footer-bottom {
  border-top: 1px solid #444;
  padding-top: 20px;
  text-align: center;
  color: #888;
  font-size: 14px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    height: auto;
    padding: 20px;
  }
  
  .logo {
    margin-bottom: 20px;
  }
  
  .main-nav ul {
    flex-direction: column;
    align-items: center;
  }
  
  .main-nav li {
    margin: 10px 0;
  }
}
</style> 