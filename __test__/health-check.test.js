const { agent } = require("../src/lib/test");

describe('Healthcheck', () => {
  it('returns 200 if server is healthy', async () => {
      const res = await agent.get(`/api/health`);
      expect(res.statusCode).toBe(200)
    expect(res.body.uptime).toBeGreaterThan(0);
  });
});
