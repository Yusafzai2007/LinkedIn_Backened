class apiResponse {
  constructor(message, statuscode, data) {
    this.message = message;
    this.statuscode = statuscode;
    this.data = data;
    this.success = true;
  }
}
export { apiResponse };
