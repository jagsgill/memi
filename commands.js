exports.commands = {
  list_dir_contents: {
    'darwin': (dir) => { return `ls -a ${dir}` },
    'freebsd': undefined,
    'linux': undefined,
    'sunos': undefined,
    'win32': undefined
  },
  disk_usage_summary: {
    'darwin': (dir) => { return `cd ${dir} && du -s *` }, // folders and files in current dir
    'freebsd': undefined,
    'linux': undefined,
    'sunos': undefined,
    'win32': undefined
  },
  disk_usage_all: {
    'darwin': (dir) => { return `du -a ${dir}` },
    'freebsd': undefined,
    'linux': undefined,
    'sunos': undefined,
    'win32': undefined
  }
}
