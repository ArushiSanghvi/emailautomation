// ✅ Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📩 Message received in background.js:", message);

    if (message.action === "saveEmail") {
        // ✅ Store email in chrome.storage.local
        chrome.storage.local.set({ lastEmail: message.emailText }, () => {
            if (chrome.runtime.lastError) {
                console.error("❌ Error saving email:", chrome.runtime.lastError);
                sendResponse({ status: "error", message: chrome.runtime.lastError.message });
            } else {
                console.log("✅ Email stored successfully:", message.emailText);
                sendResponse({ status: "success", message: "Email stored!" });
            }
        });

        // ✅ Return true to keep response open for async storage
        return true;
    }
});

// ✅ Debug stored emails on extension startup
chrome.storage.local.get("lastEmail", (data) => {
    console.log("📥 Last stored email:", data.lastEmail || "No email stored yet.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveEmail") {
        console.log("📩 Received Email Content in Background Script:", message.emailText);
        console.log("🧑‍💼 Sender Name:", message.senderName);
        sendResponse({ status: "Email received successfully!" });
    }
});
