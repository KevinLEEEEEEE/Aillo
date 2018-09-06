const logger = {
  paramsExport(title, message, params = undefined) {
    this.log(title + message);
    if (params !== undefined) {
      if (params instanceof Object) {
        Object.values(params).forEach(param => this.log(param));
      } else if (params instanceof Array) {
        params.forEach(param => this.log(param));
      } else {
        console.log(params);
      }
    }
  },
  log(message) {
    console.log(message);
  },
};

export default {
  fatal(message, ...params) {
    logger.paramsExport('【FATAL】', message, params);
  },
  error(message, ...params) {
    logger.paramsExport('【ERROR】', message, params);
  },
  warn(message, ...params) {
    logger.paramsExport('【WARN】', message, params);
  },
  info(message, ...params) {
    logger.paramsExport('', message, params);
  },
  debug(message, ...params) {
    logger.paramsExport('', message, params);
  },
  trace(message, ...params) {
    logger.paramsExport('', message, params);
  },
};
