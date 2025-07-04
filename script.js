// Subnet Calculator
function calculate() {
  const ipInput = document.getElementById("ip").value.trim();
  const cidr = parseInt(document.getElementById("subnet").value.slice(1));
  const resultsDiv = document.getElementById("results");

  if (!isValidIP(ipInput)) {
    resultsDiv.innerHTML = `<div class="result-item" style="color:red;">❌ Invalid IP Address</div>`;
    return;
  }

  const ipBinary = ipToBinary(ipInput);
  const subnetMaskBinary = "1".repeat(cidr).padEnd(32, "0");
  const subnetMask = binaryToIP(subnetMaskBinary);
  const networkBinary = getNetworkID(ipBinary, subnetMaskBinary);
  const broadcastBinary = getBroadcastID(networkBinary, cidr);
  const networkID = binaryToIP(networkBinary);
  const broadcastID = binaryToIP(broadcastBinary);

  const totalHosts = cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2;
  const firstHost = cidr >= 31 ? "N/A" : binaryToIP(incrementBinary(networkBinary));
  const lastHost = cidr >= 31 ? "N/A" : binaryToIP(decrementBinary(broadcastBinary));

  resultsDiv.innerHTML = `
    <div class="result-item"><strong>Network ID:</strong> ${networkID}</div>
    <div class="result-item"><strong>Broadcast Address:</strong> ${broadcastID}</div>
    <div class="result-item"><strong>Subnet Mask:</strong> ${subnetMask}</div>
    <div class="result-item"><strong>Total Hosts:</strong> ${totalHosts}</div>
    <div class="result-item"><strong>Valid Host Range:</strong> ${firstHost} - ${lastHost}</div>
    <div class="result-item"><strong>IP (Binary):</strong> ${formatBinary(ipBinary)}</div>
    <div class="result-item"><strong>Subnet Mask (Binary):</strong> ${formatBinary(subnetMaskBinary)}</div>
  `;
}

function isValidIP(ip) {
  const regex = /^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$/;
  return regex.test(ip);
}

function ipToBinary(ip) {
  return ip.split(".")
    .map(octet => parseInt(octet).toString(2).padStart(8, "0"))
    .join("");
}

function binaryToIP(bin) {
  return bin.match(/.{1,8}/g)
    .map(byte => parseInt(byte, 2))
    .join(".");
}

function getNetworkID(ipBin, maskBin) {
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += (ipBin[i] === "1" && maskBin[i] === "1") ? "1" : "0";
  }
  return result;
}

function getBroadcastID(networkBin, cidr) {
  return networkBin.slice(0, cidr).padEnd(32, "1");
}

function incrementBinary(bin) {
  return (BigInt("0b" + bin) + 1n).toString(2).padStart(32, "0");
}

function decrementBinary(bin) {
  return (BigInt("0b" + bin) - 1n).toString(2).padStart(32, "0");
}

function formatBinary(bin) {
  return bin.match(/.{1,8}/g).join(".");
}

// Dark Mode Toggle
const toggleBtn = document.getElementById("darkModeToggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  toggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
});

window.addEventListener("DOMContentLoaded", () => {
  const darkModeSetting = localStorage.getItem("darkMode");
  if (darkModeSetting === "enabled") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️ Light Mode";
  }
});

// CCNA Quiz
const quizData = [
  {
    question: "What is the default administrative distance of OSPF?",
    options: ["110", "120", "90", "100"],
    answer: "110"
  },
  {
    question: "Which command is used to view the routing table on a Cisco router?",
    options: ["show ip route", "show interface", "show ip protocols", "show running-config"],
    answer: "show ip route"
  },
  {
    question: "What is the range of Class C IP addresses?",
    options: ["128.0.0.0 – 191.255.255.255", "192.0.0.0 – 223.255.255.255", "224.0.0.0 – 239.255.255.255", "1.0.0.0 – 126.255.255.255"],
    answer: "192.0.0.0 – 223.255.255.255"
  },
  {
    question: "New Question?",
    options: ["A", "B", "C", "D"],
    answer: "B"
  }
];

let currentQuestion = 0;
let selectedOption = null;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const checkBtn = document.getElementById("check-answer");
const nextBtn = document.getElementById("next-question");

function loadQuestion() {
  const current = quizData[currentQuestion];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  nextBtn.style.display = "none";
  selectedOption = null;

  current.options.forEach(option => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => {
      document.querySelectorAll("#options button").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedOption = option;
    };
    li.appendChild(btn);
    optionsEl.appendChild(li);
  });
}

checkBtn.onclick = () => {
  if (!selectedOption) {
    feedbackEl.textContent = "Please select an option!";
    feedbackEl.style.color = "orange";
    return;
  }

  const correct = quizData[currentQuestion].answer;
  if (selectedOption === correct) {
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.style.color = "green";
  } else {
    feedbackEl.textContent = `❌ Wrong! Correct answer is: ${correct}`;
    feedbackEl.style.color = "red";
  }

  nextBtn.style.display = "block";
};

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    questionEl.textContent = "🎉 Quiz Completed!";
    optionsEl.innerHTML = "";
    feedbackEl.textContent = "";
    checkBtn.style.display = "none";
    nextBtn.style.display = "none";
  }
};

loadQuestion();
