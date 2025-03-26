console.log("🚀 Content script loaded!");

let emailFetched = false; // Prevents duplicate fetching
let helperBox = null; // Stores the helper box globally

// ✅ Create the helper box when the page loads
createHelperBox();

document.addEventListener("click", function () {
    console.log("🖱 Click detected!");

    if (emailFetched) {
        console.log("🔁 Email already fetched, skipping...");
        return;
    }

    setTimeout(() => {
        const emailBody = document.querySelector("div[role='main']");
        const senderNameElement = document.querySelector(".gD"); // Gmail sender name

        if (emailBody) {
            let emailText = emailBody.innerText.trim();
            let senderName = senderNameElement ? senderNameElement.innerText : "Unknown Sender";

            if (emailText.length > 0) {
                console.log("📩 Extracted Email:", emailText);
                console.log("🧑‍💼 Sender Name:", senderName);

                // ✅ Send email content & sender name to background.js
                chrome.runtime.sendMessage({ action: "saveEmail", emailText, senderName }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("❌ Error sending message:", chrome.runtime.lastError);
                    } else {
                        console.log("✅ Email & sender name sent to background.js:", response);
                        emailFetched = true; // Prevents continuous fetching

                        // ✅ Update the helper box with new content
                        updateHelperBox(emailText, senderName);
                    }
                });
            } else {
                console.warn("⚠ Email detected but empty!");
            }
        } else {
            console.error("❌ Email not detected, check selector.");
        }
    }, 2000);
});

// ✅ Reset flag when the page refreshes
window.addEventListener("beforeunload", function () {
    emailFetched = false;
});

// ✅ Create the helper box
// ✅ Create the helper box
function createHelperBox() {
    console.log("🚀 Creating helper box!");

    if (document.getElementById("helperBox")) return; // Prevent duplicates

    helperBox = document.createElement("div");
    helperBox.id = "helperBox";
    helperBox.innerText = "Loading reply options..."; // Placeholder text
    helperBox.style.position = "fixed";
    helperBox.style.bottom = "20px";
    helperBox.style.right = "20px";
    helperBox.style.padding = "10px 15px";
    helperBox.style.backgroundColor = "pink";
    helperBox.style.color = "black";
    helperBox.style.fontSize = "14px";
    helperBox.style.borderRadius = "5px";
    helperBox.style.cursor = "pointer";
    helperBox.style.boxShadow = "0px 2px 5px rgba(0,0,0,0.2)";
    helperBox.style.zIndex = "10000";

    //✅ Add Close Button
    const closeButton = document.createElement("span");
    closeButton.innerText = "❌"; // Close icon
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "10px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "16px";
    closeButton.style.fontWeight = "bold";

    closeButton.addEventListener("click", function () {
        helperBox.style.display = "none"; // Hide the box
    });

    helperBox.appendChild(closeButton);
    document.body.appendChild(helperBox);

    console.log("✅ Helper box with close button added!");
}



// ✅ Update the helper box when email is fetched
function updateHelperBox(emailText, senderName) {
    console.log("🔄 Updating helper box with sender name:", senderName);

    if (!helperBox) return;

    helperBox.innerHTML = `
        <strong>Reply to: ${senderName}</strong><br>
        Choose a response type:
    `;

    // ✅ Add the reply buttons inside the helper box
    createReplyButtons(senderName);
}

// ✅ Create the reply buttons
// ✅ Create the reply buttons with a close button
function createReplyButtons(senderName) {
    console.log("🚀 Adding reply buttons!");

    const container = document.createElement("div");
    container.id = "replyButtonsContainer";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "8px";
    container.style.marginTop = "10px";

    const buttonStyles = {
        padding: "10px 15px",
        color: "black",
        fontSize: "14px",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
        textAlign: "center",
        width: "200px",
        fontWeight: "bold",
    };

    const buttonsData = [
        { id: "formalReply", text: "💙 Formal Reply", bgColor: "lightblue", message: `Dear ${senderName},\n\nThank you for reaching out. I appreciate your message and will respond soon.\n\nBest regards,\n[Your Name]` },
        { id: "informalReply", text: "💛 Informal Reply", bgColor: "lightyellow", message: `Hey ${senderName},\n\nThanks for your email! I'll get back to you soon.\n\nCheers!` },
        { id: "mixedReply", text: "💖 Mixed Reply", bgColor: "lightpink", message: `Hi ${senderName},\n\nThanks for reaching out. I'll get back to you shortly!\n\nBest,\n[Your Name]` }
    ];

    buttonsData.forEach(({ id, text, bgColor, message }) => {
        const button = document.createElement("div");
        button.id = id;
        button.innerText = text;
        button.style.backgroundColor = bgColor;
        Object.assign(button.style, buttonStyles);

        button.addEventListener("click", function () {
            console.log(`🖱 ${text} clicked!`);
            insertTextIntoReplyBox(message);
        });

        container.appendChild(button);
    });

    // ✅ Add Close Button in the buttons section
    const closeButton = document.createElement("div");
    closeButton.innerText = "❌ Close";
    closeButton.style.backgroundColor = "red";
    closeButton.style.color = "white";
    closeButton.style.textAlign = "center";
    closeButton.style.padding = "10px 15px";
    closeButton.style.fontSize = "14px";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.style.marginTop = "10px";
    closeButton.style.boxShadow = "0px 2px 5px rgba(0,0,0,0.2)";
    closeButton.style.fontWeight = "bold";

    closeButton.addEventListener("click", function () {
        helperBox.style.display = "none"; // Hide the whole box
    });

    container.appendChild(closeButton);
    helperBox.appendChild(container);

    console.log("✅ Reply buttons with close button added inside helper box!");
}

// ✅ Insert text into the Gmail reply box
function insertTextIntoReplyBox(message) {
    let replyBox = document.querySelector("div[aria-label='Message Body']");

    if (replyBox) {
        replyBox.innerText = message;
        console.log("✅ Text inserted into reply box!");
    } else {
        console.log("❌ Reply box not found. Retrying...");
        setTimeout(() => insertTextIntoReplyBox(message), 1000);
    }

}