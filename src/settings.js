const EnvStorageTimeout = process.env.STORAGE_TIMEOUT;

const Settings = {
  StorageTimeout: EnvStorageTimeout || 3600000,
}

module.exports = Settings;
