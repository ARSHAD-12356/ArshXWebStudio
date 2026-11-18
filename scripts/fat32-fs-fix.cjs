/**
 * FAT32 / exFAT drives on Windows return EISDIR from readlink() on regular files and
 * folders, where Node tooling (webpack, Next.js) expects EINVAL ("not a symlink").
 * This preload maps EISDIR → EINVAL for readlink only, and re-exports itself to child
 * processes via NODE_OPTIONS so Next.js build workers get the same fix.
 * It's harmless on NTFS / macOS / Linux, where readlink never returns EISDIR.
 */
const fs = require("fs");
const path = require("path");

const self = path.resolve(__filename).replace(/\\/g, "/");
const flag = `--require "${self}"`;
if (!(process.env.NODE_OPTIONS || "").includes(self)) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ""} ${flag}`.trim();
}

const fix = (err) => {
  if (err && err.code === "EISDIR") {
    err.code = "EINVAL";
    err.errno = -4071;
  }
  return err;
};

const origSync = fs.readlinkSync;
fs.readlinkSync = function (...args) {
  try {
    return origSync.apply(this, args);
  } catch (e) {
    throw fix(e);
  }
};

const orig = fs.readlink;
fs.readlink = function (...args) {
  const cb = args[args.length - 1];
  if (typeof cb === "function") {
    args[args.length - 1] = (err, res) => cb(fix(err), res);
  }
  return orig.apply(this, args);
};

const origP = fs.promises.readlink;
fs.promises.readlink = function (...args) {
  return origP.apply(this, args).catch((e) => {
    throw fix(e);
  });
};
