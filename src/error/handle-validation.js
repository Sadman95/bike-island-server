const handleValidation = error => {
  const { statusCode, message, errorMessages } = error

  return {
    statusCode,
    message,
    errorMessages,
  }
}

module.exports = handleValidation
