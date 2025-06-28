function calculate() {
  const ipInput = document.getElementById("ip").value.trim();
  const cidr = parseInt(document.getElementById("subnet").value.slice(1));
  const resultsDiv = document.getElementById("results");

  // Validate IP
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

  // Show results
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
