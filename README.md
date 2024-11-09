HPR - Hotel Price Reducer
Overview
The HPR (Hotel Price Reducer) project aims to assist users in finding the best hotel deals by bypassing geographical restrictions on pricing. Online travel agencies (OTAs) often display dynamic pricing based on the user's location, causing significant price variations. Our research found that hotel prices for users in India are often lower than for those in other regions, such as Israel. To address this, HPR leverages VPN technology to retrieve competitive pricing and provide users with exclusive access to the lowest available hotel deals.

Through a streamlined web interface, users can input their hotel details and travel dates to search for hotel deals. A regular user receives results from one meta-search provider, while a premium user sees pricing from three major providers: Google Hotels, Trivago, and Skyscanner. Each result includes a direct booking link, allowing users to access the lowest available prices instantly.

Features
Location-Specific Pricing: Uses a VPN to retrieve hotel prices based on user-defined regions.
User Tiers: Regular users receive one result, while premium users access multiple meta-search providers.
Comprehensive Data Retrieval: Pulls pricing from multiple providers for premium users to ensure the best deal visibility.
Efficient Backend: Optimized for data retrieval, caching, and response time.
Seamless Booking Links: Each search result includes a direct booking link.
Tech Stack
Backend: Python, Selenium
Frontend: React
Database: MariaDB
Infrastructure: Oracle Cloud, Linux
VPN: OpenVPN for geographical pricing control
System Architecture
The system is split into two main components:

Frontend: A React-based user interface that allows users to enter their search criteria and view results.
Backend: A Python application using Selenium to interact with hotel meta-search providers (Google Hotels, Trivago, Skyscanner). A VPN is used to bypass geographical restrictions, retrieving exclusive offers from selected regions. The backend also manages data storage, caching, and serves API requests for the frontend.

Try the system yourself on hpr.life

https://www.youtube.com/watch?v=Rzfhok_U8Ms&ab_channel=DanielMarkov

![image](https://github.com/user-attachments/assets/0ef2b74b-a020-41fc-8a30-eda39331f2af)

![image](https://github.com/user-attachments/assets/b33b4438-67b3-4a79-973a-961d1bc7c9ff)

![image](https://github.com/user-attachments/assets/93c69e16-fa0b-4921-9add-1560e850d2fc)

![image](https://github.com/user-attachments/assets/6831a045-72ff-4703-a840-45adaee49d92)

![image](https://github.com/user-attachments/assets/73ee0de5-112a-4800-a42e-c52d1fc153df)

![Uploading image.png…]()







