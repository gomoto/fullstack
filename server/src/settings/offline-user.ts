const settings = {
  enabled: process.env.OFFLINE_USER === 'true',
  id: process.env.OFFLINE_USER_ID || 'test',
  name: process.env.OFFLINE_USER_NAME || 'Test',
  permissions: process.env.OFFLINE_USER_PERMISSIONS && process.env.OFFLINE_USER_PERMISSIONS.split(',') || [],
};

export { settings }
