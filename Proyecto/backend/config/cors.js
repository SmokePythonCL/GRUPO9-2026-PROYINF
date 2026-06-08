const cors = require('cors');

module.exports = cors({
  origin: function (origin, callback) {

    if (!origin)
      return callback(null, true);

    const allowedOrigins = [
      /^http:\/\/localhost(:\d+)?$/,
      /^http:\/\/127\.0\.0\.1(:\d+)?$/
    ];

    const isAllowed =
      allowedOrigins.some(regex => regex.test(origin));

    if (isAllowed)
      callback(null, true);
    else
      callback(new Error('No permitido por CORS'));
  },

  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
});