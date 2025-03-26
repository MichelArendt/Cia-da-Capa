# Standard Organization for SCSS Files

To **keep SCSS modular, scalable, and maintainable**, it's essential to **separate utility styles** (variables, mixins, placeholders) from **real styles** (components, layouts, pages). Below is the industry-standard way to structure SCSS.

---

## **📁 Recommended SCSS Folder Structure**

```
scss/
│── abstracts/      # Variables, mixins, placeholders (no compiled CSS)
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _placeholders.scss
│   ├── _functions.scss
│
│── base/           # Global styles (applied to all pages)
│   ├── _reset.scss
│   ├── _typography.scss
│   ├── _global.scss
│
│── components/     # Reusable UI elements
│   ├── _buttons.scss
│   ├── _forms.scss
│   ├── _modals.scss
│   ├── _alerts.scss
│
│── layout/         # Layout-related styles
│   ├── _grid.scss
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _sidebar.scss
│
│── pages/          # Page-specific styles
│   ├── _home.scss
│   ├── _dashboard.scss
│   ├── _login.scss
│
│── themes/         # Themes and skins
│   ├── _light.scss
│   ├── _dark.scss
│
│── vendors/        # Third-party styles
│   ├── _bootstrap.scss
│   ├── _swiper.scss
│
│── shared.scss     # Main file that imports everything
│── main.scss       # Styles for the main website
│── manage.scss     # Styles for the manage/admin panel
```

---

## **🛠 Detailed Explanation of Each Folder**

### **1️⃣ `abstracts/` (Utilities: No CSS Output)**
This folder **never outputs CSS directly**—it only contains variables, mixins, placeholders, and functions that other files use.

📌 **Example: `_variables.scss`**
```scss
$primary-color: #3498db;
$secondary-color: #2ecc71;
$font-size-base: 16px;
```

📌 **Example: `_mixins.scss`**
```scss
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

📌 **Example: `_placeholders.scss`**
```scss
%button-shared {
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}
```

---

### **2️⃣ `base/` (Global Styles)**
Contains styles that **apply everywhere** in the project.

📌 **Example: `_typography.scss`**
```scss
body {
    font-family: "Poppins", sans-serif;
    font-size: $font-size-base;
}
```

---

### **3️⃣ `components/` (Reusable UI Elements)**
Reusable UI components like buttons, modals, forms, and alerts.

📌 **Example: `_buttons.scss`**
```scss
@use "../abstracts/mixins" as *;
@use "../abstracts/variables" as *;

.btn {
    @extend %button-shared;
    background: $primary-color;
    color: white;
}
```

---

### **4️⃣ `layout/` (Structure & Positioning)**
Styles that **affect page structure** like grids, header, footer, sidebar.

📌 **Example: `_grid.scss`**
```scss
.container {
    width: 100%;
    max-width: 1200px;
    margin: auto;
}
```

---

### **5️⃣ `pages/` (Page-Specific Styles)**
Styles that **only apply to specific pages** (e.g., Home, Dashboard, Login).

📌 **Example: `_home.scss`**
```scss
.hero-section {
    background: url("../images/hero.jpg");
    height: 400px;
}
```

---

### **6️⃣ `themes/` (Themes & Skins)**
Styles for **dark mode, light mode, custom themes**.

📌 **Example: `_dark.scss`**
```scss
body {
    background: #111;
    color: #fff;
}
```

---

### **7️⃣ `vendors/` (Third-Party Styles)**
Contains **third-party libraries** (Bootstrap, Swiper, etc.).

---

## **🚀 How to Use This Structure**

### ✅ **1️⃣ `shared.scss` (Global Import)**
```scss
@use "abstracts/variables" as *;
@use "abstracts/mixins" as *;
@use "base/reset";
@use "base/typography";
@use "layout/grid";
@use "layout/header";
@use "components/buttons";
```
✅ This file is **compiled into `shared.css`** and loaded globally.

---

### ✅ **2️⃣ `main.scss` (Main Website Styles)**
```scss
@use "shared";
@use "pages/home";
@use "pages/dashboard";
```
✅ This file is **compiled into `main.css`**.

---

### ✅ **3️⃣ `manage.scss` (Admin Panel Styles)**
```scss
@use "shared";
@use "pages/login";
@use "layout/sidebar";
```
✅ This file is **compiled into `manage.css`**.

---

## **🔥 Best Practices**
- **❌ Avoid `@import` (deprecated)** → Use `@use` and `@forward`.
- **✅ Use `@forward` in shared files** (`shared.scss`) to expose variables/mixins.
- **✅ Use `@use` in `main.scss` and `manage.scss`** to reference shared utilities without duplication.
- **✅ Never put CSS rules in `abstracts/`** (only variables, mixins, functions).
- **✅ Keep pages and components modular**.

---

## 🎯 **Final Thoughts**
This **modular SCSS structure** ensures:
- **Scalability** (easy to maintain).
- **Performance** (no duplicate CSS).
- **Reusability** (shared styles without conflicts).

Let me know if you need any refinements! 🚀🎯
