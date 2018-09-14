const logger = {
  paramsExport(title, ...messages) {
    if (title !== '') {
      this.log(title);
    }

    messages.forEach((element) => {
      this.log(element);
    });
  },

  log(message) {
    console.log(message);
  },
};

export default {
  fatal(...messages) {
    logger.paramsExport('【FATAL】', ...messages);
  },

  error(...messages) {
    logger.paramsExport('【ERROR】', ...messages);
  },

  warn(...messages) {
    logger.paramsExport('【WARN】', ...messages);
  },

  info(...messages) {
    logger.paramsExport('', ...messages);
  },

  debug(...messages) {
    logger.paramsExport('', ...messages);
  },

  trace(...messages) {
    logger.paramsExport('', ...messages);
  },
};
