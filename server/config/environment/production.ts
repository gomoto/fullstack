// Production specific configuration
// =================================
export default {
  // Server IP
  ip: process.env.IP || undefined,

  // Server port
  port: process.env.PORT || 8080,
};
