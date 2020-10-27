'use strict';

const { 
  verifyPasswordLength, verifyPasswordStrength 
} = require('./constraints');

module.exports.password = async event => {
  try {
    const { password } = event.pathParameters;
    const { score } = await verifyPasswordStrength(password);

    await verifyPasswordLength(password);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Password score: ${score}`
      })
    }
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Error: ${e.message}`,
        score: e.score
      })
    }
  }
};
