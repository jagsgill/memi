const script_path = process.cwd()+'/dev/backend/scripts/'

function cmdRunMacScript(script_name, dir){
  return `bash ${script_path}/${script_name} ${dir}`
}

exports.commands = {
  list_dir_contents: {
    // list all dir contents
    'darwin': undefined,
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
    'darwin': (dir) => { return cmdRunMacScript('disk_usage_summary_MAC.sh', dir)},
    'freebsd': undefined,
    'linux': undefined,
    'sunos': undefined,
    'win32': undefined
  }
}
