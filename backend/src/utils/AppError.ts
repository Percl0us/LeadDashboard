class AppError extends Error {
  statusCode: number;
  constructor(message: string, StatusCode: number) {
    super(message);
    this.name = "AppError";
    this.statusCode = StatusCode;
  }
}
export default AppError;
