
# VeziStore

VeziStore is a comprehensive e-commerce platform designed to facilitate the buying and selling of products. It includes an admin site for managing products and orders, as well as a user site for browsing, purchasing, and managing orders.

## Features

### Admin Site
- **Product Management**: Create, update, and delete products to be sold on the platform.
- **Order Management**: View and manage customer orders, including order status updates and tracking.

### User Site
- **Product Browsing**: Browse through a variety of products with detailed descriptions and images.
- **Product Categorization**: Browse different products in different categories.
- **Shopping Cart**: Add products to a cart for a seamless shopping experience.
- **Payment Integration**: Secure payment processing through a payment API.
- **Order Management**: Users can view and manage their past and current orders.

## Getting Started

### Prerequisites
- Node.js
- npm (Node Package Manager)
- MongoDB (or any other database)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/DuckDoesStuff/Web101-VeziStore
    cd Web101-VeziStore
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    ATLAS_URI=
    PORT=
    UPLOADCARE_PUBLIC_KEY=
    SECRET_KEY=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    EMAIL_USER=
    EMAIL_PASSWORD=
    VNP_TMN_CODE=
    VNP_HASH_SECRET=
    VNP_URL
    ```

4. **Run the application:**
    ```bash
    npm start
    ```
