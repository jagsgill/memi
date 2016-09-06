exports.commands = {
  list_dir_contents: {
    'darwin': (dir) => { return `ls -a ${dir}` }, // list all dir contents
    'freebsd': undefined,
    'linux': undefined,
    'sunos': undefined,
    'win32': undefined
  },
  disk_usage_summary: {
    'darwin': (dir) => { return `cd ${dir} && du -s *` }, // folders and files in current dir sizes
    'freebsd': undefined,
    'linux': undefined,
    'sunos': undefined,
    'win32': undefined
  },
  disk_usage_all: {
    'darwin': (dir) => { return `du -a ${dir}` }, // recurse to list all files/subdirs sizes
    'freebsd': undefined,
    'linux': undefined,
    'sunos': undefined,
    'win32': undefined
  }
}
