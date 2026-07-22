const LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function resolveLevel() {
  const fromEnv = (process.env.LOG_LEVEL || '').toLowerCase();
  if (fromEnv in LEVELS) {
    return LEVELS[fromEnv];
  }
  return process.env.NODE_ENV === 'production' ? LEVELS.info : LEVELS.debug;
}

const minLevel = resolveLevel();

function write(level, message, meta) {
  if (LEVELS[level] < minLevel) {
    return;
  }

  const entry = {
    level,
    time: new Date().toISOString(),
    message,
    service: 'parkar-pms-backend',
  };

  if (meta && typeof meta === 'object' && Object.keys(meta).length > 0) {
    entry.meta = meta;
  }

  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

const logger = {
  debug(message, meta) {
    write('debug', message, meta);
  },
  info(message, meta) {
    write('info', message, meta);
  },
  warn(message, meta) {
    write('warn', message, meta);
  },
  error(message, meta) {
    write('error', message, meta);
  },
};

module.exports = { logger };
