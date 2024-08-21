Backend HPR README
Overview
This project is designed to run on an Ubuntu ARM64 server and provides backend services for HPR. It integrates with various APIs and services including a database, VPN, and currency conversion services.

Requirements
Before running the project, ensure you have the following:

Operating System: Ubuntu ARM64
Python Version: Python 3.x
Required Credentials and Files:
Database credentials: Obtain the necessary credentials to connect to the database.
VPN configuration: Obtain the required VPN configuration files and credentials.
Currency API credentials: Obtain the API key for currency conversion.

Installation

1. Clone the Repository
with git clone commend

2. Install Dependencies
Install the required Python packages using the requirements.txt file:
pip install -r requirements.txt

3. Set Up Environment Variables
Create a .env file in the project root directory and add environment variables
Add Database Credentials
Add OpenVPN files and credentials