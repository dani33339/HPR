from dotenv import load_dotenv
import os
import subprocess
import threading
import time

load_dotenv()

# Define the path to the OpenVPN configuration files
config_file_il = "/home/ubuntu/backend/src/il.protonvpn.udp.ovpn"
config_file_in = "/home/ubuntu/backend/src/in.protonvpn.udp.ovpn"
username = os.getenv("VPN_USERNAME")
password = os.getenv("VPN_PASSWORD")

MAX_RETRY = 3  

def configure_il():
    """
    Function to start the VPN connection using OpenVPN with credentials provided.
    """
    disconnect()
    # Start the OpenVPN connection process with credentials in a new session
    process = subprocess.Popen(
        ["sudo", "openvpn", "--config", config_file_il, "--auth-user-pass", "/dev/stdin"],
        stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL,  # Redirect stdout to DEVNULL
        stderr=subprocess.DEVNULL,  # Redirect stderr to DEVNULL
        start_new_session=True,
    )

    # Provide username and password to the OpenVPN process
    process.communicate(input=f"{username}\n{password}\n".encode())

def connect_to_protonvpn():
    retry_count = 0
    while retry_count < MAX_RETRY:
        if retry_count > 0:
            print("retrying to connect to vpn")
        thread = threading.Thread(target=configure_il)
        thread.start()

        time.sleep(2)  

        if check_status():
            break  # Exit the loop if check_status_IN returns True

        retry_count += 1
    if retry_count == MAX_RETRY:
        print("Failed to connect to VPN after maximum retries.")
        raise Exception("Failed to connect to VPN after maximum retries.")
    
def configure_india():
    """
    Function to start the VPN connection using OpenVPN with credentials provided.
    """
    disconnect()
    # Start the OpenVPN connection process with credentials in a new session
    process = subprocess.Popen(
        ["sudo", "openvpn", "--config", config_file_in, "--auth-user-pass", "/dev/stdin"],
        stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL,  # Redirect stdout to DEVNULL
        stderr=subprocess.DEVNULL,  # Redirect stderr to DEVNULL
        start_new_session=True,
    )

    # Provide username and password to the OpenVPN process
    process.communicate(input=f"{username}\n{password}\n".encode())

def connect_to_india():
    if check_status_IN():
        return
    retry_count = 0
    while retry_count < MAX_RETRY:
        if retry_count > 0:
            print("retrying to connect to India vpn")
        thread = threading.Thread(target=configure_india)
        thread.start()

        time.sleep(3)  

        if check_status_IN():
            break  # Exit the loop if check_status_IN returns True

        retry_count += 1

    if retry_count == MAX_RETRY:
        print("Failed to connect to India VPN after maximum retries.")
        raise Exception("Failed to connect to India VPN after maximum retries.")

def disconnect():
    """
    Function to stop the VPN connection.
    """
    # Check if there is an active OpenVPN process
    active_processes = subprocess.run(["pgrep", "-x", "openvpn"], capture_output=True, text=True)

    if active_processes.returncode == 0:
        # Kill the OpenVPN process
        subprocess.run(["sudo", "killall", "openvpn"])
        print("VPN connection disconnected")
    else:
        print("No active VPN connection found")

def check_status():
    try:
        # Run the 'dig' command to query a DNS resolver (e.g., Google's DNS)
        result = subprocess.run(['dig', '+short', 'myip.opendns.com', '@resolver1.opendns.com'], capture_output=True, text=True)
        # Extract the public IP address from the command output
        ip_address = result.stdout.strip()
        if ip_address != "129.159.151.202":
            print("VPN is connected")
            return True
        else:
            print("VPN is not connected")
            return False
    except Exception as e:
        print(f"Error getting IP status: {e}")
        return False

def check_status_IN():
    """
    Function to check if the VPN is connected to India.
    """
    result = subprocess.run(["curl", "-s", "https://ipinfo.io/country"], capture_output=True, text=True)

    # Check the output to determine if VPN is connected to India
    if result.returncode == 0 and result.stdout.strip() == "IN" or result.stdout.strip() == "SG": #proton uses SG provider for IN
        print("VPN is connected to India")
        return True
    else:
        print("VPN is not connected to India or an error occurred")
        return False
    