// checkUser.js
import fetch from "node-fetch";

async function checkUser(email, password) {
  try {
    const res = await fetch("http://localhost:5000/api/users/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.status === 200) {
      console.log(`✅ User ${email} tồn tại (login OK)`);
    } else if (res.status === 401) {
      console.log(`❌ User ${email} không tồn tại hoặc sai password`);
    } else {
      console.log(`⚠️ Lỗi khác: ${res.status}`);
    }
  } catch (err) {
    console.error("🚨 Không kết nối được server:", err.message);
  }
}

// Gọi hàm check
checkUser("admin@email.com", "123456");
