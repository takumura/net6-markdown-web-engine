const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
    ],
    target: "https://localhost:51488",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
