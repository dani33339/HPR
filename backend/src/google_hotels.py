import sys
sys.path.append('/home/ubuntu/backend')

from seleniumwire import webdriver
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from src.currency_helper import get_exchange_rate
import time 
from datetime import datetime
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
import src.protonvpn as protonvpn
from fake_useragent import UserAgent
from selenium.common.exceptions import TimeoutException
import signal

RETRIES = 2

user_agent = UserAgent()
random_user_agent = user_agent.random

firefox_options = Options()
firefox_options.add_argument('-private') 
firefox_options.set_preference("general.useragent.override", random_user_agent)
firefox_options.set_preference("dom.webdriver.enabled", False)
firefox_options.set_preference('useAutomationExtension', False)
firefox_options.set_preference("media.peerconnection.enabled", False)  # Disable WebRTC to hide IP leaks
firefox_options.add_argument("--window-size=1920,1080")
service = Service('/home/ubuntu/backend/geckodriver')

# firefox_options.add_argument("--headless")

class TimeoutException(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutException

def get_prices_and_links(hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children=0):
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(80)  # Set the timeout to 60 seconds

    try:
        trip_length = (datetime.strptime(checkout_date, "%Y-%m-%d") - datetime.strptime(checkin_date, "%Y-%m-%d")).days
        page_url = f"https://www.google.com/search?q={hotel_name}&hotel_occupancy=2#ahotel_dates={checkin_date},{trip_length}"
        retries = RETRIES

        while retries > 0:
            driver = None
            try:   
                driver = webdriver.Firefox(options=firefox_options, service=service)
                driver.get(page_url)

                # slow down to get results
                time.sleep(3)

                # elements = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.XPATH, "//*[contains(text(), 'View') and contains(text(), 'more')]")))
                element = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'View') and contains(text(), 'more')]")))

                # elements[0].click()
                driver.execute_script("arguments[0].click();", element)

                # click on load options
                try:
                    element = WebDriverWait(driver, 4).until(
                        EC.element_to_be_clickable((By.CLASS_NAME, 'bbRZy'))
                    )
                    element.click()
                except Exception as e:
                    pass
                
                # click one more time on load more options
                try:
                    element = WebDriverWait(driver, 2).until(
                        EC.element_to_be_clickable((By.CLASS_NAME, 'bbRZy'))
                    )
                    element.click()
                except Exception as e:
                    pass

                try:
                    # slow down the process to load more hotel details
                    time.sleep(3)
                    hotel_dict = {}
                    try:
                        elements = WebDriverWait(driver, 5).until(
                        EC.presence_of_all_elements_located((By.CLASS_NAME, 'IJxDxc'))
                        )
                    except:
                        element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'view') and contains(text(), 'more')]")))
                        driver.execute_script("arguments[0].click();", element)
                    for element in elements:
                        try:
                            partner = element.find_element(By.CSS_SELECTOR, "[class*=FjC1We").text
                            if partner == '':
                                continue

                            price = element.find_element(By.CLASS_NAME, "QoBrxc").text
                            url = element.find_element(By.CSS_SELECTOR, "[class*=hUGVEe][class*=cTvP0c]").get_attribute('href')
                            price_number = int(''.join(filter(str.isdigit, price)))
                            if "₹" in price:
                                price_number = round(int(price_number) / get_exchange_rate("INR"))
                            if "₪" in price:
                                price_number = round(int(price_number) / get_exchange_rate("ILS"))

                            hotel_dict[partner] = {
                                'channel': "google",
                                'partner': partner,
                                'price': price_number * trip_length,
                                'url': url
                            }
                        except Exception as e:
                            continue
                    print("Google hotels successful")                            
                    return list(hotel_dict.values())
                except Exception as e:
                        print("Error retrieving hotel prices:", e)

            except TimeoutException:
                print("Timeout occurred")
                retries = 0  # Exit loop after timeout
            except Exception as e:
                print(f"An error occurred: {str(e)}")
                retries -= 1
                if retries != 0:
                    print("Google hotels retrying")
                    protonvpn.check_status()
                    protonvpn.disconnect()
                    protonvpn.connect_to_india()
            finally:
                if driver:
                    driver.quit()
                
    except TimeoutException:
        print("Timeout occurred before any attempt")
    finally:
        signal.alarm(0)  # Disable the alarm

    print("google: unsuccessful tries")
    return []

