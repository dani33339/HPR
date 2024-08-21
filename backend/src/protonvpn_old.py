import subprocess

def connect_to_protonvpn():
    try:
        process = subprocess.Popen(['sudo', 'protonvpn', 'c', '-f'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        output, _ = process.communicate(timeout=45)  # Wait for 30 seconds
        if "Connected!" in output:
            print("Connected to ProtonVPN successfully!")
        else:
            print("Error: Connection to ProtonVPN failed.")
    except subprocess.TimeoutExpired:
        print("Error: Timeout occurred while connecting to ProtonVPN.")
    except subprocess.CalledProcessError as e:
        print(f"Error connecting to ProtonVPN: {e}")

def connect_to_india():
    try:
        process = subprocess.Popen(['sudo', 'protonvpn', 'c', '--cc', 'IN'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        output, _ = process.communicate(timeout=45)  # Wait for 30 seconds
        if "Connected!" in output:
            print("Connected to India via ProtonVPN successfully!")
        else:
            print("Error: Connection to India via ProtonVPN failed.")
    except subprocess.TimeoutExpired:
        print("Error: Timeout occurred while connecting to India via ProtonVPN.")
    except subprocess.CalledProcessError as e:
        print(f"Error connecting to India via ProtonVPN: {e}")


def disconnect():
    try:
        process = subprocess.Popen(['sudo', 'protonvpn', 'disconnect'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        output, _ = process.communicate(timeout=30)  # Wait for 30 seconds
        if "Disconnected" in output:
            print("Disconnected from ProtonVPN successfully!")
        else:
            print("Error: Disconnection from ProtonVPN failed.")
    except subprocess.TimeoutExpired:
        print("Error: Timeout occurred while disconnecting from ProtonVPN.")
    except subprocess.CalledProcessError as e:
        print(f"Error disconnecting ProtonVPN: {e}")

def check_status():
    try:
        subprocess.run(['sudo', 'protonvpn', 'status'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error getting status: {e}")

