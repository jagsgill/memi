exports.commands = {
  list_dir_contents: {
    'darwin': (dir) => { return `ls -a ${dir}` }, // list all dir contents
    'freebsd': undefined,
    'linux': undefined,
    'sunos': undefined,
    'win32': undefined
  },
  disk_usage_summary: {
     // folders and files sizes in current dir, including hidden
     // TODO tests
     // any differences between shells (bash vs zsh vs ...)
     // total subdir/file sizes == total for dir
     // all files/subdirs listed, including hidden
    'darwin': (dir) => { return `cd ${dir} && du -sc .[^.]* *` },
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
