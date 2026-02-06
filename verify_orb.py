from playwright.sync_api import sync_playwright, expect

def test_voice_orb_interaction():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to home
        page.goto("http://localhost:5173")

        # Locate the voice orb
        orb = page.get_by_test_id("voice-orb")

        # Verify initial state and attributes
        expect(orb).to_be_visible()
        expect(orb).to_have_css("cursor", "pointer")
        expect(orb).to_have_attribute("role", "button")
        expect(orb).to_have_attribute("tabindex", "0")

        # Check ARIA label (Start Conversation in Arabic)
        expect(orb).to_have_attribute("aria-label", "بَدأ المحادثة")

        # Take initial screenshot
        page.screenshot(path="verification_initial.png")
        print("Initial state verified.")

        # Click the orb
        orb.click()

        # Verify state change
        # It should change to "Connecting..." or "Active"
        # Since keys are dummy, it might go to error or connecting.
        # "Connecting" label is 'جاري الاتصال'
        # "Connecting" state means aria-pressed="true"

        # Wait for potential state change
        page.wait_for_timeout(1000)

        # Check if aria-pressed became true or label changed
        # We expect aria-pressed to be true because isActive || isConnecting
        expect(orb).to_have_attribute("aria-pressed", "true")

        # Take active screenshot
        page.screenshot(path="verification_active.png")
        print("Interaction verified.")

        browser.close()

if __name__ == "__main__":
    test_voice_orb_interaction()
