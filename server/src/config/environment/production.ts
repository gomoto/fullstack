// Production specific configuration
// =================================
export default <IProductionEnvironment> {
  // Server IP
  ip: process.env.IP || undefined,

  // Server port
  port: process.env.PORT || 8080,
};

export interface IProductionEnvironment {
  ip: string;
  port: number;
}
