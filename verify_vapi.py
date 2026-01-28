from playwright.sync_api import sync_playwright, expect
import time

def verify_vapi_demo(page):
    # Navigate to Demo page
    page.goto("http://localhost:5173/demo.html")

    # Wait for the page to load
    page.wait_for_selector(".voice-orb")

    # Check if the title is correct
    expect(page.get_by_role("heading", name="جرب الوكيل الصوتي")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="/home/jules/verification/demo_page.png")
    print("Screenshot taken")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_vapi_demo(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
