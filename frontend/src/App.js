import React, { useState } from 'react';
import { PingRequest } from './generated/ping_pb';
import { PingerPromiseClient } from './generated/ping_grpc_web_pb';

// Direct requests to the Envoy proxy listening on port 8080
const client = new PingerPromiseClient('http://localhost:8080', null, null);

function App() {
  const [inputMessage, setInputMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendPing = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setLoading(true);
    setError(null);

    const request = new PingRequest();
    request.setMessage(inputMessage);

    try {
      const response = await client.ping(request, {});
      setResponseMessage(response.getMessage());
    } catch (err) {
      setError(err.message || 'Error communicating with gRPC server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '60px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h2>gRPC Ping Service</h2>
      <form onSubmit={handleSendPing}>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          {loading ? 'Sending...' : 'Send Ping'}
        </button>
      </form>

      {responseMessage && (
        <div style={{ marginTop: '24px', padding: '12px', background: '#eef9ee', border: '1px solid #c2e2c2', borderRadius: '4px' }}>
          <strong>Server Reply:</strong> {responseMessage}
        </div>
      )}

      {error && (
        <div style={{ marginTop: '24px', padding: '12px', background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default App;
