# HPR - Hotel Price Reducer

## Overview

The HPR (Hotel Price Reducer) project helps users find the best hotel deals by bypassing geographical pricing restrictions. Online travel agencies (OTAs) often show varying prices based on the user’s location, which can lead to significant price differences. For instance, users in India may see lower hotel prices than those in Israel. HPR tackles this issue by utilizing VPN technology to access the lowest available hotel prices, regardless of the user's geographical location.

The system allows users to search for hotel deals by entering their travel details through a simple web interface. Regular users receive results from a single meta-search provider, while premium users get results from three major providers: Google Hotels, Trivago, and Skyscanner. Each result includes a direct booking link for seamless access to the best deals.

## Features

- **Location-Specific Pricing**: VPN technology retrieves hotel prices from India.
- **User Tiers**: Regular users access results from one provider, while premium users can see multiple providers.
- **Comprehensive Data Retrieval**: Pulls prices from Google Hotels, Trivago, and Skyscanner for premium users.
- **Optimized Backend**: Efficient data retrieval, caching, and response time.
- **Direct Booking Links**: Each search result includes a link to directly book the hotel at the displayed price.

## Tech Stack

- **Backend**: Python, Selenium, Flask
- **Frontend**: React
- **Database**: MariaDB
- **Infrastructure**: Oracle Cloud, Linux
- **VPN**: OpenVPN for geographical price control

## System Architecture

The HPR system is split into two main components:

- **Frontend**: A React-based interface that enables users to enter search criteria and view results.
- **Backend**: A Python application using Selenium to interact with hotel meta-search providers like Google Hotels, Trivago, and Skyscanner. The backend uses a VPN to bypass location-based pricing restrictions and retrieves the best possible hotel deals. It also manages data storage, caching, and API requests for the frontend.

## Try the system yourself
Visit the live demo at [hpr.life](http://hpr.life) and check out the project video [here](https://www.youtube.com/watch?v=Rzfhok_U8Ms&ab_channel=DanielMarkov).

## Screenshots

![Screenshot 1](https://github.com/user-attachments/assets/0ef2b74b-a020-41fc-8a30-eda39331f2af)
![Screenshot 2](https://github.com/user-attachments/assets/b33b4438-67b3-4a79-973a-961d1bc7c9ff)
![Screenshot 3](https://github.com/user-attachments/assets/93c69e16-fa0b-4921-9add-1560e850d2fc)
![Screenshot 4](https://github.com/user-attachments/assets/6831a045-72ff-4703-a840-45adaee49d92)
![Screenshot 5](https://github.com/user-attachments/assets/73ee0de5-112a-4800-a42e-c52d1fc153df)

## Contact
For any questions or inquiries, feel free to reach out to me at [danielmarkov@domain.com](mailto:danielmarkov@domain.com).
