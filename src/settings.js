const EnvStorageTimeout = process.env.STORAGE_TIMEOUT;

const settings = {
  storageTimeout: EnvStorageTimeout || 3600000,
}

module.exports = settings;
