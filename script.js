console.log("Script loaded");

function calculate() {
  const input = document.getElementById("ipInput").value.trim();
  const outputDiv = document.getElementById("output");

  const match = input.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d{1,2})$/);

  if (!match) {
    outputDiv.textContent = "❌ Invalid input. Use format: 192.168.1.1/24";
    return;
  }

  const [_, a, b, c, d, cidr] = match.map(Number);

  if ([a, b, c, d].some(octet => octet < 0 || octet > 255) || cidr < 0 || cidr > 32) {
    outputDiv.textContent = "❌ Invalid IP or CIDR range.";
    return;
  }

  const ip = (a << 24) | (b << 16) | (c << 8) | d;
  const mask = 0xffffffff << (32 - cidr);
  const network = ip & mask;
  const broadcast = network | (~mask >>> 0);
  const numHosts = cidr === 32 ? 1 : (cidr === 31 ? 2 : (2 ** (32 - cidr)) - 2);

  function intToIp(num) {
    return `${(num >>> 24)}.${(num >>> 16 & 255)}.${(num >>> 8 & 255)}.${(num & 255)}`;
  }

  outputDiv.innerHTML = `
    <strong>✅ Subnet Calculation:</strong><br><br>
    <strong>IP Address:</strong> ${input}<br>
    <strong>Subnet Mask:</strong> ${intToIp(mask)}<br>
    <strong>Network Address:</strong> ${intToIp(network)}<br>
    <strong>Broadcast Address:</strong> ${intToIp(broadcast)}<br>
    <strong>Number of Hosts:</strong> ${numHosts}
  `;
}
