import http from "node:http";
import net from "node:net";

const LISTEN_PORT = Number(process.env.PROXY_PORT || process.env.PORT || 5000);
const UPSTREAM_HOST = process.env.PROXY_UPSTREAM_HOST || "127.0.0.1";
const UPSTREAM_PORT = Number(process.env.PROXY_UPSTREAM_PORT || 80);

function proxyRequest(req, res) {
  const headers = { ...req.headers, host: `${UPSTREAM_HOST}:${UPSTREAM_PORT}` };
  const upstream = http.request(
    {
      host: UPSTREAM_HOST,
      port: UPSTREAM_PORT,
      method: req.method,
      path: req.url,
      headers,
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    },
  );
  upstream.on("error", (err) => {
    if (!res.headersSent) res.writeHead(502, { "content-type": "text/plain" });
    res.end(`dev-proxy upstream error: ${err.message}`);
  });
  req.pipe(upstream);
}

function proxyUpgrade(req, clientSocket, head) {
  const upstream = net.connect(UPSTREAM_PORT, UPSTREAM_HOST, () => {
    const headerLines = [`${req.method} ${req.url} HTTP/1.1`];
    for (const [k, v] of Object.entries(req.headers)) {
      if (Array.isArray(v)) for (const item of v) headerLines.push(`${k}: ${item}`);
      else if (v !== undefined) headerLines.push(`${k}: ${v}`);
    }
    upstream.write(headerLines.join("\r\n") + "\r\n\r\n");
    if (head && head.length) upstream.write(head);
    upstream.pipe(clientSocket);
    clientSocket.pipe(upstream);
  });
  upstream.on("error", () => clientSocket.destroy());
  clientSocket.on("error", () => upstream.destroy());
}

const server = http.createServer(proxyRequest);
server.on("upgrade", proxyUpgrade);
server.listen(LISTEN_PORT, "0.0.0.0", () => {
  console.log(
    `[dev-proxy] forwarding 0.0.0.0:${LISTEN_PORT} -> ${UPSTREAM_HOST}:${UPSTREAM_PORT}`,
  );
});
