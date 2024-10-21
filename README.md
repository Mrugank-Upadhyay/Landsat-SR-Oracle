# Web App Under Construction
---

# 🌍 Landsat SR Oracle

For the [NASA Space Apps Challenge 2024](https://www.spaceappschallenge.org/nasa-space-apps-2024/challenges/), my friend and I began developing an interactive web app that enables users to plan and visualize Landsat satellite imaging over selected locations. This project simplifies access to satellite data, supporting research, education, and environmental monitoring for scientists, researchers, and enthusiasts alike. It helps users compare ground-based measurements with satellite data for more informed environmental analysis and decision-making.

*Developed for NASA Space Apps Challenge 2024 by Mrugank Upadhyay & Mihran Mashhud.*

## 🔍 Project Overview

This web app was designed to solve a complex challenge: enabling users to easily access and plan for Landsat Surface Reflectance (SR) data to compare ground-based observations with satellite imagery. Landsat missions provide a rich, continuous dataset of Earth’s land surface, but accessing and processing this data in a user-friendly way has always been a challenge. 

By selecting any location on Earth, users can view the boundary that a Landsat satellite will image, check the upcoming and past acquisition dates, and visualize multi-spectrum data to assist in environmental planning and research.

## 🚀 Features

- **Location-based Acquisition Scheduling**: Users can select any location on Earth and view the upcoming and past satellite acquisition dates to plan their observations effectively. Unlike the usual process of getting these schedules from a premade API, we specifically calculated the acquisition times ourselves to enhance accuracy. Using API's we had errors in the acquisition times, ranging from 30 minutes to 50 minutes. With these calculations, we reduced the error down to only around 5 minutes deviations.
  
- **Data Visualization**: Implementing data visualization for satellite imagery by providing a graphical view of various data such as Surface Reflectance, Surface Temperature, and potentially even time-series data. Users can compare Landsat SR data with ground-based observations for environmental monitoring and research. 

- **Satellite Imagery and Scene Generation**: Integrated the USGS API to fetch satellite images and perform multi-spectrum image editing, generating various scientific scenes (e.g., natural colour, infrared, agriculture) and raw data access (single band images) for deeper analysis.

## 🌱 Future Enhancements

- **Notifications**: Adding a feature to notify users when a Landsat satellite will pass over their selected location.
- **More Detailed Visualizations**: Offering users more ways to manipulate and visualize multi-spectrum imagery.
- **Downloading and Sharing**: Allow users to download or share data in a useful format (.csv)
- **Harmonized Landsat Sentinel-2**: Allow users to acquire ESA's Sentinel-2 data (allowing global coverage every 2-3 days instead of 8 days with Landsat 8 and Landsat 9 alone).
- **Scene Comparison for Target Location**: Allow users to compare two scenes for a target location to better see changes over time.

## 🛠️ Technologies Used

- **Frontend**: React, Next.js, Tailwind CSS, Shadcn/ui, Mapbox GL JS, Zustand (State Management)
- **APIs**: USGS API for Landsat data retrieval
- **Deployment & Hosting**: Vercel

## 💡 Why This Matters

Landsat SR data helps scientists and enthusiasts monitor environmental changes, plan research, and gain new insights into Earth’s surface. Landsat missions have provided the longest continuous dataset of remotely sensed measurements of Earth’s land surface, contributing valuable insights into environmental changes, resource management, and Earth system science. Comparing ground-based spectral measurements with Landsat Surface Reflectance (SR) data enhances scientific exploration and promotes a deeper understanding of our planet. However, this process requires knowing when a Landsat satellite will pass over a specific location and accessing the relevant satellite data collected at that time.

This project simplifies that process by integrating satellite overpass schedules and data retrieval into a single, easy-to-use web application. It supports not only scientists but also educators, citizen scientists, and enthusiasts who wish to connect satellite data with ground-based observations. By facilitating the comparison of ground and satellite data, this app fosters experiential learning, spatial thinking, and interdisciplinary research. Empowering individuals to access and interpret Landsat data encourages more informed decision-making and cultivates a broader understanding of how Earth’s systems are changing.

## 📈 Project Goals

- Simplify Satellite Data Access: Create a seamless and user-friendly way for scientists, students, and enthusiasts to access Landsat SR data based on location and timing, reducing the complexity of retrieving relevant imagery.
- Support Ground-Satellite Comparisons: Enable users to compare their own ground-based spectral observations with Landsat SR data, helping validate satellite data and enhance experiential learning, scientific research, and environmental monitoring.
- Promote Education and Engagement: Encourage users to explore Earth’s changing environment by providing an educational tool that supports interdisciplinary learning and inspires global citizenship through the integration of ground-based and satellite observations.
- Support environmental monitoring, research, and education by enabling seamless comparison between ground-based and satellite observations.

## 🚧 Installation & Setup

To run this project locally, follow these steps:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Mrugank-Upadhyay/Landsat-SR-Oracle.git
    ```

2. **Navigate to the project folder**:

    ```bash
    cd Landsat-SR-Oracle
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Run the development server**:

    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---


