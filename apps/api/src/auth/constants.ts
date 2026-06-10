export const jwtConstants = {
  // In production this must come from an environment variable
  secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
};
